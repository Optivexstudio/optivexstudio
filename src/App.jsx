import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support"; // მხოლოდ ეს დავტოვოთ
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify" element={<Verify />} />
          
          {/* ორივე მისამართზე ვუშვებთ Support-ს */}
          <Route path="/support" element={<Support />} />
          <Route path="/support/:id" element={<Support />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}