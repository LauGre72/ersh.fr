import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Portail ERSH - Génération de Documents PDF</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormTile
          to="/bordereau"
          title="Bordereau MDPH"
          desc="Création de bordereau de dépôt MDPH"
          explain="Remplissez le formulaire pour générer votre bordereau PDF."
        />
        <FormTile
          to="/emargement"
          title="Feuille d'Émargement"
          desc="Feuille d'émargement pour ESS"
          explain="Saisissez les informations et générez la feuille d'émargement PDF."
        />
        <FormTile
          to="/ess-feuille-presence"
          title="Feuille de Présence ESS"
          desc="Feuille de présence pour réunion ESS"
          explain="Nouveau format pour les feuilles de présence ESS."
        />
        <FormTile
          to="/ess-note-geva"
          title="Note Complémentaire GEVA-SCo"
          desc="Note complémentaire au GEVA-SCo"
          explain="Générez une note complémentaire pour les réunions ESS."
        />
        <FormTile
          to="/ess-point-situation"
          title="Points de Situation ESS"
          desc="Points de situation pour réunion ESS"
          explain="Document pour les points de situation ESS."
        />
      </div>
    </main>
  );
}

function FormTile({ to, title, desc, explain }: { to: string; title: string; desc: string; explain: string }) {
  return (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{desc}</p>
      <p className="text-xs text-gray-500">{explain}</p>
    </Link>
  );
}

export default Home;