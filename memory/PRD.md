# P4mix Institutional Website — PRD

## Original Problem Statement
Build a modern, professional, responsive institutional website for P4mix based on the PDF "APRESENTAÇÃO P4MIX.pdf" as the single source of truth. Site copy in Portuguese (pt-BR); corporate identity from the PDF branding. Content updates are provided directly by the owner via chat.

## Architecture
- React frontend (single-page) + FastAPI backend + MongoDB + Emergent object storage.
- Frontend: `/app/frontend/src/App.js` (all sections + motion), `/app/frontend/src/components/ProjectAssistant.jsx` (AI chat), `/app/frontend/src/components/AdminPanel.jsx` (gallery admin), styles in `/app/frontend/src/App.css`.
- Backend `/app/backend/server.py`: health, `POST /api/chat` (SSE, Claude Sonnet 5 via Emergent LLM key), `POST /api/admin/login` (env-password + JWT), `GET /api/gallery`, `POST /api/gallery/upload`, `DELETE /api/gallery/{id}` (soft delete), `GET /api/files/{path}` (serves from object storage).
- Assets: official logo extracted from PDF → `/app/frontend/public/logo-white.png`; project photos in `/app/frontend/public/projects/*.jpg`; favicon `/app/frontend/public/favicon.svg`.

## User Personas
- Marketing/event managers evaluating stand & scenography vendors.
- The P4mix owner, who manages gallery photos himself via the admin area.

## Implemented (2026-07)
- Full landing page: kinetic hero (masked line reveal + parallax), editorial marquee, intro, about with 4 highlights (Desde 2006, 40+ marcas, equipe própria, atuação nacional), 6 services with taglines, 7-step process section, projects with real Balões São Roque photos, facility (1.000 m²), 7 values grid, contact with WhatsApp (11) 94418-0189, footer with official logo + Admin link.
- Motion system: framer-motion scroll reveals, Lenis smooth scrolling, hero parallax.
- AI "Assistente de projeto" (Claude Sonnet 5, streaming, pt-BR, WhatsApp-aware).
- Admin gallery: password gate (`#admin`), multi-image upload to object storage, soft-delete; public strip shows uploads, falls back to local Balões São Roque photos.

## Verified
- Admin API chain: 401 on wrong password, login, upload, serve (200 image/jpeg), list, delete.
- Hero marquee/process/projects/values/contact render on desktop; hero fits at 375px; admin login + panel flow in browser.
- Assistant chat streams pt-BR with multi-turn context.

## Pending / Blocked
- P1: Business hours when provided.
- P2: Filterable project gallery page; lead/engagement tracking.
- Done 2026-07: hero background now uses the real MedLevensohn mezzanine photo (`/projects/medlevensohn-mezanino.jpg`).

## Credentials
- See `/app/memory/test_credentials.md` — admin password for gallery: P4mix@galeria2026
