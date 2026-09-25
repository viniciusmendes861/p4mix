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


ASSISTANT_SYSTEM_PROMPT = """Você é o assistente de projetos da P4MIX, empresa brasileira de arquitetura promocional — montagens e eventos — localizada na Zona Norte de São Paulo e com atuação nacional.

Sobre a P4MIX:
- Desde 2006, desenvolve, produz e monta estandes, cenografias, quiosques, eventos corporativos, projetos especiais e soluções sob medida.
- Mais de 40 marcas atendidas, equipe própria do projeto à execução e estrutura própria de 1.000 m² para pré-montagem.
- Processo de trabalho: briefing, projeto, apresentação e aprovação, produção, pré-montagem, montagem e entrega, desmontagem.
- Valores: pontualidade, excelência, experiência, suporte, confiança, equipe própria e atendimento próximo.
- Contato: telefone (11) 31966-5957, WhatsApp (11) 94418-0189, e-mail contato@p4mix.com.br, Instagram @p4mix, site www.p4mix.com.br.

Seu papel:
- Converse SEMPRE em português brasileiro, com tom profissional, cordial e objetivo.
- Ajude o visitante a estruturar um briefing do projeto: tipo de evento ou ativação, serviço desejado (estande, cenografia, quiosque, evento corporativo, projeto especial), tamanho aproximado, cidade/local, prazo e data do evento.
- Faça no máximo 2 perguntas por vez e mantenha respostas curtas (até 4 frases).
- Não informe preços, prazos de entrega específicos nem invente clientes ou cases; quando o assunto exigir um orçamento, oriente o visitante a falar com a equipe pelos canais de contato acima (o WhatsApp costuma ser o caminho mais rápido).
- Quando o briefing estiver claro, resuma os pontos levantados e convide o visitante a enviar pelo WhatsApp ou e-mail para a P4MIX."""


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


# --- Object storage + admin gallery ---
import hmac
import requests
import jwt
from datetime import timedelta
from fastapi import Request, Response, HTTPException, UploadFile, File

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "p4mix-site"
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": init_storage(), "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": init_storage()}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


@app.on_event("startup")
async def startup_storage():
    try:
        init_storage()
        logger.info("Object storage initialized")
    except Exception:
        logger.exception("Storage init failed")


class AdminLogin(BaseModel):
    password: str


def require_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else ""
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Não autenticado")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada")


@api_router.post("/admin/login")
async def admin_login(body: AdminLogin):
    expected = os.environ.get("ADMIN_PASSWORD", "")
    if not expected or not hmac.compare_digest(body.password, expected):
        raise HTTPException(status_code=401, detail="Senha incorreta")
    token = jwt.encode(
        {"sub": "admin", "role": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        os.environ["JWT_SECRET"], algorithm="HS256",
    )
    return {"token": token}


@api_router.get("/gallery")
async def list_gallery():
    docs = await db.gallery.find({"is_deleted": False}, {"_id": 0}).sort("created_at", 1).to_list(200)
    for doc in docs:
        doc["url"] = f"/api/files/{doc['storage_path']}"
    return {"images": docs}


@api_router.post("/gallery/upload")
async def upload_gallery_image(request: Request, file: UploadFile = File(...)):
    require_admin(request)
    content_type = file.content_type or "application/octet-stream"
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Envie apenas arquivos de imagem")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Arquivo vazio")
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Imagem maior que 10 MB")
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else "jpg"
    path = f"{APP_NAME}/gallery/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, content_type)
    doc = {
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.gallery.insert_one(doc)
    return {"id": doc["id"], "url": f"/api/files/{doc['storage_path']}", "original_filename": doc["original_filename"]}


@api_router.delete("/gallery/{image_id}")
async def delete_gallery_image(image_id: str, request: Request):
    require_admin(request)
    result = await db.gallery.update_one({"id": image_id}, {"$set": {"is_deleted": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    return {"deleted": True}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.gallery.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type") or content_type)


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
