import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "../firebase";

export default function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | "loading">("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null));
    return () => unsub();
  }, []);

  if (user === "loading") {
    return (
      <div className="grid place-items-center min-h-screen text-sm text-gray-600">
        Chargement…
      </div>
    );
  }
  if (!user) {
    return <SignIn />;
  }
  return <>{children}</>;
}

function SignIn() {
  const signIn = async () => {
    const { signInWithPopup } = await import("firebase/auth");
    const { googleProvider } = await import("../firebase");
    await signInWithPopup(auth, googleProvider);
  };
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="p-6 bg-white rounded-2xl shadow border w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-2">Portail ERSH</h1>
        <p className="text-sm text-gray-600 mb-4">Connectez-vous pour accéder à vos applications.</p>
        <button
          onClick={signIn}
          className="w-full rounded-xl bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
}
