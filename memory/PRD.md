# P4mix Institutional Website PRD

## Original Problem Statement
Create a modern, professional, responsive institutional website for the company described in the uploaded PDF APRESENTAÇÃO P4MIX.pdf. Treat the PDF as the primary source of truth, use only supported company information, and present the company, history, services/products, expertise, differentiators, portfolio, contact details, and visual identity in a polished corporate showcase. The website should be responsive, accessible, maintainable, SEO-friendly, and functional as a clear company presentation rather than e-commerce.

## User Choices
- Contact area uses contact details only; no message form.
- PDF is the source of truth.

## Architecture Decisions
- Frontend: React 19 single-page institutional marketing site.
- Styling: modular semantic sections in App.js with responsive App.css and global index.css.
- Content: static, sourced from the PDF; no backend data dependency needed for this showcase.
- Navigation: anchored one-page navigation with a responsive mobile menu.
- Imagery: professional event/exhibition imagery from the generated design direction, used as decorative portfolio/facility visuals.
- Backend: starter FastAPI health endpoint remains intact; no new API or database model was required.

## Implemented
- P4mix-branded dark, lime, and neutral visual identity with Space Grotesk / DM Sans typography.
- Responsive header, desktop navigation, mobile menu, and CTA links.
- Hero section with value proposition, 15+ years experience, São Paulo location, and CTA.
- About section with 1,000 m² facility, qualified team, quality materials, positioning, and supported values.
- Solutions grid for stands, project design, scenography, displays/kiosks, conventions, and efficient assembly.
- Expertise section and supported differentiators.
- Visual project mosaic and facility/pre-assembly section.
- Contact details for phone, email, website, and Instagram only.
- Professional footer, document title, language metadata, and meta description.
- Unique descriptive data-testid attributes across critical content and interactive elements.
- Verified production build, live browser flow, responsive mobile menu, exact contact links, image loading, and backend health.

## Prioritized Backlog
### P0
- Keep PDF-derived content reviewed by the business owner before publishing any new claim.

### P1
- Add real project images and project names from a confirmed P4mix portfolio source if the company supplies them.
- Add a verified street address and business hours if P4mix provides those details.

### P2
- Add a lightweight project filtering/gallery interaction once a confirmed portfolio catalog exists.
- Add analytics or conversion tracking after the desired business goals are defined.
