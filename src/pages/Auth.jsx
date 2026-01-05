import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  githubProvider,
  appleProvider, // (დარჩეს, მომავალში დაგჭირდება)
  signInWithEmailAndPassword,
} from "../lib/firebase.js";

import { signInWithPopup } from "firebase/auth";
import emailjs from "@emailjs/browser";

export default function Auth() {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showAppleModal, setShowAppleModal] = useState(false);

  // Provider UI
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState("");

  // Email UI
  const [sendingCode, setSendingCode] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailInfo, setEmailInfo] = useState("");

  // OTP (რეგისტრაციისთვის)
  const [generatedOtp, setGeneratedOtp] = useState("");

  // ✅ Provider login (Google/GitHub)
  const handleProviderLogin = async (provider) => {
    if (providerLoading) return; // anti double click
    setProviderError("");
    setProviderLoading(true);

    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error("Provider login error:", err);

      // ✅ ესენი ჩვეულებრივი popup error-ებია — არ ვაჩვენებთ alert-ით
      if (
        err?.code === "auth/cancelled-popup-request" ||
        err?.code === "auth/popup-closed-by-user"
      ) {
        setProviderLoading(false);
        return;
      }

      if (err?.code === "auth/popup-blocked") {
        setProviderError("Popup was blocked. Please allow popups and try again.");
        setProviderLoading(false);
        return;
      }

      setProviderError(err?.message || "Login failed. Please try again.");
    } finally {
      setProviderLoading(false);
    }
  };

  // ✅ Email Login/Register
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    setEmailError("");
    setEmailInfo("");

    // LOGIN
    if (!isRegistering) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (err) {
        console.error(err);
        setEmailError("Invalid email or password.");
      }
      return;
    }

    // REGISTER (OTP)
    if (password !== confirmPassword) {
      setEmailError("Passwords do not match!");
      return;
    }

    if (sendingCode) return;
    setSendingCode(true);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);

    try {
      // ⚠️ EmailJS config (თუ არ გაქვს, არ დაიკრას alert)
      const SERVICE_ID = "service_cync1qb";
      const TEMPLATE_ID = "template_chmnh8c";
      const PUBLIC_KEY = "K1LysGke1TQn2vFYq";

      // ✅ თუ არ არის დაკონფიგურებული — ლამაზად დავწეროთ და გავჩერდეთ
      if (TEMPLATE_ID.includes("YOUR_") || PUBLIC_KEY.includes("YOUR_")) {
        setEmailError(
          "Email verification is not configured yet. Please use Google/GitHub for registration for now."
        );
        return;
      }

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: email, otp_code: otpCode },
        PUBLIC_KEY
      );

      setEmailInfo("Verification code sent to " + email);

      navigate("/verify", {
        state: { email, password, generatedOtp: otpCode },
      });
    } catch (err) {
      console.error("Email/OTP error:", err);
      setEmailError("Failed to send code. Please try again later.");
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <>
      <section
        className="auth-page-section container"
        style={{ paddingTop: "150px", minHeight: "80vh" }}
      >
        <div className="cta-wrap">
          <h2 className="section-title">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="cta-message">
            {isRegistering
              ? "Join our elite network of innovators."
              : "Join our elite network of digital innovators."}
          </p>

          <div className="form-container">
            {/* ✅ Provider errors (no alert) */}
            {providerError && <div className="auth-error">{providerError}</div>}

            {/* Google */}
            <button
              className="google-btn"
              onClick={() => handleProviderLogin(googleProvider)}
              type="button"
              disabled={providerLoading}
            >
              <span className="google-icon" aria-hidden="true">
                <svg viewBox="0 0 48 48" width="18" height="18">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.1 0 5.6 1.1 7.6 2.9l5.6-5.6C33.7 3.4 29.2 1.5 24 1.5 14.9 1.5 7.3 7.5 4.7 15.7l6.9 5.4C13.3 14.5 18.2 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v7.7h12.7c-.5 2.9-2.2 5.4-4.7 7.1l7.3 5.6c4.3-4 6.8-9.9 6.8-16.3z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M11.6 28.9c-.4-1.2-.6-2.5-.6-3.9s.2-2.7.6-3.9l-6.9-5.4C2.9 18.6 2 21.7 2 25s.9 6.4 2.7 9.3l6.9-5.4z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 46.5c5.2 0 9.6-1.7 12.8-4.7l-7.3-5.6c-2 1.4-4.6 2.2-5.5 2.2-5.8 0-10.7-5-12.4-11.6l-6.9 5.4C7.3 40.5 14.9 46.5 24 46.5z"
                  />
                </svg>
              </span>
              {providerLoading ? "Please wait..." : "Continue with Google"}
            </button>

            {/* GitHub */}
            <button
              className="auth-provider-btn github"
              onClick={() => handleProviderLogin(githubProvider)}
              type="button"
              disabled={providerLoading}
            >
              <span className="provider-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M12 .5C5.73.5.75 5.62.75 12c0 5.12 3.32 9.47 7.94 11 .58.11.79-.26.79-.58 0-.28-.01-1.02-.02-2-3.23.72-3.91-1.6-3.91-1.6-.53-1.38-1.29-1.74-1.29-1.74-1.06-.74.08-.73.08-.73 1.17.08 1.79 1.23 1.79 1.23 1.04 1.82 2.73 1.3 3.4.99.11-.77.41-1.3.74-1.6-2.58-.3-5.29-1.32-5.29-5.89 0-1.3.45-2.36 1.19-3.19-.12-.3-.52-1.52.11-3.17 0 0 .98-.32 3.2 1.22.93-.26 1.93-.39 2.93-.39s2 .13 2.93.39c2.22-1.54 3.2-1.22 3.2-1.22.63 1.65.23 2.87.11 3.17.74.83 1.19 1.9 1.19 3.19 0 4.58-2.71 5.58-5.3 5.88.42.37.79 1.1.79 2.22 0 1.6-.02 2.88-.02 3.27 0 .32.21.69.8.58 4.62-1.53 7.94-5.88 7.94-11C23.25 5.62 18.27.5 12 .5Z"
                  />
                </svg>
              </span>
              {providerLoading ? "Please wait..." : "Continue with GitHub"}
            </button>

            {/* Apple */}
            <button
              className="auth-provider-btn apple"
              type="button"
              onClick={() => setShowAppleModal(true)}
            >
              <span className="provider-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M16.7 13.3c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.1 2.8-1.2.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.4-3.2ZM14.8 6.8c.6-.8 1.1-1.9 1-3-.9.1-2 .7-2.6 1.5-.6.7-1.1 1.8-.9 2.9 1 .1 1.9-.6 2.5-1.4Z"
                  />
                </svg>
              </span>
              Continue with Apple
            </button>

            <div className="separator">
              <span>OR</span>
            </div>

            {/* ✅ Email errors/info */}
            {emailError && <div className="auth-error">{emailError}</div>}
            {emailInfo && <div className="auth-success">{emailInfo}</div>}

            <form onSubmit={handleEmailAuth} style={{ width: "100%" }}>
              <input
                type="email"
                placeholder="Email Address"
                required
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                required
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {isRegistering && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <button
                type="submit"
                className="btn primary full-width-btn"
                style={{ width: "100%" }}
                disabled={sendingCode}
              >
                {isRegistering
                  ? sendingCode
                    ? "Sending..."
                    : "Send Verification Code"
                  : "Login"}
              </button>
            </form>

            <p
              className="auth-toggle-text"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setEmailError("");
                setEmailInfo("");
              }}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register here"}
            </p>

            <button
              className="btn ghost"
              style={{ marginTop: "20px", width: "100%" }}
              onClick={() => navigate("/")}
              type="button"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* ✅ Apple modal */}
      {showAppleModal && (
        <div
          className="nvx-modal-backdrop"
          onClick={() => setShowAppleModal(false)}
          role="presentation"
        >
          <div
            className="nvx-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nvx-apple-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="nvx-modal-head">
              <div className="nvx-modal-badge apple-logo">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16.7 13.3c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.7-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.3 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-.1 2.8-1.2.9-1.2 1.2-2.4 1.2-2.5-.1 0-2.4-.9-2.4-3.2ZM14.8 6.8c.6-.8 1.1-1.9 1-3-.9.1-2 .7-2.6 1.5-.6.7-1.1 1.8-.9 2.9 1 .1 1.9-.6 2.5-1.4Z"
                  />
                </svg>
              </div>

              <div>
                <h3 id="nvx-apple-title">Apple Sign-In — Coming soon</h3>
                <p className="nvx-modal-sub">
                  We’ll enable Apple login after the Apple Developer setup is completed.
                </p>
              </div>
            </div>

            <div className="nvx-modal-body">
              <div className="nvx-info">
                <span className="dot" />
                For now you can sign in with <strong>Google</strong>,{" "}
                <strong>GitHub</strong> or <strong>Email</strong>.
              </div>
            </div>

            <div className="nvx-modal-actions">
              <button
                className="btn ghost"
                type="button"
                onClick={() => setShowAppleModal(false)}
              >
                Close
              </button>

              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  setShowAppleModal(false);
                  handleProviderLogin(githubProvider);
                }}
              >
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>© 2025 Optivex Studio</footer>
    </>
  );
}
