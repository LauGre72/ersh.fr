import { useState } from "react";
import PDFGenerator from "../PDFGenerator";

interface Participant {
  nom: string;
  fonction: string;
  email: string;
}

export default function EssFeuillePresenceForm() {
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
    participants: [] as Participant[],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { nom: "", fonction: "", email: "" }]
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  return (
    <PDFGenerator docType="essFeuillePresence">
      {(onSubmit) => (
        <div>
          <h2 className="text-xl font-bold mb-4">Feuille de Présence ESS</h2>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
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
              <label className="block text-sm font-medium mb-2">Participants</label>
              {formData.participants.map((p, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nom"
                    value={p.nom}
                    onChange={(e) => updateParticipant(index, "nom", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Fonction"
                    value={p.fonction}
                    onChange={(e) => updateParticipant(index, "fonction", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={p.email}
                    onChange={(e) => updateParticipant(index, "email", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeParticipant(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Ajouter participant
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