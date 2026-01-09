import React, { useMemo, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // თუ გვერდი პირდაპირ გახსნეს (state არ მოვიდა) — auth-ზე დააბრუნე
  if (!email || !password || !generatedOtp) {
    return (
      <>
        <section
          className="auth-page-section container"
          style={{ paddingTop: "150px", minHeight: "80vh" }}
        >
          <div className="cta-wrap">
            <h2 className="section-title">Session expired</h2>
            <p className="cta-message">Please start registration again.</p>
            <button
              className="btn primary full-width-btn"
              onClick={() => navigate("/auth")}
            >
              Go to Auth
            </button>
          </div>
        </section>

        <footer>© {new Date().getFullYear()} Nevarix Studio</footer>
      </>
    );
  }

  const canVerify = useMemo(() => userOtp.length === 6, [userOtp]);

  const verifyAndRegister = async () => {
    setErrMsg("");
    setOkMsg("");

    if (!canVerify) {
      setErrMsg("Please enter the 6-digit code.");
      return;
    }

    if (userOtp !== generatedOtp) {
      setErrMsg("Invalid 6-digit code! Please check your email.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setOkMsg("✅ Account verified and created successfully!");
      // პატარა delay, რომ user-მა დაინახოს
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      console.error(err);
      setErrMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="auth-page-section container"
        style={{ paddingTop: "150px", minHeight: "80vh" }}
      >
        <div className="cta-wrap">
          <h2 className="section-title">Verify Your Email</h2>
          <p className="cta-message">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>

          <div className="form-container">
            {errMsg && (
              <div className="auth-error" style={{ marginBottom: 12 }}>
                {errMsg}
              </div>
            )}
            {okMsg && (
              <div className="auth-success" style={{ marginBottom: 12 }}>
                {okMsg}
              </div>
            )}

            {/* ✅ Premium OTP input */}
            <div className="nvx-code-wrap">
              <label className="nvx-code-label">Verification code</label>

              <input
                type="text"
                className="nvx-code-input"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                value={userOtp}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setUserOtp(v);
                }}
              />

              <div className="nvx-code-hint">
                Tip: You can paste the code — we’ll format it automatically.
              </div>
            </div>

            <button
              className="btn primary full-width-btn"
              onClick={verifyAndRegister}
              disabled={!canVerify || loading}
              style={{ marginTop: 14 }}
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <p className="auth-toggle-text" onClick={() => navigate("/auth")}>
              Wrong email? <span>Go back</span>
            </p>
          </div>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} Nevarix Studio</footer>
    </>
  );
}
