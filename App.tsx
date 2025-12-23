import Header from "./components/Header";
import AppTile from "./components/AppTile";

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppTile
          href="https://bordereau.ersh.fr"
          title="Bordereau"
          desc="Aide à la création de bordereau MDPH"
          explain="Créer au format PDF, imprimer vos bordereaux de dépôt MDPH."
        />
        <AppTile
          href="https://emargement.ersh.fr"
          title="Émargement"
          desc="Aide à la création de feuille d’emargement ESS"
          explain="Saisisser les informations de l’élève et des participants, puis générez automatiquement votre feuille d’émargement au format PDF"
        />			
		<AppTile
          href="https://kanban.ersh.fr"
          title="Kanban"
          desc="Kanban"
          explain="Organisation et suivi des tâches."
        />

      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Home />
      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-gray-500">
        <div className="border-t pt-4">
          Besoin d’aide ? Chaque carte contient une brève explication pour vous orienter.
        </div>
      </footer>
    </div>
  );
}
