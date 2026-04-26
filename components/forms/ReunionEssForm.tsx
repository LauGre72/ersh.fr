import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useLocation } from "react-router-dom";
import PDFGenerator from "../PDFGenerator";
import { auth } from "../../firebase";
import { getProfile } from "../api";
import { getTodayDateInputValue } from "../dateLimits";
import { filConducteurApi, saveFicheEss } from "../fil-conducteur/api";
import { getCurrentSchoolYear } from "./schoolYear";
import {
  AddButton,
  DeleteIconButton,
  FormCheckbox,
  FormHeader,
  FormInput as BaseFormInput,
  FormSelect as BaseFormSelect,
  FormSection as BaseFormSection,
  FormTextarea as BaseFormTextarea,
  MoveButton,
  ResetButton,
  SubmitButton,
} from "./FormControls";

interface Participant {
  nom: string;
  fonction: string;
  email: string;
  noEmail?: boolean;
}

type ListField = "notifications_mdph" | "suivis_bilans";

const emptyParticipant: Participant = {
  nom: "",
  fonction: "",
  email: "",
  noEmail: false,
};

const DEFAULT_USER_FUNCTION = "Enseignante référente";

const NO_MAIL_VALUE = "NO_MAIL";

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
  annee_scolaire: getCurrentSchoolYear(),
  numero_ess: "",
  participants: [] as Participant[],
  situation_anterieure: "",
  notifications_mdph: [] as string[],
  suivis_bilans: [] as string[],
  point_situation_representants: "",
  point_situation_professionnels: "",
  conclusion_reunion: "",
};

function getRoutePrefill(state: unknown): Partial<typeof initialFormData> {
  const prefill = (state as { prefill?: Record<string, string> } | null)?.prefill;
  if (!prefill) return {};

  return {
    nom: prefill.nom || "",
    date_nais: prefill.date_nais || "",
    dossier_num: prefill.dossier_num || "",
    etablissement: prefill.etablissement || "",
    chef_etab: prefill.chef_etab || "",
    niveau: prefill.niveau || "",
    type_geva_sco: prefill.type_geva_sco || "",
  };
}

