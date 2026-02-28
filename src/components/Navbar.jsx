import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation("", { keyPrefix: "nav" });

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((p) => !p);
    setShowDropdown(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setShowDropdown(false);
  };

  const goToSection = (hash) => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: hash } });
      return;
    }
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goHomeTop = () => {
    closeMenu();
    if (location.pathname !== "/") {
      navigate("/");
      return;
    }
    const el = document.querySelector("#hero");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goAuth = () => {
    closeMenu();
    navigate("/auth");
  };

  const goSupport = () => {
    closeMenu();
    navigate("/support");
  };

  // ✅ განახლებული Logout ფუნქცია
  const handleLogout = async () => {
    try {
      // 1. ვშლით ჩატის ისტორიას ბრაუზერიდან
      localStorage.removeItem('intergram-id');
      localStorage.removeItem('intergram-chats');
      
      // 2. გამოვდივართ Firebase-დან
      await signOut(auth);
      
      closeMenu();
      navigate("/");
      
      // 3. სრული გადატვირთვა, რომ ჩატის სკრიპტიც გასუფთავდეს
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav aria-label={t("aria")}>
      <div className="nav-container">
        <a
          className="logo"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            goHomeTop();
          }}
        >
          Nevarix
        </a>

        <div className="nav-actions">
          <LanguageSwitcher />
          <button
            id="burger"
            className={`burger ${isMenuOpen ? "active" : ""}`}
            aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="nav-menu"
            onClick={toggleMenu}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div id="nav-menu" className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          <a href="#services" onClick={(e) => { e.preventDefault(); goToSection("#services"); }}>{t("services")}</a>
          <a href="#automation" onClick={(e) => { e.preventDefault(); goToSection("#automation"); }}>{t("automation")}</a>
          <a href="#projects" onClick={(e) => { e.preventDefault(); goToSection("#projects"); }}>{t("projects")}</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); goToSection("#faq"); }}>{t("faq")}</a>

          {user && (
            <a
              href="/support"
              onClick={(e) => {
                e.preventDefault();
                goSupport();
              }}
            >
              {t("support")}
            </a>
          )}

          {!user ? (
            <a
              href="/auth"
              className="auth-control"
              onClick={(e) => {
                e.preventDefault();
                goAuth();
              }}
            >
              {t("auth")}
            </a>
          ) : (
            <div className="auth-control">
              <button
                className="user-email-btn"
                onClick={() => setShowDropdown((p) => !p)}
                type="button"
              >
                {user.email?.split("@")[0]}
              </button>

              {showDropdown && (
                <div className="dropdown-content" style={{ display: "block" }}>
                  <button
                    className="btn small-btn profile-btn"
                    type="button"
                    onClick={() => {
                      setShowDropdown(false);
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    {t("profile")}
                  </button>
                  <button
                    className="btn small-btn logout-red-btn"
                    onClick={handleLogout}
                    type="button"
                    style={{ marginTop: "10px" }}
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          )}

          <a
            href="#contact"
            className="btn primary small-btn hide-on-mobile"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#contact");
            }}
          >
            {t("contact")}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;