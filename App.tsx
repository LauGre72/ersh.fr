import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AuthGate from "./components/AuthGate";
import Home from "./components/Home";
import BordereauForm from "./components/forms/BordereauForm";
import EmargementForm from "./components/forms/EmargementForm";
import EssFeuillePresenceForm from "./components/forms/EssFeuillePresenceForm";
import EssNoteGevaForm from "./components/forms/EssNoteGevaForm";
import EssPointSituationForm from "./components/forms/EssPointSituationForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthGate>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bordereau" element={<BordereauForm />} />
          <Route path="/emargement" element={<EmargementForm />} />
          <Route path="/ess-feuille-presence" element={<EssFeuillePresenceForm />} />
          <Route path="/ess-note-geva" element={<EssNoteGevaForm />} />
          <Route path="/ess-point-situation" element={<EssPointSituationForm />} />
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
