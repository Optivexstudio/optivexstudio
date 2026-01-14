import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  githubProvider,
  appleProvider, // (დარჩეს, მომავალში დაგჭირდება)
  signInWithEmailAndPassword,
} from "../lib/firebase.js";

import { signInWithPopup, fetchSignInMethodsForEmail } from "firebase/auth";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useTranslation("", { keyPrefix: "auth" });

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showAppleModal, setShowAppleModal] = useState(false);

  // Provider UI
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [activeProvider, setActiveProvider] = useState(null); // ✅ ADD (google/github)

  // Email UI
  const [sendingCode, setSendingCode] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailInfo, setEmailInfo] = useState("");

  // ✅ Provider login (Google/GitHub)
  const handleProviderLogin = async (provider, providerName) => {
    if (providerLoading) return;
    setProviderError("");
    setProviderLoading(true);
    setActiveProvider(providerName); // ✅ track which button was clicked

    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error("Provider login error:", err);

      if (
        err?.code === "auth/cancelled-popup-request" ||
        err?.code === "auth/popup-closed-by-user"
      ) {
        return;
      }

      if (err?.code === "auth/popup-blocked") {
        setProviderError(t("providerErrorPopupBlocked"));
        return;
      }

      setProviderError(err?.message || t("providerErrorDefault"));
    } finally {
      setProviderLoading(false);
      setActiveProvider(null); // ✅ reset
    }
  };

  // ✅ Email Login/Register
  const handleEmailAuth = async (e) => {
    e.preventDefault();

    setEmailError("");
    setEmailInfo("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError(t("emailInvalid"));
      return;
    }

    // LOGIN
    if (!isRegistering) {
      try {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        navigate("/");
      } catch (err) {
        console.error(err);
        setEmailError(t("invalidEmailOrPassword"));
      }
      return;
    }

    // REGISTER (OTP)
    if (password !== confirmPassword) {
      setEmailError(t("passwordsNoMatch"));
      return;
    }

    if (sendingCode) return;
    setSendingCode(true);

    try {
      // ✅ 1) CHECK IF EMAIL EXISTS BEFORE OTP
      const methods = await fetchSignInMethodsForEmail(auth, cleanEmail);

      if (methods.length > 0) {
        setEmailError(t("emailAlreadyRegistered"));
        setEmailInfo("");
        setIsRegistering(false);
        setSendingCode(false);
        return;
      }

      // ✅ 2) Generate OTP ONLY if email is not registered
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // ✅ EmailJS config ENV-იდან
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID;
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        setEmailError(t("emailVerificationNotConfigured"));
        return;
      }

      // ✅ 3) Send OTP
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: cleanEmail, otp_code: otpCode },
        PUBLIC_KEY
      );

      setEmailInfo(t("otpSent", { email: cleanEmail }));

      // ✅ 4) Navigate to verify page
      navigate("/verify", {
        state: { email: cleanEmail, password, generatedOtp: otpCode },
      });
    } catch (err) {
      console.error("Email/OTP error:", err);
      setEmailError(t("otpSendFailed"));
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
            {isRegistering ? t("titleRegister") : t("titleLogin")}
          </h2>

          <p className="cta-message">
            {isRegistering ? t("subtitleRegister") : t("subtitleLogin")}
          </p>

          <div className="form-container">
            {providerError && <div className="auth-error">{providerError}</div>}

            {/* Google */}
            <button
              className="google-btn"
              onClick={() => handleProviderLogin(googleProvider, "google")}
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
              {providerLoading && activeProvider === "google"
                ? t("providerWait")
                : t("continueGoogle")}
            </button>

            {/* GitHub */}
            <button
              className="auth-provider-btn github"
              onClick={() => handleProviderLogin(githubProvider, "github")}
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
              {providerLoading && activeProvider === "github"
                ? t("providerWait")
                : t("continueGithub")}
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
              {t("continueApple")}
            </button>

            <div className="separator">
              <span>{t("or")}</span>
            </div>

            {emailError && <div className="auth-error">{emailError}</div>}
            {emailInfo && <div className="auth-success">{emailInfo}</div>}

            <form onSubmit={handleEmailAuth} style={{ width: "100%" }}>
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
                required
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder={t("passwordPlaceholder")}
                required
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {isRegistering && (
                <input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
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
                    ? t("sending")
                    : t("sendVerificationCode")
                  : t("login")}
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
              {isRegistering ? t("toggleToLogin") : t("toggleToRegister")}
            </p>

            <button
              className="btn ghost"
              style={{ marginTop: "20px", width: "100%" }}
              onClick={() => navigate("/")}
              type="button"
            >
              {t("backHome")}
            </button>
          </div>
        </div>
      </section>

      {/* Apple modal */}
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
                <h3 id="nvx-apple-title">{t("appleModalTitle")}</h3>
                <p className="nvx-modal-sub">{t("appleModalSubtitle")}</p>
              </div>
            </div>

            <div className="nvx-modal-body">
              <div className="nvx-info">
                <span className="dot" />
                {t("appleModalInfo")}
              </div>
            </div>

            <div className="nvx-modal-actions">
              <button
                className="btn ghost"
                type="button"
                onClick={() => setShowAppleModal(false)}
              >
                {t("close")}
              </button>

              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  setShowAppleModal(false);
                  handleProviderLogin(githubProvider, "github");
                }}
              >
                {t("continueGithub")}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>© {new Date().getFullYear()} Nevarix Studio</footer>
    </>
  );
}
