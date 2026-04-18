import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-800">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-white text-xl hover:text-blue-100 transition">
          🎓 ERSH Portail
        </Link>
        <nav className="flex gap-1 text-white">
          {!isHome && (
            <Link 
              to="/" 
              className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm"
            >
              ← Accueil
            </Link>
          )}
          {!isHome && <div className="w-px bg-blue-500"></div>}
          <Link to="/bordereau" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Bordereau</Link>
          <Link to="/emargement" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Émargement</Link>
          <Link to="/ess-feuille-presence" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Feuille</Link>
          <Link to="/ess-note-geva" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Note</Link>
          <Link to="/ess-point-situation" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Points</Link>
        </nav>
      </div>
    </header>
  );
}
