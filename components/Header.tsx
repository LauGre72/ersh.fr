import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold hover:underline">ERSH – Portail</Link>
        <nav className="flex gap-4 text-sm">
          {!isHome && <Link to="/" className="hover:underline">← Accueil</Link>}
          <Link to="/bordereau" className="hover:underline">Bordereau</Link>
          <Link to="/emargement" className="hover:underline">Émargement</Link>
          <Link to="/ess-feuille-presence" className="hover:underline">Feuille Présence</Link>
          <Link to="/ess-note-geva" className="hover:underline">Note GEVA</Link>
          <Link to="/ess-point-situation" className="hover:underline">Points Situation</Link>
        </nav>
      </div>
    </header>
  );
}
