import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import ProfileModal from "./ProfileModal";
import logoComplet from "../assets/logo-complet.png";

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
      <header className="app-header sticky top-0 z-40 border-b border-[#174B6A] bg-[#2A6F97] text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" className="rounded-md bg-white px-3 py-1 transition hover:bg-[#E6EDF2]" aria-label="Accueil ERSH.fr">
            <img src={logoComplet} alt="ERSH.fr" className="h-9 w-auto" />
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-1 text-white">
            {!isHome && (
              <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                Accueil
              </Link>
            )}
            {!isHome && <div className="w-px self-stretch bg-white/25" />}
            <Link to="/fil-conducteur" className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              Kanban
            </Link>
            <Link to="/fil-conducteur/import" className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
              Import CSV
            </Link>
            <Link to="/bordereau" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15 hover:text-white">
              Bordereau
            </Link>
            <Link to="/emargement" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15 hover:text-white">
              Émargement
            </Link>
            <Link to="/reunion-ess" className="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/15 hover:text-white">
              Compte rendu ESS
            </Link>
            {user && (
              <button
                type="button"
                onClick={() => setProfileOpen(true)}
                aria-label="Gérer le profil"
                title="Gérer le profil"
                className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-[#153A5B] shadow-sm transition hover:bg-[#E6EDF2] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2A6F97]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="#153A5B"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="8" r="3" />
                  <path d="M4.5 19a5.5 5.5 0 0 1 11 0" />
                  <path d="m16 13 3 3" />
                  <path d="m20.5 10.5-5 5L14 18l2.5-1.5 5-5a.7.7 0 0 0-1-1Z" />
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
