import { useEffect, useState } from "react";
import { ArrowUpRight, ImagePlus, Loader2, LogOut, Trash2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = "p4mix-admin-token";

function formatError(value, fallback) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map((item) => item?.msg || "").filter(Boolean).join(" ");
  return fallback;
}

export function AdminPanel() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function loadImages() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch {
      /* keep list as-is */
    }
  }

  useEffect(() => {
    if (token) loadImages();
  }, [token]);

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  async function login(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(formatError(data.detail, "Falha no login"));
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      setError(err.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(fileList)) {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch(`${BACKEND_URL}/api/gallery/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401) {
          logout();
          throw new Error("Sessão expirada. Entre novamente.");
        }
        if (!response.ok) throw new Error(formatError(data.detail, `Falha ao enviar ${file.name}`));
      }
      await loadImages();
    } catch (err) {
      setError(err.message || "Falha no envio");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(id) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        logout();
        return;
      }
      setImages((prev) => prev.filter((image) => image.id !== id));
    } catch {
      /* keep list as-is */
    }
  }

  if (!token) {
    return (
      <main className="admin-shell" data-testid="admin-login-view">
        <form className="admin-card" onSubmit={login} data-testid="admin-login-form">
          <img src="/logo-oficial.png" alt="P4MIX — Arquitetura Promocional" className="admin-brand-logo" />
          <h1 className="admin-title">Área restrita</h1>
          <p className="admin-subtitle">Gerencie as fotos da galeria de projetos do site.</p>
          <label className="admin-label" htmlFor="admin-password">
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            className="admin-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            data-testid="admin-password-input"
          />
          {error && (
            <p className="admin-error" data-testid="admin-login-error">
              {error}
            </p>
          )}
          <button className="admin-button" type="submit" disabled={loading || !password} data-testid="admin-login-button">
            {loading ? "Entrando…" : "Entrar"}
          </button>
          <a className="admin-back" href="#inicio" data-testid="admin-back-link">
            Voltar ao site <ArrowUpRight size={14} />
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell admin-shell-top" data-testid="admin-panel">
      <div className="admin-card admin-panel-wide">
        <div className="admin-panel-header">
          <div>
            <h1 className="admin-title">Galeria de projetos</h1>
            <p className="admin-subtitle" data-testid="admin-gallery-count">
              {images.length} foto(s) publicadas no site
            </p>
          </div>
          <div className="admin-actions">
            <a className="admin-back" href="#inicio" data-testid="admin-back-link">
              Ver site <ArrowUpRight size={14} />
            </a>
            <button type="button" className="admin-logout" onClick={logout} data-testid="admin-logout-button">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </div>
        <label className={`admin-drop ${uploading ? "admin-drop-busy" : ""}`} data-testid="admin-upload-drop">
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(event) => {
              uploadFiles(event.target.files);
              event.target.value = "";
            }}
            data-testid="admin-upload-input"
          />
          {uploading ? <Loader2 size={22} className="spin" /> : <ImagePlus size={22} />}
          <span>{uploading ? "Enviando fotos…" : "Clique para enviar fotos (JPG, PNG ou WebP — até 10 MB cada)"}</span>
        </label>
        {error && (
          <p className="admin-error" data-testid="admin-upload-error">
            {error}
          </p>
        )}
        <div className="admin-grid" data-testid="admin-gallery-grid">
          {images.map((image, index) => (
            <figure className="admin-thumb" key={image.id} data-testid={`admin-image-${index + 1}`}>
              <img src={`${BACKEND_URL}${image.url}`} alt={image.original_filename || "Foto de projeto P4mix"} />
              <button type="button" onClick={() => removeImage(image.id)} aria-label="Remover imagem" data-testid={`admin-delete-${index + 1}`}>
                <Trash2 size={14} />
              </button>
            </figure>
          ))}
          {images.length === 0 && (
            <p className="admin-empty" data-testid="admin-gallery-empty">
              Nenhuma foto enviada ainda. Enquanto isso, o site exibe as fotos do estande Balões São Roque.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
