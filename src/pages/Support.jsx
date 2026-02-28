import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ დაამატე ეს

export default function Support() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation(); // ✅ დაინიციალიზირე t ფუნქცია

  // თემების სია თარგმანებით
  const topics = [
    { id: "website", title: t("support.topics.website.title"), desc: t("support.topics.website.desc") },
    { id: "design", title: t("support.topics.design.title"), desc: t("support.topics.design.desc") },
    { id: "firebase", title: t("support.topics.firebase.title"), desc: t("support.topics.firebase.desc") },
    { id: "deploy", title: t("support.topics.deploy.title"), desc: t("support.topics.deploy.desc") },
    { id: "consultation", title: t("support.topics.consultation.title"), desc: t("support.topics.consultation.desc") },
    { id: "automation", title: t("support.topics.automation.title"), desc: t("support.topics.automation.desc") },
    { id: "other", title: t("support.topics.other.title"), desc: t("support.topics.other.desc") },
  ];

  const handleRequestSupport = () => {
    navigate("/", { state: { scrollTo: "#direct-contact" } });
  };

  return (
    <section className="container support-page" style={{ paddingTop: "150px", paddingBottom: "100px" }}>
      {!id ? (
        <div className="support-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {topics.map((item) => (
            <div 
              key={item.id} 
              className="support-card" 
              onClick={() => navigate(`/support/${item.id}`)}
              style={{ cursor: 'pointer', padding: '35px', borderRadius: '24px', background: '#fff', border: '1px solid #f0f0f0', transition: '0.3s' }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>{item.desc}</p>
              <span style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '0.9rem' }}>{t("support.open_topic")} →</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", maxWidth: '700px', margin: '0 auto', minHeight: '60vh' }}>
          <button 
            onClick={() => navigate("/support")} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', marginBottom: '30px', fontSize: '1rem' }}
          >
            ← {t("support.back")}
          </button>
          
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '20px' }}>
            {topics.find(t_item => t_item.id === id)?.title}
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '50px' }}>
            {t("support.ready_help")}
          </p>
          
          <div style={{ background: '#fcfcff', padding: '50px', borderRadius: '30px', border: '1px dashed #dee1ff' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>{t("support.need_help_topic")}</h3>
            <button
              onClick={handleRequestSupport}
              className="btn large-btn"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: "white", padding: "20px 50px", borderRadius: "15px", border: "none",
                fontSize: "1.1rem", fontWeight: "700", cursor: "pointer",
                boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)"
              }}
            >
              {t("support.request_btn")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}