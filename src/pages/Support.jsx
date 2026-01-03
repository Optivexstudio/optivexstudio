import { useNavigate } from "react-router-dom";

const topics = [
  { id: "website", title: "Website Support", desc: "Bugs, updates, new sections/pages, performance & SEO." },
  { id: "design", title: "Design / UI Help", desc: "Layout fixes, responsive, animations, UI polish." },
  { id: "firebase", title: "Firebase / Auth", desc: "Login issues, rules, hosting, database, functions." },
  { id: "deployment", title: "Deploy / Domain", desc: "Firebase deploy, custom domain, SSL, redirects." },
  { id: "consulting", title: "Consultation", desc: "Plan your project, estimate, architecture guidance." },
  {
  id: "other",
  title: "Other",
  desc: "Not sure which category fits? Tell us what you need and we’ll guide you.",
  icon: "🧩",
  tags: ["General", "Question", "Help"],
},

{
  id: "automation",
  title: "AI Automation",
  desc: "Accounting/CRM automations + AI posting (2–3/day), integrations, workflows.",
  icon: "🤖",
  tags: ["CRM", "Invoices", "AI Posts"],
}


];

export default function Support() {
  const navigate = useNavigate();

  return (
    <section className="container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
      <h1 className="section-title">Support Center</h1>
      <p className="section-subtitle">Choose what you need help with.</p>

      <div className="support-grid">
        {topics.map((t) => (
          <button
            key={t.id}
            className="support-card"
            onClick={() => navigate(`/support/${t.id}`)}
          >
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <span className="support-cta">Open →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
