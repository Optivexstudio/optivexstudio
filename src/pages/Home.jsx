import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm.jsx";


import { auth } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";


export default function Home() {
  const [filter, setFilter] = useState("all");

  // ✅ user state (რეგისტრირებულია თუ არა)
  const [user, setUser] = useState(null);

  // ✅ router helpers
  const location = useLocation();
  const navigate = useNavigate();
    const { t } = useTranslation();

  

  // ✅ auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ✅ scroll-to-section როცა სხვა გვერდიდან მოდის
  useEffect(() => {
    const hash = location.state?.scrollTo;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [location.state]);

  // ✅ revealer animations (Tawk script აქ აღარ არის!)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".revealer").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* --- HERO --- */}
     <header className="hero" id="hero">
  <div className="inner container" role="banner">
    <h1>{t("hero.title")}</h1>
    <p>
      <strong>{t("hero.subtitleStrong")}</strong>
      <br className="hide-sm" /> {t("hero.subtitleLine")}
    </p>
    <div className="cta">
      <a className="btn primary" href="#projects">
        {t("hero.ctaProjects")}
      </a>
      <a className="btn" href="#contact">
        {t("hero.ctaQuote")}
      </a>
    </div>
  </div>
</header>

{/* --- ABOUT US --- */}
<section id="about" className="about-us container revealer">
  <div className="about-content">
    <h2 className="section-title">{t("about.title")}</h2>
    <div className="about-grid">
      <div className="about-text">
        <p className="lead-text">{t("about.lead")}</p>

        <p>{t("about.p1")}</p>

        <p>{t("about.p2")}</p>
      </div>

      <div className="tech-focus">
        <h3>{t("about.pillarsTitle")}</h3>
        <ul>
          <li>{t("about.pillar1")}</li>
          <li>{t("about.pillar2")}</li>
          <li>{t("about.pillar3")}</li>
          <li>{t("about.pillar4")}</li>
        </ul>
      </div>
    </div>
  </div>
</section>


      {/* --- SERVICES --- */}
     <section id="services" className="service-focus-section">
  <div className="container">
    <h2 className="section-title">{t("services.title")}</h2>
    <p className="section-subtitle">{t("services.subtitle")}</p>

    <div className="focus-grid revealer">
      <div className="focus-card">
        <span className="focus-icon">💻</span>
        <h3>{t("services.web.title")}</h3>
        <p>{t("services.web.desc")}</p>
        <ul>
          <li>{t("services.web.li1")}</li>
          <li>{t("services.web.li2")}</li>
          <li>{t("services.web.li3")}</li>
        </ul>
      </div>

      <div className="focus-card">
        <span className="focus-icon">📱</span>
        <h3>{t("services.mobile.title")}</h3>
        <p>{t("services.mobile.desc")}</p>
        <ul>
          <li>{t("services.mobile.li1")}</li>
          <li>{t("services.mobile.li2")}</li>
          <li>{t("services.mobile.li3")}</li>
        </ul>
      </div>

      <div className="focus-card">
        <span className="focus-icon">☁️</span>
        <h3>{t("services.cloud.title")}</h3>
        <p>{t("services.cloud.desc")}</p>
        <ul>
          <li>{t("services.cloud.li1")}</li>
          <li>{t("services.cloud.li2")}</li>
          <li>{t("services.cloud.li3")}</li>
        </ul>
      </div>
    </div>

    <div
      className="service-card ai-automation-service revealer"
      style={{ marginTop: "50px" }}
    >
      <div className="icon-container">
        <span className="service-icon">🤖</span>
      </div>

      <h3 className="card-title">{t("services.ai.title")}</h3>
      <p className="card-description">{t("services.ai.desc")}</p>

      <ul className="key-offerings">
        <li>{t("services.ai.li1")}</li>
        <li>{t("services.ai.li2")}</li>
        <li>{t("services.ai.li3")}</li>
        <li>{t("services.ai.li4")}</li>
        <li>{t("services.ai.li5")}</li>
      </ul>
    </div>
  </div>
</section>


      {/* --- AUTOMATION OFFER (replaces Services) --- */}
      {/* ✅ FIX: აქ იყო duplicate id="services" -> გახდა "automation" */}
     <section id="automation" className="automation-offer revealer">
  <div className="container">
    <header className="automation-head">
      <h2 className="section-title">{t("automation.title")}</h2>
      <p className="section-subtitle">
        {t("automation.subtitle")}
      </p>

      <div className="automation-cta">
        <button
          type="button"
          className="btn primary"
          onClick={() => navigate("/support/automation")}
        >
          {t("automation.ctaDemo")}
        </button>
        <a className="btn ghost" href="#contact">
          {t("automation.ctaPricing")}
        </a>
      </div>
    </header>

    <div className="automation-grid">
      <div className="auto-card">
        <div className="auto-icon">📇</div>
        <h3>{t("automation.cards.crm.title")}</h3>
        <p>{t("automation.cards.crm.desc")}</p>
        <div className="auto-tags">
          <span>CRM</span><span>Pipeline</span><span>Notes</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🧾</div>
        <h3>{t("automation.cards.invoices.title")}</h3>
        <p>{t("automation.cards.invoices.desc")}</p>
        <div className="auto-tags">
          <span>Invoices</span><span>Paid</span><span>Overdue</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🔔</div>
        <h3>{t("automation.cards.reminders.title")}</h3>
        <p>{t("automation.cards.reminders.desc")}</p>
        <div className="auto-tags">
          <span>Reminders</span><span>Automation</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🤖</div>
        <h3>{t("automation.cards.ai.title")}</h3>
        <p>{t("automation.cards.ai.desc")}</p>
        <div className="auto-tags">
          <span>AI</span><span>Social</span><span>Daily</span>
        </div>
      </div>
    </div>

    <div className="automation-flow">
      <div className="flow-left">
        <h3>{t("automation.flow.title")}</h3>
        <p className="flow-sub">{t("automation.flow.subtitle")}</p>

        <ol className="flow-steps">
          <li>{t("automation.flow.step1")}</li>
          <li>{t("automation.flow.step2")}</li>
          <li>{t("automation.flow.step3")}</li>
          <li>{t("automation.flow.step4")}</li>
          <li>{t("automation.flow.step5")}</li>
        </ol>
      </div>

      <div className="automation-diagram-img">
        <img src="/images/automation.png" alt="Automation Flow" loading="lazy" />
      </div>
    </div>

    <div className="automation-strip">
      <div className="strip-item">{t("automation.trust1")}</div>
      <div className="strip-item">{t("automation.trust2")}</div>
      <div className="strip-item">{t("automation.trust3")}</div>
    </div>
  </div>
</section>


      {/* --- WORKFLOW --- */}
<section id="workflow" className="revealer">
  <div className="container">
    <h2 className="section-title">{t("workflow.title")}</h2>
    <div className="workflow">
      <div className="workflow-step">
        <h4>{t("workflow.steps.s1Title")}</h4>
        <p>{t("workflow.steps.s1Desc")}</p>
      </div>

      <div className="workflow-step">
        <h4>{t("workflow.steps.s2Title")}</h4>
        <p>{t("workflow.steps.s2Desc")}</p>
      </div>

      <div className="workflow-step">
        <h4>{t("workflow.steps.s3Title")}</h4>
        <p>{t("workflow.steps.s3Desc")}</p>
      </div>

      <div className="workflow-step">
        <h4>{t("workflow.steps.s4Title")}</h4>
        <p>{t("workflow.steps.s4Desc")}</p>
      </div>

      <div className="workflow-step">
        <h4>{t("workflow.steps.s5Title")}</h4>
        <p>{t("workflow.steps.s5Desc")}</p>
      </div>
    </div>
  </div>
</section>

{/* --- PORTFOLIO --- */}
<section id="projects" className="portfolio-showcase revealer">
  <div className="container">
    <header className="portfolio-header">
      <h1>{t("projects.title")}</h1>
      <p>{t("projects.subtitle")}</p>
    </header>

    <div className="portfolio-filter">
      {["all", "web", "ai", "software"].map((cat) => (
        <button
          key={cat}
          className={`filter-btn ${filter === cat ? "active" : ""}`}
          onClick={() => setFilter(cat)}
        >
          {t(`projects.filters.${cat}`)}
        </button>
      ))}
    </div>

    <div className="portfolio-grid">
      <div className="project-card">
        <div className="project-image">
          <img src="/images/code.png" alt={t("projects.card.imgAlt")} />
          <div className="project-overlay">
            <a href="#" className="case-study-link">
              {t("projects.card.link")}
            </a>
          </div>
        </div>

        <div className="project-info">
          <span className="category-tag">{t("projects.card.tag")}</span>
          <h3>{t("projects.card.title")}</h3>
          <p>{t("projects.card.desc")}</p>
          <div className="tech-stack">
            <span>{t("projects.card.stack.s1")}</span>
            <span>{t("projects.card.stack.s2")}</span>
            <span>{t("projects.card.stack.s3")}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* --- WHO WE WORK WITH + TECH STACK --- */}
<section id="clients" className="partners-section revealer">
  <div className="container">
    <h2 className="section-title">{t("clients.title")}</h2>
    <p className="section-subtitle">{t("clients.subtitle")}</p>

    <div className="partners-grid">
      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">{t("clients.cards.c1Badge")}</span>
        </div>
        <h3>{t("clients.cards.c1Title")}</h3>
        <p>{t("clients.cards.c1Desc")}</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">{t("clients.cards.c2Badge")}</span>
        </div>
        <h3>{t("clients.cards.c2Title")}</h3>
        <p>{t("clients.cards.c2Desc")}</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">{t("clients.cards.c3Badge")}</span>
        </div>
        <h3>{t("clients.cards.c3Title")}</h3>
        <p>{t("clients.cards.c3Desc")}</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">{t("clients.cards.c4Badge")}</span>
        </div>
        <h3>{t("clients.cards.c4Title")}</h3>
        <p>{t("clients.cards.c4Desc")}</p>
      </div>
    </div>

    <div className="service-card ai-automation-service revealer" style={{ marginTop: "28px" }}>
      <div className="icon-container"><span className="service-icon">🧰</span></div>
      <h3 className="card-title">{t("clients.stack.title")}</h3>
      <p className="card-description">{t("clients.stack.desc")}</p>

      <ul className="key-offerings">
        <li><strong>Frontend:</strong> {t("clients.stack.li1").replace("Frontend: ", "")}</li>
        <li><strong>Backend:</strong> {t("clients.stack.li2").replace("Backend: ", "")}</li>
        <li><strong>Delivery:</strong> {t("clients.stack.li3").replace("Delivery: ", "")}</li>
        <li><strong>Quality:</strong> {t("clients.stack.li4").replace("Quality: ", "")}</li>
      </ul>
    </div>
  </div>
</section>

{/* --- CONTRAST --- */}
<section id="why-optivex-contrast" className="comparison-section revealer">
  <div className="container">
    <h2>{t("contrast.title")}</h2>
    <p className="subtitle">{t("contrast.subtitle")}</p>

    <div className="contrast-grid">
      <div className="compare-card traditional-method">
        <h3 className="negative-h3">{t("contrast.leftTitle")}</h3>
        <ul className="comparison-list">
          <li>{t("contrast.left.li1")}</li>
          <li>{t("contrast.left.li2")}</li>
          <li>{t("contrast.left.li3")}</li>
          <li>{t("contrast.left.li4")}</li>
        </ul>
      </div>

      <div className="compare-card optivex-innovation featured-card">
        <h3 className="positive-h3">{t("contrast.rightTitle")}</h3>
        <ul className="comparison-list">
          <li>{t("contrast.right.li1")}</li>
          <li>{t("contrast.right.li2")}</li>
          <li>{t("contrast.right.li3")}</li>
          <li>{t("contrast.right.li4")}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

{/* --- FAQ --- */}
<section id="faq" className="faq-section container revealer">
  <h2 className="section-title">{t("faq.title")}</h2>

  <div className="faq-content">
    <div className="faq-list">
      <h3>{t("faq.leftTitle")}</h3>

      <div className="faq-item">
        <h4>{t("faq.q1.title")}</h4>
        <p>{t("faq.q1.desc")}</p>
      </div>

      <div className="faq-item">
        <h4>{t("faq.q2.title")}</h4>
        <p>{t("faq.q2.desc")}</p>
      </div>

      <div className="faq-item">
        <h4>{t("faq.q3.title")}</h4>
        <p>{t("faq.q3.desc")}</p>
      </div>
    </div>

    <div className="guarantee-block">
      <h3>{t("faq.rightTitle")}</h3>

      <div className="guarantee-card">
        <h4>{t("faq.guarantee.title")}</h4>
        <p>{t("faq.guarantee.desc")}</p>
        <ul>
          <li><span className="icon">✅</span> {t("faq.guarantee.li1")}</li>
          <li><span className="icon">✅</span> {t("faq.guarantee.li2")}</li>
          <li><span className="icon">✅</span> {t("faq.guarantee.li3")}</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section id="contact" className="collaboration-cta revealer">
  <div className="container">
    {/* სათაურების თარგმანი */}
    <h2 className="section-title">{t("contact.title")}</h2>
    <p className="section-subtitle">{t("contact.subtitle")}</p>

    <div className="nvx-contact-card" style={{ marginBottom: '60px', width: '100%' }}>
      <h3 className="nvx-contact-card-title" style={{ textAlign: 'center' }}>
        {t("contact.email.title")}
      </h3>
      <p className="nvx-contact-card-sub" style={{ textAlign: 'center', marginBottom: '30px' }}>
        {t("contact.email.subtitle")}
      </p>
      <ContactForm />
    </div>

    {/* ✅ დავამატე id="direct-contact" ზუსტად აქ */}
    <div id="direct-contact" className="contacts-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px',
      borderTop: '1px solid rgba(0,0,0,0.1)',
      paddingTop: '40px'
    }}>
      
      {/* Telegram თარგმანი */}
      <div className="contact-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📲 Telegram</h3>
        <p style={{ color: '#666', marginBottom: '20px', maxWidth: '300px' }}>
          {t("contact.telegram.text")}
        </p>
        <a
          href="https://t.me/nevarixstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="btn large-btn"
          style={{ backgroundColor: '#0088cc', color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '280px' }}
        >
          {t("contact.telegram.btn")}
        </a>
        <p style={{ marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>@nevarixstudio</p>
      </div>

      {/* Social Media თარგმანი */}
      <div className="contact-col" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>💬 {t("contact.social.title")}</h3>
        <p style={{ color: '#666', marginBottom: '20px', maxWidth: '300px' }}>
          {t("contact.social.text")}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
          <a href="https://m.me/nevarixstudio" target="_blank" rel="noopener noreferrer" className="btn ghost large-btn" style={{ textDecoration: 'none', width: '100%', maxWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.517 3.733 7.245V22l3.225-1.768c.99.274 2.035.426 3.042.426 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.066 12.333l-2.55-2.722-4.975 2.722 5.474-5.814 2.613 2.722 4.912-2.722-5.474 5.814z"/></svg>
            Messenger
          </a>

          <a href="https://instagram.com/nevarixstudio" target="_blank" rel="noopener noreferrer" className="btn ghost large-btn" style={{ textDecoration: 'none', width: '100%', maxWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            Instagram
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

{/* --- FOOTER --- */}
<footer>
  © {new Date().getFullYear()} {t("footer.text")}
</footer>

    </>
  );
}
