import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { getProfile, saveProfile, type UserProfile } from "./api";

const EMPTY_PROFILE: UserProfile = {
  full_name: "",
  email: "",
  sign: "",
  news: false,
};

export default function ProfileModal({
  open,
  user,
  onClose,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const loadedProfile = await getProfile(token);
        if (!cancelled) {
          setProfile({
            ...EMPTY_PROFILE,
            email: user.email || "",
            ...loadedProfile,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setProfile(prev => ({ ...prev, email: prev.email || user.email || "" }));
          setError(err instanceof Error ? err.message : "Erreur lors du chargement du profil");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken();
      await saveProfile(profile, token);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement du profil");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mon profil</h2>
            <p className="mt-1 text-sm text-gray-600">Informations reprises dans les documents générés.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Fermer
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Nom complet</span>
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Adresse e-mail</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Signature / qualité</span>
            <textarea
              className="mt-1 h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={profile.sign}
              onChange={(e) => setProfile({ ...profile, sign: e.target.value })}
              placeholder="Ex. ERSEH - secteur ..."
            />
          </label>

          <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={profile.news}
              onChange={(e) => setProfile({ ...profile, news: e.target.checked })}
              className="h-4 w-4"
            />
            <span>Recevoir les actualités</span>
          </label>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !user}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
