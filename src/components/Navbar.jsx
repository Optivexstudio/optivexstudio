import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = ({ onLoginClick, onHomeClick }) => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav aria-label="Main navigation">
      <div className="nav-container">
        {/* ლოგოზე დაჭერა აბრუნებს მთავარ გვერდზე */}
        <a 
          className="logo" 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); onHomeClick(); }}
        >
          Tiflisbyte
        </a>
        
        <button 
          id="burger" 
          className={`burger ${isMenuOpen ? 'active' : ''}`} 
          aria-label="Open menu"
          onClick={toggleMenu}
        >
          <span></span><span></span><span></span>
        </button>
        
        <div id="nav-menu" className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
          <a href="#services" onClick={() => { setIsMenuOpen(false); onHomeClick(); }}>Services</a> 
          <a href="#projects" onClick={() => { setIsMenuOpen(false); onHomeClick(); }}>Projects</a>
          <a href="#faq" onClick={() => { setIsMenuOpen(false); onHomeClick(); }}>FAQ</a>
          
          {!user ? (
            <a 
              href="#registration" 
              className="auth-control"
              onClick={(e) => { 
                e.preventDefault(); 
                setIsMenuOpen(false);
                onLoginClick(); // გადაჰყავს რეგისტრაციის გვერდზე
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
                {user.email.split('@')[0]}
              </button>
              
              {showDropdown && (
                <div className="dropdown-content" style={{ display: 'block' }}>
                  <button 
                    className="btn small-btn logout-red-btn" 
                    onClick={() => {
                      signOut(auth);
                      onHomeClick();
                    }}
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
            onClick={() => onHomeClick()}
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;