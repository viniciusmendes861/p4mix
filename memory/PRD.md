# P4mix Institutional Website — PRD

## Original Problem Statement
Build a modern, professional, responsive institutional website for P4mix based on the PDF "APRESENTAÇÃO P4MIX.pdf" as the single source of truth: company showcase covering history, services, expertise, differentiators, values, and contact. Site copy in Portuguese (pt-BR); professional corporate identity extracted from the PDF branding.

## Architecture
- React frontend (single-page landing) + FastAPI backend + MongoDB.
- Frontend: `/app/frontend/src/App.js` (sections), `/app/frontend/src/components/ProjectAssistant.jsx` (AI chat widget), styles in `/app/frontend/src/App.css`.
- Backend: `/app/backend/server.py` — health check, status endpoints, and `POST /api/chat` (SSE streaming assistant).
- AI: Claude Sonnet 5 (anthropic) via `emergentintegrations` + `EMERGENT_LLM_KEY` (universal key in `/app/backend/.env`).

## User Personas
- Marketing/event managers researching stand & scenography vendors for fairs and activations.
- Brand owners wanting a quick, trustworthy overview and an easy first contact.

## Core Requirements (static)
- PDF is the single source of truth; no invented facts, stats, or contacts.
- Clean, modern, responsive corporate design; Portuguese copy.
- Sections: header/nav, hero, about, services, expertise, projects, facility, contact, footer.

## Implemented
- 2026-07: Full landing page (hero, intro strip, about, 6 service cards, expertise list, project mosaic, 1.000 m² facility section, contact, footer) with dark-sophisticated corporate identity + lime accent; mobile/tablet/desktop responsive; data-testids throughout.
- 2026-07: "Assistente de projeto" — floating AI chat widget (Claude Sonnet 5, Emergent LLM key) that interviews visitors in Portuguese to structure a project brief (event type, size, deadline) and routes them to P4mix contact channels. Backend streams replies via SSE; chat history persisted to MongoDB (`chat_messages` collection).

## Verified
- `POST /api/chat` streams token-by-token (SSE), multi-turn context retained (tested with Expo Center Norte / 50 m² scenario), replies in pt-BR.
- Widget open/close, send, streamed rendering verified via browser screenshot.

## Backlog
- P0: none
- P1: Business hours section when P4mix provides them
- P2: Browsable project gallery filtered by service
- P2: Privacy-friendly lead/contact-link engagement tracking

## Next Tasks
1. Collect business hours from the user and add to contact section.
2. Expand project showcase into filterable gallery (needs real project images).
