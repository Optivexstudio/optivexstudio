import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase.js";


import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Home-ზე სექციაზე გადასვლა (თუ სხვა გვერდზე ხარ, ჯერ Home, მერე scroll)
  const goToSection = (hash) => {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      // ჯერ Home-ზე გადადი და state-ში გადავეცით სად უნდა ჩასქროლოს
      navigate("/", { state: { scrollTo: hash } });
      return;
    }

    // უკვე Home-ზე ხარ -> პირდაპირ scroll
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

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav aria-label="Main navigation">
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

        <button
          id="burger"
          className={`burger ${isMenuOpen ? "active" : ""}`}
          aria-label="Open menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div id="nav-menu" className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#services");
            }}
          >
            Services
          </a>

          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#projects");
            }}
          >
            Projects
          </a>

          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              goToSection("#faq");
            }}
          >
            FAQ
          </a>

          {!user ? (
            <a
              href="/auth"
              className="auth-control"
              onClick={(e) => {
                e.preventDefault();
                goAuth();
              }}
            >
              Register / Login
            </a>
          ) : (
            <div className="auth-control">
              <button
                className="user-email-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.email?.split("@")[0]}
              </button>
              

              {showDropdown && (
                <div className="dropdown-content" style={{ display: "block" }}>
                  <button
                    className="btn small-btn logout-red-btn"
                    onClick={handleLogout}
                  >
                    Logout
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
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
