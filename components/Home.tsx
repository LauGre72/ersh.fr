import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Générateur de Documents PDF
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez et téléchargez facilement vos documents PDF pour les réunions ESS et demandes MDPH
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FormTile
            to="/bordereau"
            icon="📋"
            title="Bordereau MDPH"
            desc="Bordereau de dépôt"
            explain="Remplissez et générez votre bordereau de dépôt MDPH en PDF."
            color="from-blue-500 to-blue-600"
          />
          <FormTile
            to="/emargement"
            icon="✍️"
            title="Feuille d'Émargement"
            desc="Feuille de présence"
            explain="Créez la feuille d'émargement pour vos réunions ESS."
            color="from-cyan-500 to-cyan-600"
          />
          <FormTile
            to="/ess-feuille-presence"
            icon="📝"
            title="Feuille de Présence ESS"
            desc="Nouveau format ESS"
            explain="Générez la feuille de présence au format ESS moderne."
            color="from-teal-500 to-teal-600"
          />
          <FormTile
            to="/ess-note-geva"
            icon="📄"
            title="Note Complémentaire GEVA"
            desc="Complément GEVA-SCo"
            explain="Document complémentaire au GEVA-SCo pour les ESS."
            color="from-green-500 to-green-600"
          />
          <FormTile
            to="/ess-point-situation"
            icon="🎯"
            title="Points de Situation"
            desc="Points de situation ESS"
            explain="Documentez les points de situation de la réunion ESS."
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white font-bold">1</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Remplissez</h3>
                <p className="text-gray-600 text-sm">Complétez le formulaire avec les informations requises</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white font-bold">2</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Générez</h3>
                <p className="text-gray-600 text-sm">Cliquez sur "Générer le PDF" pour créer le document</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-600 text-white font-bold">3</div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Téléchargez</h3>
                <p className="text-gray-600 text-sm">Téléchargez votre document PDF prêt à l'emploi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FormTile({ 
  to, 
  icon,
  title, 
  desc, 
  explain,
  color
}: { 
  to: string; 
  icon: string;
  title: string; 
  desc: string; 
  explain: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
    >
      {/* Background gradient overlay */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`}></div>
      
      <div className="p-6">
        {/* Icon */}
        <div className="text-5xl mb-4">{icon}</div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-sm font-medium text-gray-500 mb-3">{desc}</p>
        
        {/* Explanation */}
        <p className="text-sm text-gray-600 line-clamp-2">{explain}</p>
        
        {/* Arrow indicator */}
        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition">
          Accéder →
        </div>
      </div>
    </Link>
  );
}

export default Home;