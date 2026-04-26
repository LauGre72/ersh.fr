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
      <div className="w-full max-w-sm rounded-lg border border-[#D6E2EA] bg-white p-6 shadow">
        <h1 className="mb-2 text-lg font-semibold text-[#153A5B]">ERSH.fr</h1>
        <p className="mb-4 text-sm text-gray-600">Connectez-vous pour accéder au Kanban et aux documents.</p>
        <button
          onClick={signIn}
          className="w-full rounded-lg bg-[#2A6F97] px-4 py-2 font-semibold text-white hover:bg-[#235D80]"
        >
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
}
