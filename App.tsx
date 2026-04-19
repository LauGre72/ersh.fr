import { Navigate, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AuthGate from "./components/AuthGate";
import Home from "./components/Home";
import BordereauForm from "./components/forms/BordereauForm";
import EmargementForm from "./components/forms/EmargementForm";
import ReunionEssForm from "./components/forms/ReunionEssForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bordereau" element={<BordereauForm />} />
          <Route path="/emargement" element={<EmargementForm />} />
          <Route path="/reunion-ess" element={<ReunionEssForm />} />
          <Route path="/ess-feuille-presence" element={<Navigate to="/reunion-ess" replace />} />
          <Route path="/ess-note-geva" element={<Navigate to="/reunion-ess" replace />} />
          <Route path="/ess-point-situation" element={<Navigate to="/reunion-ess" replace />} />
        </Routes>
      </AuthGate>
      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-500">
        <div className="border-t pt-4">
          Besoin d'aide ? Contactez le support technique.
        </div>
      </footer>
    </div>
  );
}
