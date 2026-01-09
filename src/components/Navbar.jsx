import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Navbar = () => {
  // ✅ keyPrefix უკვე გაქვს, ამიტომ t("services") და ა.შ.
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

  const toggleMenu = () => setIsMenuOpen((p) => !p);

  // Home-ზე სექციაზე გადასვლა (თუ სხვა გვერდზე ხარ, ჯერ Home, მერე scroll)
  const goToSection = (hash) => {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: hash } });
      return;
    }

    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goHomeTop = () => {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    const el = document.querySelector("#hero");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goAuth = () => {
    setIsMenuOpen(false);
    navigate("/auth");
  };

  const goSupport = () => {
    setIsMenuOpen(false);
    navigate("/support");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav aria-label={t("aria")}>
      <div className="nav-container">
        {/* ლოგო -> Home (hero) */}
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

        {/* ✅ აქ დავამატე wrapper რომ LanguageSwitcher + Burger გვერდიგვერდ იყოს */}
        <div className="nav-actions">
        

          <button
            id="burger"
            className={`burger ${isMenuOpen ? "active" : ""}`}
            aria-label={t("openMenu")}
            onClick={toggleMenu}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div id="nav-menu" className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#services");
            }}
          >
            {t("services")}
          </a>

          <a
            href="#automation"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#automation");
            }}
          >
            {t("automation")}
          </a>

          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#projects");
            }}
          >
            {t("projects")}
          </a>

          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#faq");
            }}
          >
            {t("faq")}
          </a>

          {/* ✅ Support მხოლოდ დალოგინებულზე */}
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
                    className="btn small-btn logout-red-btn"
                    onClick={handleLogout}
                    type="button"
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
