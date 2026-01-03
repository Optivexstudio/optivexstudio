import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../lib/firebase.js";


export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const email = state.email;
  const password = state.password;
  const generatedOtp = state.generatedOtp;

  const [userOtp, setUserOtp] = useState("");

  // თუ გვერდი პირდაპირ გახსნეს (state არ მოვიდა) — auth-ზე დააბრუნე
  if (!email || !password || !generatedOtp) {
    return (
      <section className="auth-page-section container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <div className="cta-wrap">
          <h2 className="section-title">Session expired</h2>
          <p className="cta-message">Please start registration again.</p>
          <button className="btn primary full-width-btn" onClick={() => navigate("/auth")}>
            Go to Auth
          </button>
        </div>
      </section>
    );
  }

  const verifyAndRegister = async () => {
    if (userOtp === generatedOtp) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account verified and created successfully!");
        navigate("/");
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("Invalid 6-digit code! Please check your email.");
    }
  };

  return (
    <>
      <section className="auth-page-section container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <div className="cta-wrap">
          <h2 className="section-title">Verify Your Email</h2>
          <p className="cta-message">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>

          <div className="form-container">
            <input
              type="text"
              className="otp-input"
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              onChange={(e) => setUserOtp(e.target.value)}
            />

            <button className="btn primary full-width-btn" onClick={verifyAndRegister}>
              Verify & Register
            </button>

            <p className="auth-toggle-text" onClick={() => navigate("/auth")}>
              Wrong email? <span>Go back</span>
            </p>
          </div>
        </div>
      </section>

      <footer>© 2025 Optivex Studio</footer>
    </>
  );
}
