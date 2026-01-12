import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import SupportTopic from "./pages/SupportTopic";
import Profile from "./pages/Profile";



import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🌐 Language Switcher – fixed top-right */}
  

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/support" element={<Support />} />
          <Route path="/support/:topic" element={<SupportTopic />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