function getRouteFicheId(state: unknown) {
  const value = (state as { prefill?: Record<string, string> } | null)?.prefill?.fiche_id;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeParticipant(participant: Partial<Participant>): Participant {
  const email = participant.email || "";
  const noEmail = participant.noEmail || email === NO_MAIL_VALUE;

  return {
    nom: participant.nom || "",
    fonction: participant.fonction || "",
    email: noEmail ? "" : email,
    noEmail,
  };
}

function participantForApi(participant: Participant) {
  return {
    nom: participant.nom.trim(),
    fonction: participant.fonction.trim(),
    email: participant.noEmail ? NO_MAIL_VALUE : participant.email.trim(),
  };
}

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
  const location = useLocation();
  const ficheId = getRouteFicheId(location.state);
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    ...getRoutePrefill(location.state),
  }));
  const [defaultParticipant, setDefaultParticipant] = useState<Participant | null>(null);
  const [essSaveError, setEssSaveError] = useState("");
  const today = getTodayDateInputValue();

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        const profile = await getProfile(token);
        if (cancelled) return;

        const defaultParticipant = {
          nom: profile.full_name || user.displayName || "",
          fonction: DEFAULT_USER_FUNCTION,
          email: profile.email || user.email || "",
          noEmail: false,
        };
        setDefaultParticipant(defaultParticipant);

        setFormData((prev) => {
          if (prev.participants.length > 0) return prev;
          if (!defaultParticipant.nom && !defaultParticipant.fonction && !defaultParticipant.email) return prev;
          return { ...prev, participants: [defaultParticipant] };
        });
      } catch {
        if (cancelled) return;
        const fallbackParticipant = {
          nom: user.displayName || "",
          fonction: DEFAULT_USER_FUNCTION,
          email: user.email || "",
          noEmail: false,
        };
        setDefaultParticipant(fallbackParticipant);

        setFormData((prev) => {
          if (prev.participants.length > 0 || !user.email) return prev;
          return {
            ...prev,
            participants: [fallbackParticipant],
          };
        });
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const updateField = <K extends keyof typeof initialFormData>(field: K, value: (typeof initialFormData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      annee_scolaire: getCurrentSchoolYear(),
      participants: defaultParticipant ? [defaultParticipant] : [],
      notifications_mdph: [],
      suivis_bilans: [],
    });
  };

  const addParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, { ...emptyParticipant }],
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string | boolean) => {
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

  const moveParticipant = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= formData.participants.length) return;
    const participants = [...formData.participants];
    [participants[from], participants[to]] = [participants[to], participants[from]];
    setFormData((prev) => ({ ...prev, participants }));
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

  const cleanString = (value: string) => value.trim();
  const cleanStringList = (values: string[]) => values.map((value) => value.trim()).filter(Boolean);

  const buildPayload = () => ({
    nom: cleanString(formData.nom),
    date_nais: cleanString(formData.date_nais),
    dossier_num: cleanString(formData.dossier_num),
    etablissement: cleanString(formData.etablissement),
    chef_etab: cleanString(formData.chef_etab),
    niveau: cleanString(formData.niveau),
    type_geva_sco: cleanString(formData.type_geva_sco),
    date_geva_sco: cleanString(formData.date_geva_sco),
    date_ess: cleanString(formData.date_ess),
    annee_scolaire: cleanString(formData.annee_scolaire),
    numero_ess: cleanString(formData.numero_ess),
    participants: formData.participants
      .map(participantForApi)
      .filter((participant) => participant.nom || participant.fonction || participant.email),
    situation_anterieure: cleanString(formData.situation_anterieure),
    notifications_mdph: cleanStringList(formData.notifications_mdph),
    suivis_bilans: cleanStringList(formData.suivis_bilans),
    point_situation_representants: cleanString(formData.point_situation_representants),
    point_situation_professionnels: cleanString(formData.point_situation_professionnels),
    conclusion_reunion: cleanString(formData.conclusion_reunion),
  });

  const submitWithEssTracking = async (onSubmit: (data: unknown) => void) => {
    const payload = buildPayload();
    setEssSaveError("");

    if (ficheId) {
      const numeroSuivi = Number(payload.numero_ess);
      if (!payload.date_ess) {
        setEssSaveError("La date de l'ESS de suivi est obligatoire pour l'enregistrer dans la fiche eleve.");
        return;
      }
      if (!Number.isInteger(numeroSuivi) || numeroSuivi < 1) {
        setEssSaveError("Le numero de l'ESS de suivi doit etre un entier superieur ou egal a 1.");
        return;
      }

      try {
        await saveFicheEss(ficheId, {
          date_ess: payload.date_ess,
          type_ess: "suivi",
          numero_suivi: numeroSuivi,
        });
        await filConducteurApi.createDocument(ficheId, {
          type_document: "crEssSuivi",
          date_generation: new Date().toISOString(),
          date_reference: payload.date_ess,
        });
      } catch (err) {
        setEssSaveError(err instanceof Error ? err.message : "Erreur lors de l'enregistrement de l'ESS.");
        return;
      }
    }

    onSubmit(payload);
  };

  return (
    <PDFGenerator
      docType="crEssSuivi"
      draftData={formData}
      onLoadDraft={(data) =>
        setFormData((prev) => ({
          ...prev,
          ...data,
          participants: data.participants?.map(normalizeParticipant) || prev.participants,
        }))
      }
    >
      {(onSubmit) => (
        <div>
          <FormHeader
            title="🗂️ Compte rendu d’ESS de suivi"
            description="Complétez les informations de la réunion de suivi, les notifications en cours et les points de situation."
            theme="emerald"
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submitWithEssTracking(onSubmit);
            }}
            className="w-full space-y-6"
          >
            {essSaveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                {essSaveError}
              </div>
            )}
            <FormSection title="📅 Organisation">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Date de l'ESS de suivi"
                  type="date"
                  value={formData.date_ess}
                  onChange={(event) => updateField("date_ess", event.target.value)}
                />
                <FormInput
                  label="Année scolaire"
                  value={formData.annee_scolaire}
                  onChange={(event) => updateField("annee_scolaire", event.target.value)}
                  placeholder="Ex. 2025-2026"
                />
                <FormInput
                  label="N° de l'ESS de suivi"
                  value={formData.numero_ess}
                  onChange={(event) => updateField("numero_ess", event.target.value)}
                />
              </div>
            </FormSection>

            <FormSection title="👤 Identité de l'élève">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Nom et prénom"
                  value={formData.nom}
                  onChange={(event) => updateField("nom", event.target.value)}
                  placeholder="Ex. Nora Dupont"
                  required
                />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(event) => updateField("date_nais", event.target.value)}
                  max={today}
                />
                <FormInput
                  label="Niveau scolaire"
                  value={formData.niveau}
                  onChange={(event) => updateField("niveau", event.target.value)}
                  placeholder="Ex. 6e, 3e, 2nde GT"
                />
                <FormInput
                  label="N° de dossier MDPH"
                  value={formData.dossier_num}
                  onChange={(event) => updateField("dossier_num", event.target.value)}
                  placeholder="Ex. 72-2025-00123"
                />
              </div>
            </FormSection>

            <FormSection title="🏫 Établissement">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Etablissement"
                  value={formData.etablissement}
                  onChange={(event) => updateField("etablissement", event.target.value)}
                  placeholder="Ex. Collège Jean Monnet"
                />
                <FormInput
                  label="Chef d'etablissement"
                  value={formData.chef_etab}
                  onChange={(event) => updateField("chef_etab", event.target.value)}
                  placeholder="Ex. Mme/M. Dupont"
                />
              </div>
            </FormSection>

            <FormSection title="📊 GEVA-Sco">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormSelect
                  label="Type de dernier GEVA-Sco"
                  value={formData.type_geva_sco}
                  onChange={(event) => updateField("type_geva_sco", event.target.value)}
                  options={[
                    { value: "", label: "Sélectionner..." },
                    { value: "Première demande", label: "Première demande" },
                    { value: "Réexamen", label: "Réexamen" },
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

            <FormSection title={`👥 Participants (${formData.participants.length})`}>
              <div className="space-y-3">
                {formData.participants.length === 0 ? (
                  <p className="text-sm italic text-gray-500">Aucun participant ajouté.</p>
                ) : (
                  formData.participants.map((participant, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="font-semibold text-gray-900">Participant {index + 1}</span>
                        <div className="flex gap-2">
                          <MoveButton
                            direction="up"
                            onClick={() => moveParticipant(index, "up")}
                            disabled={index === 0}
                          />
                          <MoveButton
                            direction="down"
                            onClick={() => moveParticipant(index, "down")}
                            disabled={index === formData.participants.length - 1}
                          />
                          <DeleteIconButton
                            label={`Supprimer le participant ${index + 1}`}
                            onClick={() => removeParticipant(index)}
                          />
                        </div>
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
                          disabled={participant.noEmail}
                          onChange={(event) => updateParticipant(index, "email", event.target.value)}
                          className="disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div className="mt-3">
                        <FormCheckbox
                          theme="emerald"
                          checked={Boolean(participant.noEmail)}
                          onChange={(event) => updateParticipant(index, "noEmail", event.target.checked)}
                          label="Pas d'email pour ce participant"
                        />
                      </div>
                    </div>
                  ))
                )}
                <AddButton theme="emerald" onClick={addParticipant}>Ajouter un participant</AddButton>
              </div>
            </FormSection>

            <FormSection title="📋 Situation antérieure">
              <FormTextarea
                label="Situation antérieure"
                value={formData.situation_anterieure}
                onChange={(event) => updateField("situation_anterieure", event.target.value)}
              />
            </FormSection>

            <FormSection title="🔔 Notifications et suivis">
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

            <FormSection title="💬 Points de situation">
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
                  label="Conclusion de la reunion"
                  value={formData.conclusion_reunion}
                  onChange={(event) => updateField("conclusion_reunion", event.target.value)}
                />
              </div>
            </FormSection>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ResetButton onClick={resetForm} />
              <div className="flex-1">
                <SubmitButton theme="emerald" />
              </div>
            </div>
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
