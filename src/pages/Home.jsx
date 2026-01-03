import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openTawk } from "../lib/tawk.js";

import { auth } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [filter, setFilter] = useState("all");

  // ✅ user state (რეგისტრირებულია თუ არა)
  const [user, setUser] = useState(null);

  // ✅ router helpers
  const location = useLocation();
  const navigate = useNavigate();

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
          <h1>Nevarix Studio</h1>
          <p>
            <strong>
              We build custom, fast and maintainable websites using HTML • CSS • JavaScript.
            </strong>
            <br className="hide-sm" /> Focused on performance, accessibility and real business results.
          </p>
          <div className="cta">
            <a className="btn primary" href="#projects">See Projects</a>
            <a className="btn" href="#contact">Request Quote</a>
          </div>
        </div>
      </header>

      {/* --- ABOUT US --- */}
     <section id="about" className="about-us container revealer">
        <div className="about-content">
          <h2 className="section-title">Nevarix Studio — Engineering Digital Excellence</h2>
          <div className="about-grid">
            <div className="about-text">
              <p className="lead-text">
                Nevarix Studio is a Georgia-based collective of seasoned software engineers and designers dedicated to transforming ambitious visions into high-performance digital realities. We operate with a global perspective, delivering bespoke web and mobile applications that set new industry standards for speed, security, and scalability.
              </p>
              <p>
                We move beyond traditional development by embracing a modern, API-first approach. Our expertise lies in leveraging technologies like Headless CMS architecture, Serverless computing (AWS/Firebase), and cutting-edge JavaScript frameworks (React/Vue). This strategy ensures every product we build is future-proof, easily maintainable, and highly optimized for performance metrics.
              </p>
              <p>
                Whether it's a complex enterprise platform or a high-traffic e-commerce solution, our focus remains on providing clear communication and transparent milestones. We don't just write code; we engineer solutions that generate tangible business value.
              </p>
            </div>
            <div className="tech-focus">
              <h3>🛠️ Our Core Engineering Pillars</h3>
              <ul>
                <li>Performance First: Commitment to sub-second load times and 90+ PageSpeed scores.</li>
                <li>Scalability & Security: Utilizing microservices and cloud infrastructure for robust growth.</li>
                <li>Transparent Process: Agile methodology with client involvement at every iteration.</li>
                <li>Maintenance-Ready Code: Delivering clean, semantic, and well-documented codebase.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section id="services" className="service-focus-section">
        <div className="container">
          <h2 className="section-title">Our Core Service Offerings</h2>
          <p className="section-subtitle">We translate complex engineering challenges into market-ready digital products that perform.</p>
          <div className="focus-grid revealer">
            <div className="focus-card">
              <span className="focus-icon">💻</span>
              <h3>High-Performance Web Platforms</h3>
              <p>We build scalable, secure, and fast websites from scratch, focusing on SEO, accessibility (a11y), and Lighthouse scores (90+). Perfect for corporate sites, e-commerce, and SaaS platforms.</p>
              <ul>
                <li>React & Vue Frontends</li>
                <li>Headless CMS Architecture</li>
                <li>API Integration & Optimization</li>
              </ul>
            </div>
            <div className="focus-card">
              <span className="focus-icon">📱</span>
              <h3>Native Mobile App Development</h3>
              <p>Delivering exceptional UX and performance for both iOS and Android. Our native approach ensures maximum speed and reliability, integrating complex features like payments and location services.</p>
              <ul>
                <li>Swift (iOS) & Kotlin (Android)</li>
                <li>Cross-Platform (Flutter)</li>
                <li>App Store/Play Store Deployment</li>
              </ul>
            </div>
            <div className="focus-card">
              <span className="focus-icon">☁️</span>
              <h3>Cloud, Serverless, & Backend APIs</h3>
              <p>Robust and maintainable backend systems built for long-term growth. We use serverless technologies to reduce costs and increase scalability, ensuring your application can handle millions of users.</p>
              <ul>
                <li>Firebase / Google Cloud</li>
                <li>Custom NodeJS REST APIs</li>
                <li>Database Design & Security</li>
              </ul>
            </div>
          </div>

          <div className="service-card ai-automation-service revealer" style={{marginTop: '50px'}}>
            <div className="icon-container"><span className="service-icon">🤖</span></div>
            <h3 className="card-title">AI Automation & CI/CD Optimization</h3>
            <p className="card-description">
              We integrate cutting-edge AI and CI/CD pipelines directly into your existing development workflow. This service dramatically boosts project efficiency, guaranteeing faster time-to-market and predictable, high-quality releases.
            </p>
            <ul className="key-offerings">
              <li>Automated Code Review & Testing</li>
              <li>CI/CD Pipeline Setup (GitHub Actions, GitLab, etc.)</li>
              <li>Zero-Downtime Deployment Configuration</li>
              <li>AI-Driven Security Vulnerability Scanning</li>
              <li>Resource Allocation Optimization</li>
            </ul>
          </div>
        </div>
      </section>

       {/* --- AUTOMATION OFFER (replaces Services) --- */}
