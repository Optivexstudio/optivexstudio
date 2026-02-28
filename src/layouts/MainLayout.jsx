import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Intergram კონფიგურაცია
    window.intergramId = "7505896215";
    window.intergramCustomizations = {
      mainColor: '#6366f1',
      alwaysUseFloatingButton: false // ვმალავთ სტანდარტულ ღილაკს
    };

    // სკრიპტის ჩამატება
    const script = document.createElement("script");
    script.src = "https://www.intergram.xyz/js/widget.js";
    script.async = true;
    document.body.appendChild(script);

    // ფუნქცია ჩატის გამოსაძახებლად
    window.openNevarixChat = () => {
      const chatRoot = document.getElementById('intergramRoot');
      if (chatRoot) {
        // ვაჩენთ კონტეინერს და ვაჭერთ ღილაკს
        chatRoot.style.setProperty('display', 'block', 'important');
        const btn = chatRoot.querySelector('.intergramButton');
        if (btn) btn.click();
      }
    };

    // საწყისი დამალვა
    const style = document.createElement('style');
    style.id = 'hide-chat-style';
    style.textContent = `#intergramRoot { display: none !important; }`;
    document.head.appendChild(style);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      const s = document.getElementById('hide-chat-style');
      if (s) s.remove();
    };
  }, []);

  return (
    <div className="site-wrapper">
      <Navbar onHomeClick={() => navigate("/")} onLoginClick={() => navigate("/auth")} />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}