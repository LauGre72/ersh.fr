import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Générateur de documents PDF
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Sélectionnez le formulaire adapté, complétez les informations utiles, puis générez le PDF correspondant.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormTile
            to="/bordereau"
            icon="📋"
            title="Bordereau MDPH"
            desc="Dépôt du dossier"
            explain="Préparez le bordereau qui accompagne les pièces transmises à la MDPH."
            color="from-blue-600 to-blue-800"
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
            color="from-cyan-600 to-cyan-800"
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
            color="from-emerald-600 to-emerald-800"
            iconColor="bg-emerald-600 text-white"
            actionColor="text-emerald-700"
            titleHoverColor="group-hover:text-emerald-700"
          />
        </div>

        <div className="rounded-xl border-l-4 border-blue-600 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Comment ça marche ?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Step number="1" title="Choisissez" text="Ouvrez le formulaire correspondant au document dont vous avez besoin." />
            <Step number="2" title="Complétez" text="Renseignez les champs nécessaires et ajoutez les participants ou pièces utiles." />
            <Step number="3" title="Générez" text="Créez le PDF, puis téléchargez le document finalisé." />
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
  icon: string;
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
        <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg text-2xl ${iconColor}`}>
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

export default Home;
