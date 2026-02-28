import React, { useMemo, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
// ტელეფონის კომპონენტის იმპორტი
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const COOLDOWN_MS = 60_000;

export default function ContactForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [website, setWebsite] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Website",
    budget: "Not sure",
    message: "",
  });

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

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

  // ტელეფონის ცვლილების ჰენდლერი
  const handlePhoneChange = (value) => {
    setForm((p) => ({ ...p, phone: value }));
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
    setErrMsg("");
    
    const SERVICE_ID = "service_0a46h7c"; 
    const TEMPLATE_ID = "template_h5eildd"; 
    const PUBLIC_KEY = "igQUpRT1MyfjEJ97N";

    setLoading(true);

    try {
      const params = {
        name: form.name,
        email: form.email,
        phone: form.phone,       
        service: form.service,   
        budget: form.budget,     
        message: form.message,
      };

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
      
      if (response.status === 200) {
        localStorage.setItem("nvx_last_lead_ts", String(Date.now()));
        setShowModal(true);
        resetForm();
      }
    } catch (err) {
      console.error("FAILED...", err);
      setErrMsg(t("contact.form.error") || "Error sending message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '30px 50px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <h3 style={{ color: '#333', margin: 0 }}>
              {t("contact.form.success") || "Message sent successfully!"}
            </h3>
          </div>
        </div>
      )}

      <form className="nvx-contact-form" onSubmit={onSubmit} style={{ position: 'relative' }}>
        {errMsg && <div style={{ color: "red", marginBottom: 10, textAlign: 'center' }}>{errMsg}</div>}

        <div style={{ display: "none" }}>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className="nvx-grid">
          <div>
            <label className="nvx-label">{t("contact.form.name")}</label>
            <input 
              className="auth-input" 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              placeholder={t("contact.form.placeholders.name")} 
              required 
            />
          </div>
          <div>
            <label className="nvx-label">{t("contact.form.email")}</label>
            <input 
              className="auth-input" 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={onChange} 
              placeholder={t("contact.form.placeholders.email")} 
              required 
            />
          </div>
        </div>

        <div className="nvx-grid" style={{ marginTop: 15 }}>
          <div>
            <label className="nvx-label">{t("contact.form.phone")}</label>
            <PhoneInput
              country={'ge'}
              value={form.phone}
              onChange={handlePhoneChange}
              enableSearch={true}
              placeholder={t("contact.form.placeholders.phone")}
              // სტილები რომ მოერგოს შენს დიზაინს
              containerClass="phone-container"
              inputStyle={{
                width: '100%',
                height: '50px',
                background: '#111827', // შენი ინპუტის ფერი
                color: 'white',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              buttonStyle={{
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px 0 0 8px'
              }}
              dropdownStyle={{
                background: '#1f2937',
                color: 'white'
              }}
            />
          </div>
          <div>
            <label className="nvx-label">{t("contact.form.service")}</label>
            <select className="auth-input" name="service" value={form.service} onChange={onChange}>
              <option value="Website">Website</option>
              <option value="Web App">Web App</option>
              <option value="AI Automation">AI Automation</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <label className="nvx-label">{t("contact.form.budget")}</label>
          <select className="auth-input" name="budget" value={form.budget} onChange={onChange}>
            <option value="Not sure">{t("contact.form.budget_options.not_sure")}</option>
            <option value="$300 - $800">$300 - $800</option>
            <option value="$800 - $2000">$800 - $2000</option>
            <option value="$2000 - $5000">$2000 - $5000</option>
            <option value="$5000+">$5000+</option>
          </select>
        </div>

        <div style={{ marginTop: 15 }}>
          <label className="nvx-label">{t("contact.form.message")}</label>
          <textarea 
            className="auth-input" 
            name="message" 
            value={form.message} 
            onChange={onChange} 
            placeholder={t("contact.form.placeholders.message")} 
            required 
            rows={5} 
          />
        </div>

        <button className="btn primary large-btn" type="submit" disabled={loading || !canSend} style={{ width: "100%", marginTop: 20 }}>
          {loading ? "..." : t("contact.form.send")}
        </button>

        <p style={{ marginTop: 15, textAlign: "center" }}>
          {t("contact.form.direct_email")} <a href="mailto:nevarixstudio@gmail.com">nevarixstudio@gmail.com</a>
        </p>
      </form>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        /* ტელეფონის ინპუტის ტექსტის ფერი */
        .react-tel-input .form-control {
          color: white !important;
        }
        /* ქვეყნის კოდის ფერი სიაში */
        .react-tel-input .country-list .country-name {
          color: white !important;
        }
        .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag.open {
            background-color: #374151 !important;
        }
      `}</style>
    </>
  );
}