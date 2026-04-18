import { useState } from "react";
import PDFGenerator from "../PDFGenerator";

export default function EssPointSituationForm() {
  const [formData, setFormData] = useState({
    year_scolaire: "2025-2026",
    date_ess: "",
    numero_ess: "",
    prenom: "",
    nom: "",
    date_nais: "",
    classe: "",
    dossier_num: "",
    etablissement: "",
    redacteur: "",
    fonction_redacteur: "",
    date_dernier_geva: "",
    point_situation_representants: "",
    point_situation_professionnel: "",
    conclusion: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PDFGenerator
      docType="essPointSituation"
      draftData={formData}
      onLoadDraft={(data) => setFormData(prev => ({ ...prev, ...data }))}
    >
      {(onSubmit) => (
        <div>
          <div className="mb-8 rounded-lg bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white shadow-md">
            <h2 className="text-3xl font-bold text-white">Points de Situation ESS</h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="w-full space-y-6">
            {/* Champs de base similaires */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Année scolaire</label>
                <input
                  type="text"
                  value={formData.year_scolaire}
                  onChange={(e) => updateField("year_scolaire", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date ESS</label>
                <input
                  type="date"
                  value={formData.date_ess}
                  onChange={(e) => updateField("date_ess", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Numéro ESS</label>
                <input
                  type="text"
                  value={formData.numero_ess}
                  onChange={(e) => updateField("numero_ess", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => updateField("prenom", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date de naissance</label>
                <input
                  type="date"
                  value={formData.date_nais}
                  onChange={(e) => updateField("date_nais", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Classe</label>
                <input
                  type="text"
                  value={formData.classe}
                  onChange={(e) => updateField("classe", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Numéro de dossier</label>
                <input
                  type="text"
                  value={formData.dossier_num}
                  onChange={(e) => updateField("dossier_num", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Établissement</label>
              <input
                type="text"
                value={formData.etablissement}
                onChange={(e) => updateField("etablissement", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Rédacteur</label>
                <input
                  type="text"
                  value={formData.redacteur}
                  onChange={(e) => updateField("redacteur", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Fonction du rédacteur</label>
                <input
                  type="text"
                  value={formData.fonction_redacteur}
                  onChange={(e) => updateField("fonction_redacteur", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Date dernier GEVA</label>
              <input
                type="date"
                value={formData.date_dernier_geva}
                onChange={(e) => updateField("date_dernier_geva", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Point de situation représentants</label>
              <textarea
                value={formData.point_situation_representants}
                onChange={(e) => updateField("point_situation_representants", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
                placeholder="Description du point de vue des représentants..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Point de situation professionnel</label>
              <textarea
                value={formData.point_situation_professionnel}
                onChange={(e) => updateField("point_situation_professionnel", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
                placeholder="Description du point de vue professionnel..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Conclusion</label>
              <textarea
                value={formData.conclusion}
                onChange={(e) => updateField("conclusion", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
                placeholder="Conclusion et recommandations..."
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Générer le PDF
            </button>
          </form>
        </div>
      )}
    </PDFGenerator>
  );
}
