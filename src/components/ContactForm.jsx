import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const COOLDOWN_MS = 60_000; // 60 წამი (ანტი-სპამი)

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // honeypot (ბოტები ხშირად ავსებენ)
  const [website, setWebsite] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Website",
    budget: "Not sure",
    message: "",
  });

  const canSend = useMemo(() => {
    try {
      const last = Number(localStorage.getItem("nvx_last_lead_ts") || "0");
      return Date.now() - last > COOLDOWN_MS;
    } catch {
      return true;
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      service: "Website",
      budget: "Not sure",
      message: "",
    });
    setWebsite("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");

    // honeypot — თუ ეს შევსებულია, სავარაუდოდ ბოტია
    if (website.trim().length > 0) {
      setErrMsg("Something went wrong. Please try again.");
      return;
    }

    // cooldown (ანტი spam/დუბლიკატი)
    try {
      const last = Number(localStorage.getItem("nvx_last_lead_ts") || "0");
      if (Date.now() - last < COOLDOWN_MS) {
        setErrMsg("Please wait a bit before sending another message.");
        return;
      }
    } catch {}

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;

    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setErrMsg("Email service is not configured. Please contact us via email.");
      return;
    }

    setLoading(true);

    try {
      // template params (EmailJS template-ში ამ ველებს გამოიყენებ)
      const params = {
        to_email: "nevarixstudio@gmail.com",
        from_name: form.name,
        from_email: form.email,
        phone: form.phone,
        service: form.service,
        budget: form.budget,
        message: form.message,
        source: "Website Contact Form",
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);

      try {
        localStorage.setItem("nvx_last_lead_ts", String(Date.now()));
      } catch {}

      setOkMsg("✅ Message sent! We’ll contact you shortly.");
      resetForm();
    } catch (err) {
      console.error("ContactForm EmailJS error:", err);
      setErrMsg("Failed to send. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="nvx-contact-form" onSubmit={onSubmit}>
      {errMsg && <div className="auth-error" style={{ marginBottom: 12 }}>{errMsg}</div>}
      {okMsg && <div className="auth-success" style={{ marginBottom: 12 }}>{okMsg}</div>}

      {/* Honeypot - ვიზუალურად დამალული */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }} aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="nvx-grid">
        <div>
          <label className="nvx-label">Name</label>
          <input
            className="auth-input"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label className="nvx-label">Email</label>
          <input
            className="auth-input"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="nvx-grid">
        <div>
          <label className="nvx-label">Phone (optional)</label>
          <input
            className="auth-input"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+995 ..."
          />
        </div>

        <div>
          <label className="nvx-label">Service</label>
          <select className="auth-input" name="service" value={form.service} onChange={onChange}>
            <option value="Website">Website</option>
            <option value="Web App">Web App</option>
            <option value="Mobile App">Mobile App</option>
            <option value="AI Automation">AI Automation</option>
            <option value="Support / Maintenance">Support / Maintenance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="nvx-label">Budget</label>
        <select className="auth-input" name="budget" value={form.budget} onChange={onChange}>
          <option value="Not sure">Not sure</option>
          <option value="$300 - $800">$300 - $800</option>
          <option value="$800 - $2000">$800 - $2000</option>
          <option value="$2000 - $5000">$2000 - $5000</option>
          <option value="$5000+">$5000+</option>
        </select>
      </div>

      <div>
        <label className="nvx-label">Message</label>
        <textarea
          className="auth-input"
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder="Tell us what you want to build…"
          required
          rows={5}
          style={{ resize: "vertical" }}
        />
      </div>

      <button className="btn primary large-btn" type="submit" disabled={loading || !canSend}>
        {loading ? "Sending..." : "Send Request"}
      </button>

      <p className="email-note" style={{ marginTop: 12 }}>
        Or email us directly:{" "}
        <a href="mailto:nevarixstudio@gmail.com">nevarixstudio@gmail.com</a>
      </p>
    </form>
  );
}
