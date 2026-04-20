import { Link } from "react-router-dom";
import type { ReactNode } from "react";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Generateur de Documents PDF
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Creez et telechargez facilement vos documents PDF pour les reunions ESS et demandes MDPH.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormTile
            to="/bordereau"
            icon={<ClipboardIcon />}
            title="Bordereau MDPH"
            desc="Bordereau de depot"
            explain="Remplissez et generez votre bordereau de depot MDPH en PDF."
            color="from-blue-600 to-blue-800"
            iconColor="bg-blue-600 text-white"
            actionColor="text-blue-700"
            titleHoverColor="group-hover:text-blue-700"
          />
          <FormTile
            to="/emargement"
            icon={<SignatureIcon />}
            title="Feuille d'emargement"
            desc="Feuille de presence"
            explain="Creez la feuille d'emargement pour vos reunions ESS."
            color="from-cyan-600 to-cyan-800"
            iconColor="bg-cyan-600 text-white"
            actionColor="text-cyan-700"
            titleHoverColor="group-hover:text-cyan-700"
          />
          <FormTile
            to="/reunion-ess"
            icon={<UsersDocumentIcon />}
            title="Reunion ESS"
            desc="Formulaire ESS complet"
            explain="Regroupez emargement, note GEVA-Sco et points de situation dans un seul PDF."
            color="from-blue-600 to-blue-800"
            iconColor="bg-blue-700 text-white"
            actionColor="text-blue-700"
            titleHoverColor="group-hover:text-blue-700"
          />
        </div>

        <div className="rounded-xl border-l-4 border-blue-600 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Comment ca marche ?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Step number="1" title="Remplissez" text="Completez le formulaire avec les informations requises." />
            <Step number="2" title="Generez" text="Cliquez sur Generer le PDF pour creer le document." />
            <Step number="3" title="Telechargez" text="Telechargez votre document PDF pret a l'emploi." />
          </div>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          {number}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function FormTile({
  to,
  icon,
  title,
  desc,
  explain,
  color,
  iconColor,
  actionColor,
  titleHoverColor,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  desc: string;
  explain: string;
  color: string;
  iconColor: string;
  actionColor: string;
  titleHoverColor: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${color}`} />

      <div className="p-6">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${iconColor}`}>
          {icon}
        </div>
        <h3 className={`mb-1 text-lg font-bold text-gray-900 transition ${titleHoverColor}`}>{title}</h3>
        <p className="mb-3 text-sm font-medium text-gray-500">{desc}</p>
        <p className="line-clamp-2 text-sm text-gray-600">{explain}</p>
        <div className={`mt-4 flex items-center text-sm font-medium transition group-hover:translate-x-1 ${actionColor}`}>
          Acceder -&gt;
        </div>
      </div>
    </Link>
  );
}

function ClipboardIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 4h6" />
      <path d="M9 4a3 3 0 0 0 6 0" />
      <path d="M8 6H6.5A2.5 2.5 0 0 0 4 8.5v10A2.5 2.5 0 0 0 6.5 21h11a2.5 2.5 0 0 0 2.5-2.5v-10A2.5 2.5 0 0 0 17.5 6H16" />
      <path d="M8 12h8" />
      <path d="M8 16h6" />
    </svg>
  );
}

function SignatureIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 20h18" />
      <path d="M4 16c2.5 0 2.5-8 5-8 3 0 1 8 4 8 1.4 0 2.1-1.7 3-3" />
      <path d="m15 11 4-4" />
      <path d="m18 4 2 2" />
    </svg>
  );
}

function UsersDocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3h4l3 3v12a3 3 0 0 1-3 3h-3" />
      <path d="M18 3v4h4" />
      <circle cx="8" cy="9" r="3" />
      <path d="M3 20a5 5 0 0 1 10 0" />
      <path d="M14 11h4" />
      <path d="M15 15h3" />
    </svg>
  );
}

export default Home;
