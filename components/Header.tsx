import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import ProfileModal from "./ProfileModal";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <header className="app-header sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg border-b border-blue-800">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-bold text-white text-xl hover:text-blue-100 transition">
            ERSH Portail
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1 text-white">
            {!isHome && (
              <Link
                to="/"
                className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm"
              >
                Accueil
              </Link>
            )}
            {!isHome && <div className="w-px self-stretch bg-blue-500" />}
            <Link to="/bordereau" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Bordereau</Link>
            <Link to="/emargement" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Emargement</Link>
            <Link to="/ess-feuille-presence" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Feuille</Link>
            <Link to="/ess-note-geva" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Note</Link>
            <Link to="/ess-point-situation" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Points</Link>
            {user && (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                className="ml-1 inline-flex items-center gap-2 rounded-lg border border-blue-950 bg-blue-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                <span aria-hidden="true">👤</span>
                <span>Profil</span>
              </button>
            )}
          </nav>
        </div>
      </header>
      <ProfileModal open={profileOpen} user={user} onClose={() => setProfileOpen(false)} />
    </>
  );
}
