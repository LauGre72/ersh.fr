import { useState } from "react";
import PDFGenerator from "../PDFGenerator";

interface Participant {
  nom: string;
  fonction: string;
  email: string;
}

type ListField = "notifications_mdph" | "suivis_bilans";

const emptyParticipant: Participant = {
  nom: "",
  fonction: "",
  email: "",
};

const initialFormData = {
  annee_scolaire: "2025 - 2026",
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
  liste_emargement: [] as Participant[],
  date_geva_sco: "",
  notifications_mdph: [] as string[],
  suivis_bilans: [] as string[],
  point_situation_representants: "",
  point_situation_professionnels: "",
  conclusion_reunion: "",
};

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-gray-50 p-5">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function FormTextarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      <textarea
        {...props}
        className="min-h-28 w-full rounded-lg border-2 border-gray-200 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

export default function ReunionEssForm() {
  const [formData, setFormData] = useState(initialFormData);

  const updateField = <K extends keyof typeof initialFormData>(field: K, value: (typeof initialFormData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      liste_emargement: [...prev.liste_emargement, { ...emptyParticipant }],
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setFormData((prev) => ({
      ...prev,
      liste_emargement: prev.liste_emargement.map((participant, currentIndex) =>
        currentIndex === index ? { ...participant, [field]: value } : participant,
      ),
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      liste_emargement: prev.liste_emargement.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const addListItem = (field: ListField) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const updateListItem = (field: ListField, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, currentIndex) => (currentIndex === index ? value : item)),
    }));
  };

  const removeListItem = (field: ListField, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  return (
    <PDFGenerator
      docType="reunionESS"
      draftData={formData}
      onLoadDraft={(data) => setFormData((prev) => ({ ...prev, ...data }))}
    >
      {(onSubmit) => (
        <div>
          <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shadow-md">
            <h2 className="text-3xl font-bold text-white">Reunion ESS</h2>
            <p className="mt-2 text-white/90">
              Formulaire unique pour la feuille d'emargement, la note GEVA-Sco et les points de situation.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(formData);
            }}
            className="w-full space-y-6"
          >
            <FormSection title="Eleve">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput label="Prenom" value={formData.prenom} onChange={(event) => updateField("prenom", event.target.value)} />
                <FormInput label="Nom" value={formData.nom} onChange={(event) => updateField("nom", event.target.value)} />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(event) => updateField("date_nais", event.target.value)}
                />
                <FormInput label="Classe" value={formData.classe} onChange={(event) => updateField("classe", event.target.value)} />
              </div>
            </FormSection>

            <FormSection title="Dossier et etablissement">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Numero de dossier"
                  value={formData.dossier_num}
                  onChange={(event) => updateField("dossier_num", event.target.value)}
                />
                <FormInput
                  label="Etablissement"
                  value={formData.etablissement}
                  onChange={(event) => updateField("etablissement", event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection title="Reunion">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Annee scolaire"
                  value={formData.annee_scolaire}
                  onChange={(event) => updateField("annee_scolaire", event.target.value)}
                />
                <FormInput
                  label="Date ESS"
                  type="date"
                  value={formData.date_ess}
                  onChange={(event) => updateField("date_ess", event.target.value)}
                />
                <FormInput
                  label="Numero ESS"
                  value={formData.numero_ess}
                  onChange={(event) => updateField("numero_ess", event.target.value)}
                />
                <FormInput
                  label="Date du dernier GEVA-Sco"
                  type="date"
                  value={formData.date_geva_sco}
                  onChange={(event) => updateField("date_geva_sco", event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection title="Redacteur">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Nom du redacteur"
                  value={formData.redacteur}
                  onChange={(event) => updateField("redacteur", event.target.value)}
                />
                <FormInput
                  label="Fonction du redacteur"
                  value={formData.fonction_redacteur}
                  onChange={(event) => updateField("fonction_redacteur", event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection title={`Liste d'emargement (${formData.liste_emargement.length})`}>
              <div className="space-y-3">
                {formData.liste_emargement.length === 0 ? (
                  <p className="text-sm italic text-gray-500">Aucun participant ajoute.</p>
                ) : (
                  formData.liste_emargement.map((participant, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="font-semibold text-gray-900">Participant {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <FormInput label="Nom" value={participant.nom} onChange={(event) => updateParticipant(index, "nom", event.target.value)} />
                        <FormInput
                          label="Fonction"
                          value={participant.fonction}
                          onChange={(event) => updateParticipant(index, "fonction", event.target.value)}
                        />
                        <FormInput
                          label="Email"
                          type="email"
                          value={participant.email}
                          onChange={(event) => updateParticipant(index, "email", event.target.value)}
                        />
                      </div>
                    </div>
                  ))
                )}
                <button
                  type="button"
                  onClick={addParticipant}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Ajouter un participant
                </button>
              </div>
            </FormSection>

            <FormSection title="Notifications et suivis">
              <DynamicList
                label="Notifications MDPH"
                values={formData.notifications_mdph}
                onAdd={() => addListItem("notifications_mdph")}
                onUpdate={(index, value) => updateListItem("notifications_mdph", index, value)}
                onRemove={(index) => removeListItem("notifications_mdph", index)}
              />
              <div className="mt-5">
                <DynamicList
                  label="Suivis en cours et bilans existants"
                  values={formData.suivis_bilans}
                  onAdd={() => addListItem("suivis_bilans")}
                  onUpdate={(index, value) => updateListItem("suivis_bilans", index, value)}
                  onRemove={(index) => removeListItem("suivis_bilans", index)}
                />
              </div>
            </FormSection>

            <FormSection title="Points de situation">
              <div className="space-y-4">
                <FormTextarea
                  label="Point de situation des representants"
                  value={formData.point_situation_representants}
                  onChange={(event) => updateField("point_situation_representants", event.target.value)}
                />
                <FormTextarea
                  label="Point de situation des professionnels"
                  value={formData.point_situation_professionnels}
                  onChange={(event) => updateField("point_situation_professionnels", event.target.value)}
                />
                <FormTextarea
                  label="Conclusion de la reunion"
                  value={formData.conclusion_reunion}
                  onChange={(event) => updateField("conclusion_reunion", event.target.value)}
                />
              </div>
            </FormSection>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            >
              Generer le PDF
            </button>
          </form>
        </div>
      )}
    </PDFGenerator>
  );
}

function DynamicList({
  label,
  values,
  onAdd,
  onUpdate,
  onRemove,
}: {
  label: string;
  values: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-700">{label}</div>
      <div className="space-y-2">
        {values.length === 0 ? (
          <p className="text-sm italic text-gray-500">Aucune entree ajoutee.</p>
        ) : (
          values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(event) => onUpdate(index, event.target.value)}
                className="min-w-0 flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        Ajouter
      </button>
    </div>
  );
}
