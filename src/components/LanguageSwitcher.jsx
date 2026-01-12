import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "ka", label: "KA", flag: "🇬🇪", name: "ქართული" },
  { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="nvx-lang" ref={ref}>
      <button
        className="nvx-lang-btn"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nvx-flag" aria-hidden="true">{current.flag}</span>
        <span className="nvx-lang-label">{current.label}</span>
        <span className={`nvx-caret ${open ? "open" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="nvx-lang-menu" role="menu">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitem"
              className={`nvx-lang-item ${l.code === current.code ? "active" : ""}`}
              onClick={() => changeLang(l.code)}
            >
              <span className="nvx-flag" aria-hidden="true">{l.flag}</span>
              <div className="nvx-lang-text">
                <span className="nvx-lang-code">{l.label}</span>
                <span className="nvx-lang-name">{l.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
