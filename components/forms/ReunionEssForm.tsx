import { useState } from "react";
import PDFGenerator from "../PDFGenerator";
import {
  AddButton,
  DeleteIconButton,
  FormHeader,
  FormInput as BaseFormInput,
  FormSelect as BaseFormSelect,
  FormSection as BaseFormSection,
  FormTextarea as BaseFormTextarea,
  SubmitButton,
} from "./FormControls";

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
  nom: "",
  date_nais: "",
  dossier_num: "",
  etablissement: "",
  chef_etab: "",
  niveau: "",
  type_geva_sco: "",
  date_geva_sco: "",
  date_ess: "",
  numero_ess: "",
  participants: [] as Participant[],
  notifications_mdph: [] as string[],
  suivis_bilans: [] as string[],
  point_situation_representants: "",
  point_situation_professionnels: "",
  conclusion_reunion: "",
};

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <BaseFormSection title={title} theme="emerald">{children}</BaseFormSection>;
}

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <BaseFormInput label={label} theme="emerald" {...props} />;
}

function FormSelect({
  label,
  options,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <BaseFormSelect label={label} options={options} theme="emerald" {...props} />;
}

function FormTextarea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <BaseFormTextarea label={label} theme="emerald" className="min-h-28" {...props} />;
}

export default function ReunionEssForm() {
  const [formData, setFormData] = useState(initialFormData);

  const updateField = <K extends keyof typeof initialFormData>(field: K, value: (typeof initialFormData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, { ...emptyParticipant }],
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((participant, currentIndex) =>
        currentIndex === index ? { ...participant, [field]: value } : participant,
      ),
    }));
  };

  const removeParticipant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, currentIndex) => currentIndex !== index),
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

  const emptyToNull = (value: string) => value.trim() || null;
  const cleanStringList = (values: string[]) => values.map((value) => value.trim()).filter(Boolean);

  const buildPayload = () => ({
    nom: emptyToNull(formData.nom),
    date_nais: emptyToNull(formData.date_nais),
    dossier_num: emptyToNull(formData.dossier_num),
    etablissement: emptyToNull(formData.etablissement),
    chef_etab: emptyToNull(formData.chef_etab),
    niveau: emptyToNull(formData.niveau),
    type_geva_sco: emptyToNull(formData.type_geva_sco),
    date_geva_sco: emptyToNull(formData.date_geva_sco),
    date_ess: emptyToNull(formData.date_ess),
    numero_ess: emptyToNull(formData.numero_ess),
    participants: formData.participants
      .map((participant) => ({
        nom: participant.nom.trim(),
        fonction: participant.fonction.trim(),
        email: participant.email.trim(),
      }))
      .filter((participant) => participant.nom || participant.fonction || participant.email),
    notifications_mdph: cleanStringList(formData.notifications_mdph),
    suivis_bilans: cleanStringList(formData.suivis_bilans),
    point_situation_representants: emptyToNull(formData.point_situation_representants),
    point_situation_professionnels: emptyToNull(formData.point_situation_professionnels),
    conclusion_reunion: emptyToNull(formData.conclusion_reunion),
  });

  return (
    <PDFGenerator
      docType="reunionESS"
      draftData={formData}
      onLoadDraft={(data) => setFormData((prev) => ({ ...prev, ...data }))}
    >
      {(onSubmit) => (
        <div>
          <FormHeader
            title="Réunion ESS"
            description="Formulaire unique pour la feuille d'émargement, la note GEVA-Sco et les points de situation."
            theme="emerald"
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(buildPayload());
            }}
            className="w-full space-y-6"
          >
            <FormSection title="Élève">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Nom et prénom"
                  value={formData.nom}
                  onChange={(event) => updateField("nom", event.target.value)}
                  placeholder="Ex. Nora Dupont"
                />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(event) => updateField("date_nais", event.target.value)}
                />
                <FormInput
                  label="Niveau scolaire"
                  value={formData.niveau}
                  onChange={(event) => updateField("niveau", event.target.value)}
                  placeholder="Ex. 6e, 3e, 2nde GT"
                />
              </div>
            </FormSection>

            <FormSection title="Dossier et établissement">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="N° de dossier MDPH"
                  value={formData.dossier_num}
                  onChange={(event) => updateField("dossier_num", event.target.value)}
                  placeholder="Ex. 72-2025-00123"
                />
                <FormInput
                  label="Établissement"
                  value={formData.etablissement}
                  onChange={(event) => updateField("etablissement", event.target.value)}
                  placeholder="Ex. Collège Jean Monnet"
                />
                <FormInput
                  label="Chef d'établissement"
                  value={formData.chef_etab}
                  onChange={(event) => updateField("chef_etab", event.target.value)}
                  placeholder="Ex. Mme/M. Dupont"
                />
              </div>
            </FormSection>

            <FormSection title="Réunion ESS">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Date de l'ESS"
                  type="date"
                  value={formData.date_ess}
                  onChange={(event) => updateField("date_ess", event.target.value)}
                />
                <FormInput
                  label="N° de l'ESS"
                  value={formData.numero_ess}
                  onChange={(event) => updateField("numero_ess", event.target.value)}
                />
                <FormSelect
                  label="Type de dernier GEVA-Sco"
                  value={formData.type_geva_sco}
                  onChange={(event) => updateField("type_geva_sco", event.target.value)}
                  options={[
                    { value: "", label: "Sélectionner..." },
                    { value: "Première demande", label: "Première demande" },
                    { value: "Réexamen", label: "Réexamen" },
                    { value: "Équipe éducative", label: "Équipe éducative" },
                    { value: "ESS", label: "ESS" },
                  ]}
                />
                <FormInput
                  label="Date du dernier GEVA-Sco"
                  type="date"
                  value={formData.date_geva_sco}
                  onChange={(event) => updateField("date_geva_sco", event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection title={`Participants (${formData.participants.length})`}>
              <div className="space-y-3">
                {formData.participants.length === 0 ? (
                  <p className="text-sm italic text-gray-500">Aucun participant ajouté.</p>
                ) : (
                  formData.participants.map((participant, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="font-semibold text-gray-900">Participant {index + 1}</span>
                        <DeleteIconButton
                          label={`Supprimer le participant ${index + 1}`}
                          onClick={() => removeParticipant(index)}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <FormInput
                          label="Nom"
                          value={participant.nom}
                          onChange={(event) => updateParticipant(index, "nom", event.target.value)}
                        />
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
                <AddButton theme="emerald" onClick={addParticipant}>Ajouter un participant</AddButton>
              </div>
            </FormSection>

            <FormSection title="Notifications et suivis">
              <DynamicList
                label="Notifications MDPH en cours"
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
                  label="Point de situation - élève et parents"
                  value={formData.point_situation_representants}
                  onChange={(event) => updateField("point_situation_representants", event.target.value)}
                />
                <FormTextarea
                  label="Point de situation - professionnels"
                  value={formData.point_situation_professionnels}
                  onChange={(event) => updateField("point_situation_professionnels", event.target.value)}
                />
                <FormTextarea
                  label="Conclusion de la réunion"
                  value={formData.conclusion_reunion}
                  onChange={(event) => updateField("conclusion_reunion", event.target.value)}
                />
              </div>
            </FormSection>

            <SubmitButton theme="emerald" />
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
          <p className="text-sm italic text-gray-500">Aucune entrée ajoutée.</p>
        ) : (
          values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(event) => onUpdate(index, event.target.value)}
                className="min-w-0 flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <DeleteIconButton label={`Supprimer l'entrée ${index + 1}`} onClick={() => onRemove(index)} />
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