<section id="services" className="automation-offer revealer">
  <div className="container">
    <header className="automation-head">
      <h2 className="section-title">Business Automation Suite</h2>
      <p className="section-subtitle">
        One system for <strong>Clients</strong>, <strong>Invoices</strong>, <strong>Payment reminders</strong> and
        <strong> AI content posting</strong> (2–3 posts/day). Built for small & medium businesses.
      </p>

      <div className="automation-cta">
        <button
          type="button"
          className="btn primary"
          onClick={() => navigate("/support/automation")}
        >
          Request a Demo
        </button>
        <a className="btn ghost" href="#contact">Get Pricing</a>
      </div>
    </header>

    {/* Feature cards */}
    <div className="automation-grid">
      <div className="auto-card">
        <div className="auto-icon">📇</div>
        <h3>Client & Deal Control</h3>
        <p>Track clients, status, notes, and next actions. Everything in one clean dashboard.</p>
        <div className="auto-tags">
          <span>CRM</span><span>Pipeline</span><span>Notes</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🧾</div>
        <h3>Invoices & Payments</h3>
        <p>Create invoices, mark payments, and monitor overdue balances in real-time.</p>
        <div className="auto-tags">
          <span>Invoices</span><span>Paid/Pending</span><span>Overdue</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🔔</div>
        <h3>Auto Reminders</h3>
        <p>Automatic reminders to clients when payments are late—email/SMS/WhatsApp-ready.</p>
        <div className="auto-tags">
          <span>Reminders</span><span>Automation</span><span>Templates</span>
        </div>
      </div>

      <div className="auto-card">
        <div className="auto-icon">🤖</div>
        <h3>AI Content Posting</h3>
        <p>AI generates and posts 2–3 social posts/day, matched to your business tone and goals.</p>
        <div className="auto-tags">
          <span>FB/IG</span><span>LinkedIn</span><span>2–3/day</span>
        </div>
      </div>
    </div>

    {/* Flow diagram block */}
    <div className="automation-flow">
      <div className="flow-left">
        <h3>How it works (Automation Loop)</h3>
        <p className="flow-sub">
          Clear steps, fully automated. Optional approval if you want control before posting.
        </p>

        <ol className="flow-steps">
          <li><strong>Collect:</strong> Clients, invoices, due dates, business profile & tone.</li>
          <li><strong>Automate:</strong> Overdue checks + reminders scheduled daily.</li>
          <li><strong>Generate:</strong> AI creates content based on your services & offers.</li>
          <li><strong>Publish:</strong> Auto-post or “Approve & Publish” with one click.</li>
          <li><strong>Track:</strong> Logs, history, and performance insights.</li>
        </ol>
      </div>
<div className="automation-diagram-img">
  <img
    src="/images/automation.png"
    alt="Automation Flow Diagram"
    loading="lazy"
  />
</div>


    </div>

    {/* Trust strip */}
    <div className="automation-strip">
      <div className="strip-item">✅ Built with secure auth & roles (Admin / Staff)</div>
      <div className="strip-item">✅ Clean audit logs: who did what, when</div>
      <div className="strip-item">✅ Works in Georgian/English content</div>
    </div>
  </div>
