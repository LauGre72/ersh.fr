import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AuthGate from "./components/AuthGate";
import Home from "./components/Home";
import BordereauForm from "./components/forms/BordereauForm";
import EmargementForm from "./components/forms/EmargementForm";
import ReunionEssForm from "./components/forms/ReunionEssForm";
import FilConducteurApp from "./components/fil-conducteur/FilConducteurApp";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fil-conducteur/*" element={<FilConducteurApp />} />          
          <Route path="/bordereau" element={<BordereauForm />} />
          <Route path="/emargement" element={<EmargementForm />} />
          <Route path="/reunion-ess" element={<ReunionEssForm />} />
        </Routes>
      </AuthGate>
      <footer className="mx-auto max-w-7xl px-4 py-8 text-xs text-slate-500">
        <div className="border-t border-[#D6E2EA] pt-4">
          ERSH.fr - accompagnement, coordination et suivi des parcours.
        </div>
      </footer>
    </div>
  );
}
