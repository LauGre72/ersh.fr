import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-orange-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-emerald-500 via-sky-500 to-orange-500 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Portail ERSH
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Accédez aux outils de suivi, de gestion et de génération de documents.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormTile
            to="/fil-conducteur"
            icon="🧭"
            title="Fil Conducteur"
            desc="Suivi Kanban des dossiers"
            explain="Pilotez les fiches élèves par établissement, état de dossier, alerte et recherche rapide."
            color="from-emerald-400 via-sky-400 to-orange-400"
            iconColor="bg-white text-slate-900 ring-1 ring-sky-100"
            actionColor="text-sky-800"
            titleHoverColor="group-hover:text-sky-800"
            featured
          />
          <FormTile
            to="/bordereau"
            icon="📋"
            title="Bordereau MDPH"
            desc="Dépôt du dossier"
            explain="Préparez le bordereau qui accompagne les pièces transmises à la MDPH."
            color="from-blue-500 to-blue-700"
            iconColor="bg-blue-600 text-white"
            actionColor="text-blue-700"
            titleHoverColor="group-hover:text-blue-700"
          />
          <FormTile
            to="/emargement"
            icon="✍️"
            title="Feuille d’émargement"
            desc="Présence à l’ESS annuelle"
            explain="Générez la feuille de présence à faire signer lors de l’ESS annuelle."
            color="from-cyan-500 to-cyan-700"
            iconColor="bg-cyan-600 text-white"
            actionColor="text-cyan-700"
            titleHoverColor="group-hover:text-cyan-700"
          />
          <FormTile
            to="/reunion-ess"
            icon="🗂️"
            title="Compte rendu ESS"
            desc="ESS de suivi"
            explain="Rédigez le compte rendu de l’ESS de suivi avec les notifications, les bilans et les points de situation."
            color="from-emerald-500 to-emerald-700"
            iconColor="bg-emerald-600 text-white"
            actionColor="text-emerald-700"
            titleHoverColor="group-hover:text-emerald-700"
          />
        </div>

        <div className="rounded-xl border-l-4 border-sky-500 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Comment ça marche ?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Step number="1" title="Choisissez" text="Ouvrez l’outil correspondant à votre besoin." />
            <Step number="2" title="Complétez" text="Renseignez les champs nécessaires et ajoutez les informations utiles." />
            <Step number="3" title="Finalisez" text="Suivez vos dossiers ou générez le document finalisé." />
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
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 font-bold text-white">
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
  logo,
  title,
  desc,
  explain,
  color,
  iconColor,
  actionColor,
  titleHoverColor,
  featured = false,
}: {
  to: string;
  icon?: string;
  logo?: string;
  title: string;
  desc: string;
  explain: string;
  color: string;
  iconColor: string;
  actionColor: string;
  titleHoverColor: string;
  featured?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-xl border bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured ? "border-sky-200 ring-1 ring-sky-100" : "border-gray-100"
      }`}
    >
      <div className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${color}`} />

      <div className="p-6">
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-2xl ${iconColor}`}>
          {logo ? <img src={logo} alt="" className="h-12 w-12 object-contain" /> : icon}
        </div>
        <h3 className={`mb-1 text-lg font-bold text-gray-900 transition ${titleHoverColor}`}>{title}</h3>
        <p className="mb-3 text-sm font-medium text-gray-500">{desc}</p>
        <p className="line-clamp-2 text-sm text-gray-600">{explain}</p>
        <div className={`mt-4 flex items-center text-sm font-medium transition group-hover:translate-x-1 ${actionColor}`}>
          Accéder -&gt;
        </div>
      </div>
    </Link>
  );
}

export default Home;