</section>


       <section id="workflow" className="revealer">
        <div className="container">
          <h2 className="section-title">How We Work</h2>
          <div className="workflow">
            <div className="workflow-step"><h4>1. Quick Discovery</h4><p>We collect goals and success metrics. 20-minute intake to assess scope and timeline.</p></div>
            <div className="workflow-step"><h4>2. Proposal & Milestones</h4><p>We deliver a clear scope with milestones and a fixed price. No surprises.</p></div>
            <div className="workflow-step"><h4>3. Build & Review</h4><p>Iterative delivery — review checkpoints, QA and accessibility checks.</p></div>
            <div className="workflow-step"><h4>4. Launch & Monitor</h4><p>Deployment, performance checks, and optional monitoring/maintenance.</p></div>
            <div className="workflow-step"><h4>5. Support</h4><p>Monthly maintenance and small updates — optional retainer plans available.</p></div>
          </div>
        </div>
      </section>

      

      {/* --- PORTFOLIO --- */}
      <section id="projects" className="portfolio-showcase revealer">
        <div className="container">
          <header className="portfolio-header">
            <h1>Our Digital Assets</h1>
            <p>Explore how we combine AI automation with premium development to solve real business challenges.</p>
          </header>

          <div className="portfolio-filter">
            {["all", "web", "ai", "software"].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* NOTE: აქ მერე გავაკეთებთ filter-ს რეალურად რომ ფილტრავდეს */}
          <div className="portfolio-grid">
            <div className="project-card">
              <div className="project-image">
                <img src="/images/project1.jpg" alt="E-commerce Project" />
                <div className="project-overlay">
                  <a href="#" className="case-study-link">View Case Study</a>
                </div>
              </div>
              <div className="project-info">
                <span className="category-tag">Web Dev + AI</span>
                <h3>E-commerce Automation Hub</h3>
                <p>Reduced manual order processing time by 60% through custom AI pipelines.</p>
                <div className="tech-stack"><span>React</span> <span>Node.js</span> <span>Python AI</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* --- WHO WE WORK WITH + TECH STACK --- */}
<section id="clients" className="partners-section revealer">
  <div className="container">
    <h2 className="section-title">Who We Work With</h2>
    <p className="section-subtitle">
      We partner with teams that need fast delivery, clean architecture, and reliable long-term maintenance.
    </p>

    <div className="partners-grid">
      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">Startups & MVPs</span>
        </div>
        <h3>Startups & MVP Founders</h3>
        <p>Launch quickly with a scalable foundation — from landing pages to full web apps.</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">Small Business</span>
        </div>
        <h3>Small Businesses</h3>
        <p>High-performance websites that convert visitors into leads and customers.</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">SaaS Teams</span>
        </div>
        <h3>SaaS Products</h3>
        <p>Feature development, UI polish, auth systems, and performance optimization.</p>
      </div>

      <div className="partner-card">
        <div className="partner-logo-container">
          <span className="partner-name-text">Agencies</span>
        </div>
        <h3>Agencies & Studios</h3>
        <p>Your technical partner for overflow work, complex builds, and delivery support.</p>
      </div>
    </div>

    <div className="service-card ai-automation-service revealer" style={{ marginTop: "28px" }}>
      <div className="icon-container"><span className="service-icon">🧰</span></div>
      <h3 className="card-title">Our Core Technology Stack</h3>
      <p className="card-description">
        We build maintainable products using modern tools — optimized for speed, SEO, and scale.
      </p>

      <ul className="key-offerings">
        <li><strong>Frontend:</strong> React + Vite, modern HTML/CSS, accessibility-first UI</li>
        <li><strong>Backend:</strong> Firebase / Serverless, REST APIs, secure auth flows</li>
        <li><strong>Delivery:</strong> CI/CD, automated testing, performance monitoring</li>
        <li><strong>Quality:</strong> Clean code, documentation, maintainability</li>
      </ul>
    </div>
  </div>
