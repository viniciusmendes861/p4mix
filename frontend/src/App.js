import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  DraftingCompass,
  Instagram,
  Layers3,
  Mail,
  Menu,
  MessageCircle,
  MoveRight,
  Phone,
  Sparkles,
  Store,
  UsersRound,
  X,
} from "lucide-react";
import { AdminPanel } from "@/components/AdminPanel";
import { ProjectAssistant } from "@/components/ProjectAssistant";
import "@/App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const images = {
  hero: "/projects/medlevensohn-mezanino.jpg",
  facility:
    "https://images.unsplash.com/photo-1584564928625-483c5be78288?auto=format&fit=crop&w=1200&q=85",
  projectMain: "/projects/baloes-sao-roque-5.jpg",
  projectSecondary: "/projects/baloes-sao-roque-4.jpg",
};

const projectGallery = [
  { src: "/projects/baloes-sao-roque-1.jpg", alt: "Estande Balões São Roque com balcão de atendimento e mesas de apoio" },
  { src: "/projects/baloes-sao-roque-2.jpg", alt: "Vista lateral do estande Balões São Roque com letreiro curvo" },
  { src: "/projects/baloes-sao-roque-3.jpg", alt: "Cenografia com colunas e esculturas de balões no estande" },
];

const services = [
  {
    number: "01",
    icon: Building2,
    title: "Estandes",
    tagline: "Projetos que dão presença à sua marca.",
    description: "Estandes personalizados para feiras e exposições, pensados para valorizar sua marca e criar uma experiência marcante para o público.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Cenografias",
    tagline: "Ambientes que dão forma às experiências.",
    description: "Criamos cenografias que transformam espaços, valorizam conceitos e criam pontos de conexão entre marcas e pessoas.",
  },
  {
    number: "03",
    icon: Store,
    title: "Quiosques",
    tagline: "Sua marca também pode ocupar espaços permanentes.",
    description: "Projetamos quiosques personalizados para diferentes ambientes, unindo identidade, funcionalidade e presença de marca.",
  },
  {
    number: "04",
    icon: UsersRound,
    title: "Eventos corporativos",
    tagline: "Espaços pensados para conectar pessoas e marcas.",
    description: "Desenvolvemos ambientes e estruturas para eventos corporativos, encontros, ativações e experiências empresariais.",
  },
  {
    number: "05",
    icon: DraftingCompass,
    title: "Projetos especiais",
    tagline: "Quando o projeto pede uma solução sob medida.",
    description: "Desenvolvemos soluções personalizadas para demandas que exigem criatividade, planejamento e uma execução pensada nos detalhes.",
  },
  {
    number: "06",
    icon: Layers3,
    title: "Soluções sob medida",
    tagline: "Uma ideia diferente também pode ganhar forma.",
    description: "Do conceito à execução, encontramos a melhor solução para projetos que não cabem em formatos convencionais.",
  },
];

const highlights = [
  { value: "Desde 2006", label: "Experiência" },
  { value: "40+", label: "Marcas atendidas" },
  { value: "Equipe própria", label: "Do projeto à execução" },
  { value: "Atuação nacional", label: "Projetos em todo o Brasil" },
];

const processSteps = [
  {
    title: "BRIEFING",
    description: "Tudo começa entendendo o seu projeto. Recebemos as informações sobre o evento, espaço, necessidades e objetivos da sua marca para entender exatamente o que você precisa.",
  },
  {
    title: "PROJETO",
    description: "Transformamos a ideia em uma solução. Desenvolvemos o projeto de acordo com o briefing, considerando identidade da marca, espaço, necessidades e possibilidades de execução.",
  },
  {
    title: "APRESENTAÇÃO E APROVAÇÃO",
    description: "Você visualiza o projeto antes de ele sair do papel. Apresentamos a proposta e ajustamos os detalhes necessários até chegarmos à solução aprovada.",
  },
  {
    title: "PRODUÇÃO",
    description: "Com o projeto aprovado, começa a execução. Nossa equipe transforma o projeto em estrutura, preparando cada elemento para a montagem.",
  },
  {
    title: "PRÉ-MONTAGEM",
    description: "Antes do evento, conferimos tudo. Quando solicitada, realizamos a pré-montagem para que o cliente possa visualizar, conferir e aprovar a estrutura antes de ela chegar ao evento.",
  },
  {
    title: "MONTAGEM E ENTREGA",
    description: "É hora de transformar o projeto em realidade. Nossa equipe realiza a montagem no evento, acompanha a entrega e permanece próxima durante o evento para oferecer o suporte necessário.",
  },
  {
    title: "DESMONTAGEM",
    description: "Depois do evento, encerramos o projeto com o mesmo cuidado.",
  },
];

