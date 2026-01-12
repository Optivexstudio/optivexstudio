import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Support() {
  const navigate = useNavigate();
  const { t } = useTranslation("", { keyPrefix: "support" });

  const topics = [
    { id: "website", titleKey: "topics.website.title", descKey: "topics.website.desc" },
    { id: "design", titleKey: "topics.design.title", descKey: "topics.design.desc" },
    { id: "firebase", titleKey: "topics.firebase.title", descKey: "topics.firebase.desc" },
    { id: "deployment", titleKey: "topics.deployment.title", descKey: "topics.deployment.desc" },
    { id: "consulting", titleKey: "topics.consulting.title", descKey: "topics.consulting.desc" },
    { id: "automation", titleKey: "topics.automation.title", descKey: "topics.automation.desc" },
    { id: "other", titleKey: "topics.other.title", descKey: "topics.other.desc" },
  ];

  return (
    <section
      className="container support-page"
      style={{ paddingTop: "150px", paddingBottom: "80px" }}
    >
      <h1 className="section-title">{t("title")}</h1>
      <p className="section-subtitle">{t("subtitle")}</p>

      <div className="support-grid">
        {topics.map((item) => (
          <button
            key={item.id}
            className="support-card"
            type="button"
            onClick={() => navigate(`/support/${item.id}`)}
          >
            <h3>{t(item.titleKey)}</h3>
            <p>{t(item.descKey)}</p>
            <span className="support-cta">{t("open")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
