from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks


ASSISTANT_SYSTEM_PROMPT = """Você é o assistente de projetos da P4mix, empresa brasileira de arquitetura promocional, montagens e eventos, localizada na Zona Norte de São Paulo.

Sobre a P4mix:
- Mais de 15 anos de experiência em estandes promocionais, cenografias, displays, quiosques promocionais e convenções.
- Estrutura própria de 1.000 m² que permite pré-montar e ajustar os projetos antes do evento.
- Valores: pontualidade, excelência, suporte e confiança.
- Contato: telefone (11) 31966-5957, e-mail contato@p4mix.com.br, Instagram @p4mix, site www.p4mix.com.br.

Seu papel:
- Converse SEMPRE em português brasileiro, com tom profissional, cordial e objetivo.
- Ajude o visitante a estruturar um briefing do projeto: tipo de evento ou ativação, serviço desejado (estande, cenografia, display, quiosque, convenção), tamanho aproximado, cidade/local, prazo e data do evento.
- Faça no máximo 2 perguntas por vez e mantenha respostas curtas (até 4 frases).
- Não informe preços, prazos de entrega específicos nem invente clientes ou cases; quando o assunto exigir um orçamento, oriente o visitante a falar com a equipe pelos canais de contato acima.
- Quando o briefing estiver claro, resuma os pontos levantados e convide o visitante a enviar pelo e-mail ou ligar para a P4mix."""


class ChatRequest(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str = Field(min_length=1, max_length=2000)


chat_sessions: dict[str, LlmChat] = {}


@api_router.post("/chat")
async def chat(request: ChatRequest):
    session = chat_sessions.get(request.session_id)
    if session is None:
        session = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=request.session_id,
            system_message=ASSISTANT_SYSTEM_PROMPT,
        ).with_model("anthropic", "claude-sonnet-5")
        chat_sessions[request.session_id] = session

    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one({
        "session_id": request.session_id,
        "role": "user",
        "content": request.message,
        "timestamp": now,
    })

    async def event_stream():
        chunks: list[str] = []
        try:
            async for event in session.stream_message(UserMessage(text=request.message)):
                if isinstance(event, TextDelta):
                    chunks.append(event.content)
                    yield f"data: {json.dumps({'content': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception:
            logger.exception("Assistant stream failed")
            yield f"data: {json.dumps({'error': 'Não consegui responder agora. Tente novamente em instantes.'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        await db.chat_messages.insert_one({
            "session_id": request.session_id,
            "role": "assistant",
            "content": "".join(chunks),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
