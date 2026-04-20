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
            <Link to="/reunion-ess" className="px-3 py-2 text-white hover:bg-blue-500 rounded-lg transition text-sm">Reunion ESS</Link>
            {user && (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                aria-label="Gérer le profil"
                title="Gérer le profil"
                className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-950 bg-blue-950 text-white transition hover:bg-blue-900"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15.5 19.5h-7A3.5 3.5 0 0 1 5 16a5 5 0 0 1 5-5h4" />
                  <circle cx="11" cy="7" r="3" />
                  <path d="m16 11 4 4" />
                  <path d="m20.5 10.5-5.75 5.75L13 17l.75-1.75 5.75-5.75a.7.7 0 0 1 1 1Z" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </header>
      <ProfileModal open={profileOpen} user={user} onClose={() => setProfileOpen(false)} />
    </>
  );
}