const differentiators = [
  { title: "PONTUALIDADE", description: "Planejamento e compromisso para que cada etapa aconteça no tempo certo." },
  { title: "EXCELÊNCIA", description: "Atenção aos detalhes para entregar um projeto à altura da sua marca." },
  { title: "EXPERIÊNCIA", description: "Desde 2006, transformando projetos em espaços para marcas, eventos e experiências." },
  { title: "SUPORTE", description: "Acompanhamento próximo antes, durante e depois da montagem." },
  { title: "CONFIANÇA", description: "Uma parceria construída com transparência, responsabilidade e proximidade." },
  { title: "EQUIPE PRÓPRIA", description: "Profissionais envolvidos diretamente na execução e no acompanhamento de cada projeto." },
  { title: "ATENDIMENTO PRÓXIMO", description: "Escutamos, alinhamos e acompanhamos cada projeto de forma próxima e flexível." },
];

const marqueeItems = ["Estandes", "Cenografias", "Quiosques", "Eventos corporativos", "Projetos especiais", "Soluções sob medida"];

const contactLines = [
  { icon: Phone, label: "Telefone", value: "(11) 31966-5957", href: "tel:+5511319665957", testId: "contact-phone-link" },
  { icon: MessageCircle, label: "WhatsApp", value: "(11) 94418-0189", href: "https://wa.me/5511944180189", testId: "contact-whatsapp-link", external: true },
  { icon: Mail, label: "E-mail", value: "contato@p4mix.com.br", href: "mailto:contato@p4mix.com.br", testId: "contact-email-link" },
  { icon: Instagram, label: "Instagram", value: "@p4mix", href: "https://www.instagram.com/p4mix", testId: "contact-instagram-link", external: true },
  { icon: ArrowUpRight, label: "Site", value: "www.p4mix.com.br", href: "https://www.p4mix.com.br", testId: "contact-website-link", external: true },
];

function Logo({ testId }) {
  return <img src="/logo-white.png" alt="P4mix — Montagens e Eventos" className="brand-logo" data-testid={testId} />;
}

function SectionEyebrow({ children, light = false, testId }) {
  return (
    <p className={`section-eyebrow ${light ? "section-eyebrow-light" : ""}`} data-testid={testId}>
      <span />{children}
    </p>
  );
}

function Reveal({ children, delay = 0, className = "", y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee" data-testid="editorial-marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, index) => (
          <span className="marquee-item" key={index}>{item}<i /></span>
        ))}
      </div>
    </div>
  );
}

