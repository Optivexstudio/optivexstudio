import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation("", { keyPrefix: "profile" });

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
      if (!u) navigate("/auth");
    });

    return () => unsub();
  }, [navigate]);

  if (checking) return null;
  if (!user) return null;

  const username = user.email?.split("@")[0] || t("fallbackUser");

  return (
    <section className="container" style={{ paddingTop: "150px", minHeight: "80vh" }}>
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>

        <div>
          <h1 className="profile-name">{username}</h1>
          <p className="profile-email">{user.email}</p>
          <span className="profile-badge">{t("badge")}</span>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="profile-stats">
        <div className="profile-card">
          <h3>{t("stats.projects")}</h3>
          <strong>0</strong>
        </div>

        <div className="profile-card">
          <h3>{t("stats.support")}</h3>
          <strong>0</strong>
        </div>

        <div className="profile-card">
          <h3>{t("stats.automations")}</h3>
          <strong>0</strong>
        </div>
      </div>

      {/* PROJECTS */}
      <div className="profile-section">
        <h2>{t("projects.title")}</h2>
        <p className="muted">{t("projects.empty")}</p>

        <button
          className="btn primary"
          onClick={() => navigate("/", { state: { scrollTo: "#contact" } })}
          type="button"
        >
          {t("projects.cta")}
        </button>
      </div>

      {/* SUPPORT */}
      <div className="profile-section">
        <h2>{t("support.title")}</h2>
        <p className="muted">{t("support.desc")}</p>

        <button className="btn ghost" onClick={() => navigate("/support")} type="button">
          {t("support.cta")}
        </button>
      </div>
    </section>
  );
}
