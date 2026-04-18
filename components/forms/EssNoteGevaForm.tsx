import { useState } from "react";
import PDFGenerator from "../PDFGenerator";

export default function EssNoteGevaForm() {
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
    notifications_mdph: [] as string[],
    suivis_bilancs: [] as string[],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: "notifications_mdph" | "suivis_bilancs") => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const updateItem = (field: "notifications_mdph" | "suivis_bilancs", index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeItem = (field: "notifications_mdph" | "suivis_bilancs", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <PDFGenerator docType="essNoteGeva">
      {(onSubmit) => (
        <div>
          <h2 className="text-xl font-bold mb-4">Note Complémentaire GEVA-SCo</h2>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            {/* Champs similaires à EssFeuillePresence */}
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
            {/* Autres champs de base */}
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
              <label className="block text-sm font-medium mb-2">Notifications MDPH</label>
              {formData.notifications_mdph.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem("notifications_mdph", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("notifications_mdph", index)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("notifications_mdph")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter notification
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Suivis et bilans</label>
              {formData.suivis_bilancs.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem("suivis_bilancs", index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem("suivis_bilancs", index)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("suivis_bilancs")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter suivi/bilan
              </button>
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