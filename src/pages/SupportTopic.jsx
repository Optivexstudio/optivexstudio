import { useParams, useNavigate } from "react-router-dom";
import { openTawk } from "../lib/tawk.js";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const content = {
  website: {
    title: "Website Support",
    items: [
      "Add new page/section",
      "Fix layout/responsive issues",
      "Speed optimization (Lighthouse)",
      "SEO improvements",
    ],
  },
  design: {
    title: "Design / UI Help",
    items: ["Navbar fixes", "Mobile menu", "Animations", "Component styling"],
  },
  firebase: {
    title: "Firebase / Auth",
    items: ["Google login", "Email OTP", "Firestore rules", "Hosting config"],
  },
  deployment: {
    title: "Deploy / Domain",
    items: ["Firebase deploy", "Connect domain", "SSL", "Redirects / rewrites"],
  },
  consulting: {
    title: "Consultation",
    items: ["Project planning", "Architecture", "Pricing estimate", "Roadmap"],
  },
  other: {
  title: "Other Support",
  items: [
    "General questions",
    "Not listed above",
    "Unsure what you need",
    "Custom request",
  ],
}, 

automation: {
  title: "AI Automation Support",
  items: [
    "CRM / clients workflow setup",
    "Invoices + overdue reminders automation",
    "AI content generation (2–3 posts/day)",
    "Approval flow + auto-publish",
    "Integrations (Meta/LinkedIn, Email/SMS)",
  ],
},




};

export default function SupportTopic() {
  const { topic } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const data = content[topic];

  const handleRequestSupport = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    await openTawk();

    // Optional: ჩატში თემის/მომხმარებლის ატრიბუტები (თუ ხელმისაწვდომია)
    setTimeout(() => {
      if (window.Tawk_API && typeof window.Tawk_API.setAttributes === "function") {
        window.Tawk_API.setAttributes(
          {
            name: user.email?.split("@")[0] || "Client",
            email: user.email || "",
            support_topic: topic,
          },
          function () {}
        );
      }
    }, 200);
  };

  if (!data) {
    return (
      <section className="container" style={{ paddingTop: "150px" }}>
        <h1>Topic not found</h1>
        <button className="btn primary" onClick={() => navigate("/support")}>
          Back to Support
        </button>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
      <button className="btn ghost" onClick={() => navigate("/support")}>
        ← Back
      </button>

      <h1 className="section-title">{data.title}</h1>

      <div className="support-list">
        {data.items.map((x) => (
          <div key={x} className="support-item">
            ✅ {x}
          </div>
        ))}
      </div>

      <div className="support-actions" style={{ marginTop: 30 }}>
        <button type="button" className="btn primary" onClick={handleRequestSupport}>
          Request Support
        </button>

        <button
          type="button"
          className="btn ghost"
          onClick={() => navigate("/support")}
        >
          Choose another category
        </button>
      </div>
    </section>
  );
}
