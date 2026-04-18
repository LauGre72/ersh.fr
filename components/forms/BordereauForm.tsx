import { useState } from "react";
import PDFGenerator from "../PDFGenerator";

export default function BordereauForm() {
  const [formData, setFormData] = useState({
    typedemande: "",
    dossier_num: "",
    nom: "",
    date_nais: "",
    demandes: "",
    CERFA: false,
    HAS_PI: false,
    PI: "",
    HAS_JD: false,
    JD: "",
    cert_med: "",
    HAS_GEVASco: false,
    date_geva_sco: "",
    HAS_LPI: false,
    NUM_LPI: "",
    type_reunion: "",
    HAS_PSY: false,
    PSY: "",
    HAS_PRO: false,
    PRO: "",
    HAS_AUTRE: false,
    AUTRE: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PDFGenerator docType="bordereau">
      {(onSubmit) => (
        <div>
          <h2 className="text-xl font-bold mb-4">Bordereau de dépôt MDPH</h2>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Type de demande</label>
                <select
                  value={formData.typedemande}
                  onChange={(e) => updateField("typedemande", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Sélectionner</option>
                  <option value="Première demande">Première demande</option>
                  <option value="Réexamen">Réexamen</option>
                  <option value="Autre">Autre</option>
                </select>
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
            <div>
              <label className="block text-sm font-medium">Demandes</label>
              <textarea
                value={formData.demandes}
                onChange={(e) => updateField("demandes", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.CERFA}
                onChange={(e) => updateField("CERFA", e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">CERFA</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.HAS_PI}
                onChange={(e) => updateField("HAS_PI", e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Pièces d'identité</label>
            </div>
            {formData.HAS_PI && (
              <input
                type="text"
                value={formData.PI}
                onChange={(e) => updateField("PI", e.target.value)}
                placeholder="Détails PI"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.HAS_JD}
                onChange={(e) => updateField("HAS_JD", e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm font-medium">Justificatifs de domicile</label>
            </div>
            {formData.HAS_JD && (
              <input
                type="text"
                value={formData.JD}
                onChange={(e) => updateField("JD", e.target.value)}
                placeholder="Détails JD"
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              />
            )}
            <div>
              <label className="block text-sm font-medium">Certificat médical</label>
              <textarea
                value={formData.cert_med}
                onChange={(e) => updateField("cert_med", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24"
              />
            </div>
            {/* Autres champs peuvent être ajoutés de manière similaire */}
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