const heroLineTransition = (delay) => ({ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] });

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#admin");
  const [galleryImages, setGalleryImages] = useState(null);
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 900], [0, 170]);

  useEffect(() => {
    document.title = "P4mix | Montagens e Eventos";
    document.documentElement.lang = "pt-BR";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "P4MIX — Transformamos espaços em experiências de marca. Estandes, cenografias, quiosques e soluções especiais desde 2006.");
  }, []);

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    const onClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (hash.length > 1 && document.querySelector(hash)) {
        event.preventDefault();
        lenis.scrollTo(hash);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.removeEventListener("click", onClick);
    };
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/gallery`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("gallery"))))
      .then((data) => setGalleryImages(data.images || []))
      .catch(() => setGalleryImages([]));
  }, []);

  const closeMenu = () => setMenuOpen(false);

  if (isAdmin) return <AdminPanel />;

  const stripImages = galleryImages && galleryImages.length > 0
    ? galleryImages.map((image) => ({ src: `${BACKEND_URL}${image.url}`, alt: image.original_filename || "Projeto P4MIX" }))
    : projectGallery;

  return (
    <main className="site-shell" data-testid="p4mix-institutional-site">
      <header className="site-header" data-testid="site-header">
        <div className="container header-inner">
          <a href="#inicio" onClick={closeMenu} aria-label="Ir para o início" data-testid="header-logo-link">
            <Logo testId="header-brand-logo" />
          </a>
          <nav className={`main-nav ${menuOpen ? "main-nav-open" : ""}`} aria-label="Navegação principal" data-testid="main-navigation">
            <a href="#sobre" onClick={closeMenu} data-testid="nav-about-link">Sobre nós</a>
            <a href="#solucoes" onClick={closeMenu} data-testid="nav-services-link">Soluções</a>
            <a href="#projetos" onClick={closeMenu} data-testid="nav-projects-link">Projetos</a>
            <a href="#contato" onClick={closeMenu} data-testid="nav-contact-link">Contato</a>
            <a className="nav-cta" href="#contato" onClick={closeMenu} data-testid="nav-cta-link">
              Fale com a P4mix <ArrowUpRight size={15} />
            </a>
          </nav>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} data-testid="mobile-menu-toggle">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio" data-testid="hero-section">
        <motion.div className="hero-image" style={{ backgroundImage: `url(${images.hero})`, y: heroImageY, scale: 1.15 }} aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-copy" data-testid="hero-copy">
            <motion.p className="hero-kicker" data-testid="hero-kicker" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
              <span className="live-dot" /> Montagens e Eventos
            </motion.p>
            <h1 data-testid="hero-heading">
              <span className="hero-line"><motion.span className="hero-line-inner" initial={{ y: "112%" }} animate={{ y: 0 }} transition={heroLineTransition(0.2)}>Transformamos</motion.span></span>
              <span className="hero-line"><motion.span className="hero-line-inner" initial={{ y: "112%" }} animate={{ y: 0 }} transition={heroLineTransition(0.3)}>espaços em</motion.span></span>
              <span className="hero-line"><motion.span className="hero-line-inner" initial={{ y: "112%" }} animate={{ y: 0 }} transition={heroLineTransition(0.4)}><em>experiências</em></motion.span></span>
              <span className="hero-line"><motion.span className="hero-line-inner" initial={{ y: "112%" }} animate={{ y: 0 }} transition={heroLineTransition(0.5)}>de marca.</motion.span></span>
            </h1>
            <motion.p className="hero-description" data-testid="hero-description" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
              Projetamos, produzimos e montamos estandes, cenografias, quiosques e soluções especiais para marcas que querem ocupar espaços com propósito.
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.75 }}>
              <a className="button button-lime" href="#solucoes" data-testid="hero-solutions-button">Conheça nossas soluções <ArrowUpRight size={17} /></a>
              <a className="text-link text-link-light" href="#contato" data-testid="hero-contact-link">Vamos conversar <MoveRight size={17} /></a>
            </motion.div>
          </div>
          <motion.div className="hero-side-note" data-testid="hero-side-note" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }}>
            <span>01</span>
            <p>Experiência que<br />se vê em cada<br /><strong>detalhe.</strong></p>
          </motion.div>
        </div>
        <div className="container hero-bottom">
          <span data-testid="hero-location-label">São Paulo · Brasil</span>
          <span className="scroll-hint"><ChevronDown size={15} /> role para explorar</span>
          <span data-testid="hero-experience-label">Desde 2006</span>
        </div>
      </section>

      <Marquee />

      <section className="intro-strip" data-testid="intro-strip">
        <div className="container intro-grid">
          <Reveal>
            <p className="intro-lead" data-testid="intro-lead">Arquitetura para marcas que querem mais do que ocupar um espaço. <strong>Querem criar presença.</strong></p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="intro-detail" data-testid="intro-detail">A P4MIX desenvolve, produz e monta estandes, cenografias, quiosques e projetos especiais, acompanhando cada etapa para transformar ideias em espaços que representam marcas.</p>
          </Reveal>
        </div>
      </section>

      <section className="section about-section" id="sobre" data-testid="about-section">
        <div className="container about-grid">
          <div className="about-heading">
            <Reveal>
              <SectionEyebrow testId="about-eyebrow">Sobre nós</SectionEyebrow>
              <h2 data-testid="about-heading">Uma trajetória construída em <span>projetos, experiências e relações.</span></h2>
            </Reveal>
            <div className="about-rule" />
            <Reveal delay={0.1}>
              <p data-testid="about-location-copy">Localizada estrategicamente na Zona Norte de São Paulo, a P4MIX atende os principais pavilhões e eventos da cidade — e projetos em todo o Brasil.</p>
            </Reveal>
          </div>
          <div className="about-body">
            <Reveal>
              <p className="large-copy" data-testid="about-main-copy">Desde 2006, a P4MIX transforma ideias em espaços que valorizam marcas, produtos e experiências.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p data-testid="about-support-copy">Atuamos em projetos de arquitetura promocional para feiras, congressos, eventos corporativos e diferentes experiências de marca, acompanhando cada etapa do projeto até a entrega.</p>
              <p data-testid="about-closing-copy">Unimos criatividade, planejamento e execução para transformar cada espaço em uma presença marcante para a sua marca.</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="highlight-grid" data-testid="highlights-grid">
                {highlights.map((highlight, index) => (
                  <div className="highlight" key={highlight.label} data-testid={`highlight-${index + 1}`}>
                    <strong>{highlight.value}</strong>
                    <span>{highlight.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section solutions-section" id="solucoes" data-testid="solutions-section">
        <div className="container">
          <div className="section-heading-row">
            <Reveal>
              <SectionEyebrow testId="solutions-eyebrow">O que fazemos</SectionEyebrow>
              <h2 data-testid="solutions-heading">Do projeto à <span>experiência.</span></h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p data-testid="solutions-intro">Criamos soluções para diferentes espaços, eventos e necessidades, unindo arquitetura, criatividade e execução para dar forma às marcas.</p>
            </Reveal>
          </div>
          <div className="service-grid" data-testid="service-grid">
            {services.map(({ number, icon: Icon, title, tagline, description }, index) => (
              <Reveal className="service-cell" key={number} delay={index * 0.06}>
                <article className="service-card" data-testid={`service-card-${number}`}>
                  <div className="service-top"><span>{number}</span><Icon size={22} strokeWidth={1.5} /></div>
                  <h3 data-testid={`service-title-${number}`}>{title}</h3>
                  <span className="service-tagline" data-testid={`service-tagline-${number}`}>{tagline}</span>
                  <p data-testid={`service-description-${number}`}>{description}</p>
                  <span className="service-arrow"><ArrowUpRight size={17} /></span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="process-section" data-testid="process-section">
        <div className="container process-grid">
          <div className="process-intro">
            <Reveal>
              <SectionEyebrow light testId="process-eyebrow">Nosso jeito de fazer</SectionEyebrow>
              <h2 data-testid="process-heading">Experiência que vai <em>além da montagem.</em></h2>
              <p data-testid="process-copy">Cada projeto envolve escolhas, detalhes e decisões que fazem diferença no resultado. Por isso, acompanhamos de perto cada etapa, com uma equipe própria e um olhar atento do projeto à entrega.</p>
              <a className="text-link text-link-light" href="#processo" data-testid="process-link">Conheça nosso processo <MoveRight size={17} /></a>
            </Reveal>
          </div>
          <div className="process-list" id="processo" data-testid="process-list">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05} y={18}>
                <div className="process-item" data-testid={`process-item-${index + 1}`}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong data-testid={`process-title-${index + 1}`}>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section projects-section" id="projetos" data-testid="projects-section">
        <div className="container">
          <div className="projects-heading">
            <Reveal>
              <SectionEyebrow testId="projects-eyebrow">Projetos</SectionEyebrow>
              <h2 data-testid="projects-heading">Espaços que dão forma <span>às marcas.</span></h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p data-testid="projects-intro">De estandes a cenografias, cada projeto é desenvolvido para traduzir a identidade da marca e transformar o espaço em experiência.</p>
            </Reveal>
          </div>
          <Reveal>
            <div className="project-mosaic" data-testid="project-mosaic">
              <figure className="project-image project-large"><img src={images.projectMain} alt="Estande Balões São Roque montado em pavilhão de feira" data-testid="project-image-main" /><figcaption><span>01</span> Estande Balões São Roque</figcaption></figure>
              <figure className="project-image project-small"><img src={images.projectSecondary} alt="Cenografia com escultura de balões e letreiro de neon no estande" data-testid="project-image-secondary" /><figcaption><span>02</span> Cenografia com balões</figcaption></figure>
              <div className="project-statement" data-testid="project-statement"><Sparkles size={21} /><p>Projetos pensados para <strong>fazer a marca acontecer.</strong></p></div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="project-strip" data-testid="project-gallery">
              {stripImages.map((photo, index) => (
                <figure className="project-image project-strip-item" key={photo.src}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" data-testid={`project-gallery-image-${index + 1}`} />
                </figure>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="facility-section" data-testid="facility-section">
        <div className="facility-image"><img src={images.facility} alt="Estrutura de produção para pré-montagem de projetos" data-testid="facility-image" /></div>
        <div className="facility-content">
          <Reveal>
            <SectionEyebrow testId="facility-eyebrow">Por trás de cada entrega</SectionEyebrow>
            <h2 data-testid="facility-heading">Experiência, cuidado e execução <span>em cada detalhe.</span></h2>
            <p data-testid="facility-copy">Mais do que entregar um espaço, cuidamos de tudo o que acontece por trás dele. Da pré-montagem ao acompanhamento no evento, nossa equipe trabalha para que cada projeto chegue ao público como foi pensado.</p>
            <div className="facility-metric" data-testid="facility-metric"><strong>1.000</strong><span>m² de estrutura para<br />pré-montagem</span></div>
          </Reveal>
        </div>
      </section>

      <section className="values-section" data-testid="values-section">
        <div className="container">
          <Reveal>
            <SectionEyebrow testId="values-eyebrow">Nossos valores</SectionEyebrow>
          </Reveal>
          <div className="values-grid" data-testid="values-grid">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} y={18}>
                <div className="value-card" data-testid={`value-card-${index + 1}`}>
                  <span>0{index + 1}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato" data-testid="contact-section">
        <div className="container contact-grid">
          <div className="contact-heading">
            <Reveal>
              <SectionEyebrow light testId="contact-eyebrow">Vamos criar juntos</SectionEyebrow>
              <h2 data-testid="contact-heading">Conte para a P4MIX sobre o seu <em>próximo projeto.</em></h2>
              <p data-testid="contact-copy">Vamos transformar sua ideia em um espaço que representa a sua marca.</p>
            </Reveal>
          </div>
          <div className="contact-details" data-testid="contact-details">
            {contactLines.map(({ icon: Icon, label, value, href, testId, external }, index) => (
              <Reveal key={testId} delay={index * 0.06} y={14}>
                <a href={href} className="contact-line" data-testid={testId} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                  <span><Icon size={18} /></span>
                  <div><small>{label}</small><strong>{value}</strong></div>
                  <ArrowUpRight size={17} />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        <div className="container footer-top">
          <a href="#inicio" aria-label="Voltar ao início" data-testid="footer-logo-link"><Logo testId="footer-brand-logo" /></a>
          <p data-testid="footer-description">Arquitetura promocional<br />que coloca marcas em cena.</p>
          <a className="footer-back-top" href="#inicio" data-testid="footer-back-top-link">Voltar ao topo <ArrowUpRight size={15} /></a>
        </div>
        <div className="container footer-bottom">
          <span data-testid="footer-copyright">© {new Date().getFullYear()} P4mix. Montagens e Eventos.</span>
          <span data-testid="footer-location">São Paulo · Brasil</span>
          <a href="#admin" className="footer-admin-link" data-testid="footer-admin-link">Admin</a>
        </div>
      </footer>
      <ProjectAssistant />
    </main>
  );
}

export default App;
