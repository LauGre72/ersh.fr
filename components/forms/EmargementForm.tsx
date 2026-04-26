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
  FormSection as BaseFormSection,
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

const DEFAULT_USER_FUNCTION = "Enseignante référente";

const NO_MAIL_VALUE = "NO_MAIL";

const emptyParticipant: Participant = {
  nom: "",
  fonction: "",
  email: "",
  noEmail: false,
};

const initialFormData = {
  date_ess: "",
  annee_scolaire: getCurrentSchoolYear(),
  date_nais: "",
  nom: "",
  niveau: "",
  dossier_num: "",
  etablissement: "",
  chef_etab: "",
  participants: [] as Participant[],
};

function getRoutePrefill(state: unknown): Partial<typeof initialFormData> {
  const prefill = (state as { prefill?: Record<string, string> } | null)?.prefill;
  if (!prefill) return {};

  return {
    nom: prefill.nom || "",
    date_nais: prefill.date_nais || "",
    niveau: prefill.niveau || "",
    dossier_num: prefill.dossier_num || "",
    etablissement: prefill.etablissement || "",
    chef_etab: prefill.chef_etab || "",
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

export default function EmargementForm() {
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

        setFormData(prev => {
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

        setFormData(prev => {
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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      annee_scolaire: getCurrentSchoolYear(),
      participants: defaultParticipant ? [defaultParticipant] : [],
    });
  };

  const loadDraft = (data: Partial<typeof formData> & { typedemande?: string }) => {
    const { typedemande: _typedemande, ...supportedData } = data;
    setFormData(prev => ({
      ...prev,
      ...supportedData,
      participants: supportedData.participants?.map(normalizeParticipant) || prev.participants,
    }));
  };

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, { ...emptyParticipant }]
    }));
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string | boolean) => {
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

  const moveParticipant = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= formData.participants.length) return;
    const participants = [...formData.participants];
    [participants[from], participants[to]] = [participants[to], participants[from]];
    setFormData(prev => ({ ...prev, participants }));
  };

  const buildPayload = () => ({
    ...formData,
    participants: formData.participants
      .map(participantForApi)
      .filter((participant) => participant.nom || participant.fonction || participant.email),
  });

  const submitWithEssTracking = async (onSubmit: (data: unknown) => void) => {
    const payload = buildPayload();
    setEssSaveError("");

    if (ficheId) {
      if (!payload.date_ess) {
        setEssSaveError("La date de l'ESS est obligatoire pour l'enregistrer dans la fiche eleve.");
        return;
      }

      try {
        await saveFicheEss(ficheId, {
          date_ess: payload.date_ess,
          type_ess: "annuelle",
          numero_suivi: null,
        });
        await filConducteurApi.createDocument(ficheId, {
          type_document: "feuillePresence",
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
      docType="feuillePresence"
      draftData={formData}
      onLoadDraft={loadDraft}
    >
      {(onSubmit) => (
        <div>
          <FormHeader
            title="✍️ Feuille d’émargement ESS annuelle"
            description="Saisissez les informations et la liste des participants"
            theme="cyan"
          />

          <form onSubmit={(e) => { e.preventDefault(); void submitWithEssTracking(onSubmit); }} className="w-full space-y-6">
            {essSaveError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
                {essSaveError}
              </div>
            )}
            {/* Réunion */}
            <FormSection title="📅 Organisation">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Date de l'ESS"
                  type="date"
                  value={formData.date_ess}
                  onChange={(e) => updateField("date_ess", e.target.value)}
                />
                <FormInput
                  label="Année scolaire"
                  value={formData.annee_scolaire}
                  onChange={(e) => updateField("annee_scolaire", e.target.value)}
                  placeholder="Ex. 2025-2026"
                />
              </div>
            </FormSection>

            {/* Identité */}
            <FormSection title="👤 Identité de l'élève">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nom et prénom"
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  placeholder="Ex. Nora Dupont"
                  required
                />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(e) => updateField("date_nais", e.target.value)}
                  max={today}
                />
                <FormInput
                  label="Niveau scolaire"
                  value={formData.niveau}
                  onChange={(e) => updateField("niveau", e.target.value)}
                  placeholder="Ex. 3e, 2nde GT, 1ère Pro."
                />
                <FormInput
                  label="N° de dossier MDPH"
                  value={formData.dossier_num}
                  onChange={(e) => updateField("dossier_num", e.target.value)}
                  placeholder="Ex. 72-2025-00123"
                />
              </div>
            </FormSection>

            {/* Établissement */}
            <FormSection title="🏫 Établissement">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Etablissement"
                  value={formData.etablissement}
                  onChange={(e) => updateField("etablissement", e.target.value)}
                  placeholder="Ex. Collège Jean Monnet"
                />
                <FormInput
                  label="Chef d'etablissement"
                  value={formData.chef_etab}
                  onChange={(e) => updateField("chef_etab", e.target.value)}
                  placeholder="Ex. Mme/M. Dupont"
                />
              </div>
            </FormSection>

            {/* Participants */}
            <FormSection title={`👥 Participants (${formData.participants.length})`}>
              <div className="space-y-3">
                {formData.participants.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun participant ajouté. Cliquez sur le bouton ci-dessous.</p>
                ) : (
                  formData.participants.map((p, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-cyan-50 rounded-lg border-2 border-gray-200 hover:border-cyan-300 transition">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-gray-900">Participant #{index + 1}</span>
                        <div className="flex gap-2">
                          <MoveButton direction="up" onClick={() => moveParticipant(index, "up")} disabled={index === 0} />
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Nom"
                          value={p.nom}
                          onChange={(e) => updateParticipant(index, "nom", e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Fonction"
                          value={p.fonction}
                          onChange={(e) => updateParticipant(index, "fonction", e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-sm"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={p.email}
                          disabled={p.noEmail}
                          onChange={(e) => updateParticipant(index, "email", e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                        />
                      </div>
                      <div className="mt-3">
                        <FormCheckbox
                          theme="cyan"
                          checked={Boolean(p.noEmail)}
                          onChange={(e) => updateParticipant(index, "noEmail", e.target.checked)}
                          label="Pas d'email pour ce participant"
                        />
                      </div>
                    </div>
                  ))
                )}
                <AddButton theme="cyan" onClick={addParticipant}>+ Ajouter un participant</AddButton>
              </div>
            </FormSection>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ResetButton onClick={resetForm} />
              <div className="flex-1">
                <SubmitButton theme="cyan" />
              </div>
            </div>
          </form>
        </div>
      )}
    </PDFGenerator>
  );
}

// Composants réutilisables
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <BaseFormSection title={title} theme="cyan">{children}</BaseFormSection>;
}

function FormInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <BaseFormInput label={label} theme="cyan" {...props} />;
}
