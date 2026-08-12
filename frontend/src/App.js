import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  Instagram,
  Layers3,
  Mail,
  Menu,
  MoveRight,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import "@/App.css";

const images = {
  hero:
    "https://images.unsplash.com/photo-1561019503-caec337334a4?auto=format&fit=crop&w=1800&q=85",
  facility:
    "https://images.unsplash.com/photo-1584564928625-483c5be78288?auto=format&fit=crop&w=1200&q=85",
  scenography:
    "https://images.unsplash.com/photo-1711390811937-1b061eaf28ea?auto=format&fit=crop&w=1000&q=85",
  booth:
    "https://images.unsplash.com/photo-1621685743771-fd5e13734ae6?auto=format&fit=crop&w=1000&q=85",
};

const services = [
  {
    number: "01",
    icon: Building2,
    title: "Estandes promocionais",
    description: "Montagens pensadas para apresentar sua marca com presença e clareza nos principais eventos.",
  },
  {
    number: "02",
    icon: Ruler,
    title: "Design de projetos",
    description: "Do conceito à execução, transformamos necessidades em espaços promocionais bem resolvidos.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Cenografias",
    description: "Ambientes cenográficos que dão forma à experiência e criam um ponto de encontro para o público.",
  },
  {
    number: "04",
    icon: Layers3,
    title: "Displays e quiosques",
    description: "Soluções para ponto de venda e ativações promocionais com acabamento e funcionalidade.",
  },
  {
    number: "05",
    icon: UsersRound,
    title: "Convenções",
    description: "Estruturas para convenções e encontros que precisam de organização, ritmo e impacto visual.",
  },
  {
    number: "06",
    icon: MoveRight,
    title: "Montagem eficiente",
    description: "Uma equipe experiente para colocar o projeto de pé com agilidade, suporte e pontualidade.",
  },
];

const values = [
  "Pontualidade",
  "Excelência",
  "Suporte",
  "Confiança",
];

const expertise = [
  "Arquitetura promocional",
  "Montagem de eventos",
  "Displays para ponto de venda",
  "Quiosques promocionais",
  "Cenografias",
];

function BrandMark({ light = false }) {
  return (
    <span className={`brand-mark ${light ? "brand-mark-light" : ""}`} data-testid={light ? "footer-brand-mark" : "header-brand-mark"}>
      <span className="brand-p4">p4</span><span className="brand-mix">mix</span>
      <small>Montagens e Eventos.</small>
    </span>
  );
}

