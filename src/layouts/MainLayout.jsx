import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { hideTawk } from "../lib/tawk.js";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Route შეცვლაზე ყოველთვის დავმალოთ (არასდროს showWidget აქედან)
  useEffect(() => {
    hideTawk();
  }, [location.pathname]);

  return (
    <div className="site-wrapper">
      <Navbar
        onHomeClick={() => navigate("/")}
        onLoginClick={() => navigate("/auth")}
      />
      <Outlet />
    </div>
  );
}

