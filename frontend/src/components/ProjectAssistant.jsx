import { useEffect, useRef, useState } from "react";
import { MessageSquare, SendHorizonal, X } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GREETING = "Olá! Sou o assistente de projetos da P4mix. Me conte sobre o seu evento ou estande — tipo de evento, tamanho e prazo — e eu ajudo a estruturar o briefing antes de falar com nossa equipe.";

export function ProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())));
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setStreaming(true);

    const appendToLast = (content) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + content };
        return next;
      });

    const failWith = (content) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content, error: true };
        return next;
      });

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const payload = part.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const data = JSON.parse(payload);
            if (data.content) appendToLast(data.content);
            else if (data.error) failWith(data.error);
          } catch {
            /* ignore malformed chunk */
          }
        }
      }
    } catch {
      failWith("Desculpe, tive um problema para responder. Tente novamente ou fale direto pelo (11) 31966-5957.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className={`assistant ${open ? "assistant-open" : ""}`} data-testid="project-assistant">
      {open && (
        <section className="assistant-panel" aria-label="Assistente de projetos" data-testid="assistant-panel">
          <header className="assistant-header">
            <div>
              <strong data-testid="assistant-title">Assistente de projeto</strong>
              <span data-testid="assistant-subtitle">Briefing com IA · P4mix</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar assistente" data-testid="assistant-close-button">
              <X size={18} />
            </button>
          </header>
          <div className="assistant-messages" ref={listRef} data-testid="assistant-messages">
            {messages.map((message, index) => (
              <p
                key={index}
                className={`assistant-message assistant-message-${message.role} ${message.error ? "assistant-message-error" : ""}`}
                data-testid={`assistant-message-${message.role}-${index}`}
              >
                {message.content || (streaming && index === messages.length - 1 ? "…" : "")}
              </p>
            ))}
          </div>
          <div className="assistant-input-row">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Descreva seu projeto…"
              aria-label="Mensagem para o assistente"
              data-testid="assistant-input"
            />
            <button type="button" onClick={send} disabled={streaming || !input.trim()} aria-label="Enviar mensagem" data-testid="assistant-send-button">
              <SendHorizonal size={17} />
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar assistente" : "Abrir assistente de projeto"}
        aria-expanded={open}
        data-testid="assistant-launcher-button"
      >
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </div>
  );
}
