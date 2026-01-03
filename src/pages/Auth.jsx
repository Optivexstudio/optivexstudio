import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithEmailAndPassword } from "../lib/firebase.js";

import { signInWithPopup } from "firebase/auth";
import emailjs from "@emailjs/browser";

export default function Auth() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      const templateParams = { to_email: email, otp_code: otpCode };

      emailjs
        .send(
          "K1LysGke1TQn2vFYq",
          "YOUR_TEMPLATE_ID",
          templateParams,
          "YOUR_PUBLIC_KEY"
        )
        .then(() => {
          alert("Verification code sent to " + email);

          // OTP + creds გადავიტანოთ verify გვერდზე state-ით
          navigate("/verify", {
            state: { email, password, generatedOtp: otpCode },
          });
        })
        .catch((err) => {
          console.error("EmailJS Error:", err);
          alert("Failed to send code. Please try again.");
        });
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (err) {
        alert("Invalid credentials.");
      }
    }
  };

  return (
    <>
      <section className="auth-page-section container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
        <div className="cta-wrap">
          <h2 className="section-title">{isRegistering ? "Create Account" : "Welcome Back"}</h2>
          <p className="cta-message">
            {isRegistering ? "Join our elite network of innovators." : "Join our elite network of digital innovators."}
          </p>

          <div className="form-container">
            <button className="btn primary google-btn" style={{ width: "100%", marginBottom: "20px" }} onClick={handleGoogleLogin}>
              Continue with Google
            </button>

            <div className="separator"><span>OR</span></div>

            <form onSubmit={handleEmailAuth} style={{ width: "100%" }}>
              <input type="email" placeholder="Email Address" required className="auth-input" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" required className="auth-input" onChange={(e) => setPassword(e.target.value)} />

              {isRegistering && (
                <input type="password" placeholder="Confirm Password" required className="auth-input" onChange={(e) => setConfirmPassword(e.target.value)} />
              )}

              <button type="submit" className="btn primary full-width-btn" style={{ width: "100%" }}>
                {isRegistering ? "Send Verification Code" : "Login"}
              </button>
            </form>

            <p className="auth-toggle-text" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Login" : "Don't have an account? Register here"}
            </p>

            <button className="btn ghost" style={{ marginTop: "20px", width: "100%" }} onClick={() => navigate("/")}>
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      <footer>© 2025 Optivex Studio</footer>
    </>
  );
}
