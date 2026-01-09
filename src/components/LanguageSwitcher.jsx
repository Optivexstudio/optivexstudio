import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLang = i18n.language.toUpperCase();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("nvx_lang", lng);
    setOpen(false);
  };

  // 👇 dropdown გარეთ დაჭერაზე დაიხუროს
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-btn"
        onClick={() => setOpen((p) => !p)}
        aria-label="Change language"
      >
        {currentLang} <span className="arrow">▾</span>
      </button>

      {open && (
        <div className="lang-menu">
          <button onClick={() => changeLang("en")}>EN</button>
          <button onClick={() => changeLang("ka")}>KA</button>
          <button onClick={() => changeLang("ru")}>RU</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