</section>


       <section id="why-optivex-contrast" className="comparison-section revealer">
        <div className="container">
          <h2>The Nevarix Studio Contrast: Efficiency Meets Innovation</h2>
          <p className="subtitle">Tired of slow delivery and unpredictable costs? See how our AI-driven automation delivers superior results.</p>
          <div className="contrast-grid">
            <div className="compare-card traditional-method">
              <h3 className="negative-h3">Other Agencies: Manual & Costly</h3>
              <ul className="comparison-list">
                <li>❌ Slow Time-to-Market: Reliance on manual processes leads to extended cycles.</li>
                <li>❌ Unpredictable Budgeting: High overhead costs due to extensive human hours.</li>
                <li>❌ Inconsistent Quality: Susceptibility to human error in coding and testing.</li>
                <li>❌ Scalability Roadblocks: Expanding requires costly, dedicated engineering time.</li>
              </ul>
            </div>
            <div className="compare-card optivex-innovation featured-card">
              <h3 className="positive-h3">Nevarix Studio: AI-Driven & Optimized</h3>
              <ul className="comparison-list">
                <li>✅ Accelerated Delivery: 40% Faster Time-to-Market through automated pipelines.</li>
                <li>✅ Cost Optimization: AI processes reduce human dependency and overall costs.</li>
                <li>✅ Zero-Defect Reliability: Automated QA ensure consistent, high-quality output.</li>
                <li>✅ Effortless Scaling: Cloud-native architecture supports seamless scaling.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       <section id="faq" className="faq-section container revealer">
        <h2 className="section-title">Common Questions & Our Guarantee</h2>
        <div className="faq-content">
          <div className="faq-list">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-item">
              <h4>1. What is your primary tech stack?</h4>
              <p>We primarily use Vanilla JavaScript (ES6+), React, and modern CSS/HTML5 for frontend development. For mobile, we focus on Swift (iOS), Kotlin (Android), and Flutter (Dart). Our backend services often rely on Firebase, AWS, or custom NodeJS/Express APIs.</p>
            </div>
            <div className="faq-item">
              <h4>2. How do you handle project pricing?</h4>
              <p>We work almost exclusively with fixed-price contracts based on an agreed-upon scope of work and milestones. This eliminates surprise costs and guarantees transparency. We provide a detailed quote after the discovery call.</p>
            </div>
            <div className="faq-item">
              <h4>3. What about post-launch maintenance?</h4>
              <p>Every project includes a 30-day bug-fix warranty after launch. For ongoing support, security monitoring, and content updates, we offer flexible monthly retainer packages.</p>
            </div>
          </div>
          <div className="guarantee-block">
            <h3>Our Core Project Guarantee</h3>
            <div className="guarantee-card">
              <h4>Zero-Risk Development</h4>
              <p>We guarantee to deliver a 100% responsive, well-documented, and clean codebase tailored specifically to your business needs. If the delivered project does not match the final agreed-upon scope, we will revise it at no extra cost.</p>
              <ul>
                <li><span className="icon">✅</span> Fixed Pricing & Clear Milestones</li>
                <li><span className="icon">✅</span> Dedicated 24/7 Support Channel</li>
                <li><span className="icon">✅</span> Lifetime Bug Fix Warranty</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="collaboration-cta revealer">
        <div className="container">
          <h2 className="section-title">Ready to Launch Your Next Project?</h2>
          <div className="cta-wrap">
            <p className="cta-message">
              Whether you need immediate technical support or are ready to discuss your next breakthrough application, our team is here to help.
            </p>

            <div className="cta-actions">
             <button
  type="button"
  className="btn primary large-btn"
  onClick={async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    await openTawk();
  }}
>
  Start a Project Now
</button>



              <button
               className="btn ghost large-btn"
                onClick={() => navigate("/support")}
                >
                 Connect with Support
                </button>

            </div>
          </div>

          <p className="email-note">
            Or send us a direct inquiry:{" "}
            <a href="mailto:gulbianinodo2008@gmail.com">gulbianinodo2008@gmail.com</a>
          </p>
        </div>
      </section>

      <footer>
        © <span id="year">2025</span> Nevarix Studio — Crafted with clean code
      </footer>
    </>
  );
}