function SectionEyebrow({ children, light = false, testId }) {
  return (
    <p className={`section-eyebrow ${light ? "section-eyebrow-light" : ""}`} data-testid={testId}>
      <span />{children}
    </p>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "P4mix | Montagens e Eventos";
    document.documentElement.lang = "pt-BR";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "P4mix — arquitetura promocional, montagens e eventos para marcas que querem ocupar espaços com presença.");
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell" data-testid="p4mix-institutional-site">
      <header className="site-header" data-testid="site-header">
        <div className="container header-inner">
          <a href="#inicio" onClick={closeMenu} aria-label="Ir para o início" data-testid="header-logo-link">
            <BrandMark />
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
        <div className="hero-image" style={{ backgroundImage: `url(${images.hero})` }} aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-copy reveal-up" data-testid="hero-copy">
            <p className="hero-kicker" data-testid="hero-kicker"><span className="live-dot" /> Montagens e Eventos</p>
            <h1 data-testid="hero-heading">Sua marca,<br /><em>no centro</em> do evento.</h1>
            <p className="hero-description" data-testid="hero-description">Arquitetura promocional, montagem e cenografia para transformar ideias em espaços que conectam pessoas e marcas.</p>
            <div className="hero-actions">
              <a className="button button-lime" href="#solucoes" data-testid="hero-solutions-button">Conheça nossas soluções <ArrowUpRight size={17} /></a>
              <a className="text-link text-link-light" href="#contato" data-testid="hero-contact-link">Vamos conversar <MoveRight size={17} /></a>
            </div>
          </div>
          <div className="hero-side-note reveal-up delay-2" data-testid="hero-side-note">
            <span>01</span>
            <p>Experiência que<br />se vê em cada<br /><strong>detalhe.</strong></p>
          </div>
        </div>
        <div className="container hero-bottom">
          <span data-testid="hero-location-label">São Paulo · Brasil</span>
          <span className="scroll-hint"><ChevronDown size={15} /> role para explorar</span>
          <span data-testid="hero-experience-label">+15 anos de experiência</span>
        </div>
      </section>

      <section className="intro-strip" data-testid="intro-strip">
        <div className="container intro-grid">
          <p className="intro-lead" data-testid="intro-lead">A gente acredita que um bom espaço não apenas apresenta. <strong>Ele aproxima, envolve e fica na memória.</strong></p>
          <p className="intro-detail" data-testid="intro-detail">A P4mix é uma empresa de arquitetura promocional que cria, monta e acompanha projetos para eventos e pontos de venda.</p>
        </div>
      </section>

      <section className="section about-section" id="sobre" data-testid="about-section">
        <div className="container about-grid">
          <div className="about-heading">
            <SectionEyebrow testId="about-eyebrow">Sobre nós</SectionEyebrow>
            <h2 data-testid="about-heading">Estrutura para<br /><span>ideias grandes.</span></h2>
            <div className="about-rule" />
            <p data-testid="about-location-copy">Localizada estrategicamente na Zona Norte de São Paulo, a P4mix está pronta para atender os principais pavilhões e eventos da cidade.</p>
          </div>
          <div className="about-body">
            <p className="large-copy" data-testid="about-main-copy">Há mais de 15 anos, transformamos projetos em experiências presenciais com uma combinação de visão, técnica e cuidado.</p>
            <p data-testid="about-support-copy">Contamos com uma equipe qualificada, matéria-prima de qualidade e uma estrutura de 1.000 m² que permite pré-montar, ajustar e entregar cada estande com excelência.</p>
            <div className="value-list" data-testid="values-list">
              {values.map((value, index) => <span key={value} data-testid={`value-${index + 1}`}><Check size={14} />{value}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section solutions-section" id="solucoes" data-testid="solutions-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <SectionEyebrow testId="solutions-eyebrow">O que fazemos</SectionEyebrow>
              <h2 data-testid="solutions-heading">Do primeiro traço<br /><span>à experiência final.</span></h2>
            </div>
            <p data-testid="solutions-intro">Soluções completas para marcas que querem ocupar espaços com propósito, consistência e presença.</p>
          </div>
          <div className="service-grid" data-testid="service-grid">
            {services.map(({ number, icon: Icon, title, description }) => (
              <article className="service-card" key={number} data-testid={`service-card-${number}`}>
                <div className="service-top"><span>{number}</span><Icon size={22} strokeWidth={1.5} /></div>
                <h3 data-testid={`service-title-${number}`}>{title}</h3>
                <p data-testid={`service-description-${number}`}>{description}</p>
                <span className="service-arrow"><ArrowUpRight size={17} /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="expertise-section" data-testid="expertise-section">
        <div className="container expertise-grid">
          <div className="expertise-intro">
            <SectionEyebrow light testId="expertise-eyebrow">Nossa experiência</SectionEyebrow>
            <h2 data-testid="expertise-heading">Tudo para sua marca <em>acontecer.</em></h2>
            <p data-testid="expertise-copy">Acompanhamos cada etapa — da prospecção ao encerramento do evento — para que a sua única preocupação seja viver o resultado.</p>
            <a className="text-link text-link-light" href="#contato" data-testid="expertise-contact-link">Conte seu projeto <MoveRight size={17} /></a>
          </div>
          <div className="expertise-list" data-testid="expertise-list">
            {expertise.map((item, index) => <div className="expertise-item" key={item} data-testid={`expertise-item-${index + 1}`}><span>0{index + 1}</span><strong>{item}</strong><ArrowUpRight size={17} /></div>)}
          </div>
        </div>
      </section>

      <section className="section projects-section" id="projetos" data-testid="projects-section">
        <div className="container">
          <div className="projects-heading">
            <div>
              <SectionEyebrow testId="projects-eyebrow">Projetos em cena</SectionEyebrow>
              <h2 data-testid="projects-heading">Presença que <span>marca.</span></h2>
            </div>
            <p data-testid="projects-intro">Cada projeto é uma oportunidade de tornar a sua marca mais próxima, mais visível e mais memorável.</p>
          </div>
          <div className="project-mosaic" data-testid="project-mosaic">
            <figure className="project-image project-large"><img src={images.booth} alt="Estante promocional em um ambiente de evento" data-testid="project-image-booth" /><figcaption><span>01</span> Estandes promocionais</figcaption></figure>
            <figure className="project-image project-small"><img src={images.scenography} alt="Cenografia de evento com iluminação" data-testid="project-image-scenography" /><figcaption><span>02</span> Cenografias</figcaption></figure>
            <div className="project-statement" data-testid="project-statement"><Sparkles size={21} /><p>Espaços que<br /><strong>fazem sentido.</strong></p></div>
          </div>
        </div>
      </section>

      <section className="facility-section" data-testid="facility-section">
        <div className="facility-image"><img src={images.facility} alt="Estrutura de produção para pré-montagem de projetos" data-testid="facility-image" /></div>
        <div className="facility-content">
          <SectionEyebrow testId="facility-eyebrow">Por trás de cada entrega</SectionEyebrow>
          <h2 data-testid="facility-heading">Uma estrutura<br /><span>que prepara o extraordinário.</span></h2>
          <p data-testid="facility-copy">Com 1.000 m² de espaço próprio, conseguimos pré-montar e ajustar os projetos antes de eles chegarem ao evento. É assim que cuidamos dos detalhes e mantemos o ritmo da entrega.</p>
          <div className="facility-metric" data-testid="facility-metric"><strong>1.000</strong><span>m² de estrutura para<br />pré-montagem</span></div>
        </div>
      </section>

      <section className="contact-section" id="contato" data-testid="contact-section">
        <div className="container contact-grid">
          <div className="contact-heading">
            <SectionEyebrow light testId="contact-eyebrow">Vamos criar juntos</SectionEyebrow>
            <h2 data-testid="contact-heading">Seu próximo<br /><em>projeto começa aqui.</em></h2>
            <p data-testid="contact-copy">Fale com a P4mix e descubra como podemos transformar sua ideia em uma experiência que merece ser vivida.</p>
          </div>
          <div className="contact-details" data-testid="contact-details">
            <a href="tel:+5511319665957" className="contact-line" data-testid="contact-phone-link"><span><Phone size={18} /></span><div><small>Telefone</small><strong>(11) 31966-5957</strong></div><ArrowUpRight size={17} /></a>
            <a href="mailto:contato@p4mix.com.br" className="contact-line" data-testid="contact-email-link"><span><Mail size={18} /></span><div><small>E-mail</small><strong>contato@p4mix.com.br</strong></div><ArrowUpRight size={17} /></a>
            <a href="https://www.instagram.com/p4mix" target="_blank" rel="noreferrer" className="contact-line" data-testid="contact-instagram-link"><span><Instagram size={18} /></span><div><small>Instagram</small><strong>@p4mix</strong></div><ArrowUpRight size={17} /></a>
            <a href="https://www.p4mix.com.br" target="_blank" rel="noreferrer" className="contact-line" data-testid="contact-website-link"><span><ArrowUpRight size={18} /></span><div><small>Site</small><strong>www.p4mix.com.br</strong></div><ArrowUpRight size={17} /></a>
          </div>
        </div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        <div className="container footer-top">
          <a href="#inicio" aria-label="Voltar ao início" data-testid="footer-logo-link"><BrandMark light /></a>
          <p data-testid="footer-description">Arquitetura promocional<br />que coloca marcas em cena.</p>
          <a className="footer-back-top" href="#inicio" data-testid="footer-back-top-link">Voltar ao topo <ArrowUpRight size={15} /></a>
        </div>
        <div className="container footer-bottom"><span data-testid="footer-copyright">© {new Date().getFullYear()} P4mix. Montagens e Eventos.</span><span data-testid="footer-location">São Paulo · Brasil</span></div>
      </footer>
    </main>
  );
}

export default App;