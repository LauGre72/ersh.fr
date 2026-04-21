import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import PDFGenerator from "../PDFGenerator";
import { auth } from "../../firebase";
import { getProfile } from "../api";
import {
  AddButton,
  DeleteIconButton,
  FormHeader,
  FormInput as BaseFormInput,
  FormSection as BaseFormSection,
  FormSelect as BaseFormSelect,
  MoveButton,
  SubmitButton,
} from "./FormControls";

interface Participant {
  nom: string;
  fonction: string;
  email: string;
}

const DEFAULT_USER_FUNCTION = "Enseignante référente";

export default function EmargementForm() {
  const [formData, setFormData] = useState({
    typedemande: "",
    date_ess: "",
    date_nais: "",
    nom: "",
    niveau: "",
    dossier_num: "",
    etablissement: "",
    chef_etab: "",
    participants: [] as Participant[],
  });

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
        };

        setFormData(prev => {
          if (prev.participants.length > 0) return prev;
          if (!defaultParticipant.nom && !defaultParticipant.fonction && !defaultParticipant.email) return prev;
          return { ...prev, participants: [defaultParticipant] };
        });
      } catch {
        if (cancelled) return;
        setFormData(prev => {
          if (prev.participants.length > 0 || !user.email) return prev;
          return {
            ...prev,
            participants: [{
              nom: user.displayName || "",
              fonction: DEFAULT_USER_FUNCTION,
              email: user.email,
            }],
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

  const moveParticipant = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= formData.participants.length) return;
    const participants = [...formData.participants];
    [participants[from], participants[to]] = [participants[to], participants[from]];
    setFormData(prev => ({ ...prev, participants }));
  };

  return (
    <PDFGenerator
      docType="feuillePresence"
      draftData={formData}
      onLoadDraft={(data) => setFormData(prev => ({ ...prev, ...data }))}
    >
      {(onSubmit) => (
        <div>
          <FormHeader
            title="✍️ Feuille d'Émargement ESS"
            description="Saisissez les informations et la liste des participants"
            theme="cyan"
          />

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="w-full space-y-6">
            {/* Identité */}
            <FormSection title="👤 Identité de l'élève">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nom et prénom"
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                  placeholder="Ex. Nora Dupont"
                />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(e) => updateField("date_nais", e.target.value)}
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

            {/* Réunion */}
            <FormSection title="📅 Réunion ESS">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Type de GEVA-Sco"
                  value={formData.typedemande}
                  onChange={(e) => updateField("typedemande", e.target.value)}
                  options={[
                    { value: "", label: "Sélectionner..." },
                    { value: "Première demande", label: "Première demande" },
                    { value: "Réexamen", label: "Réexamen" },
                  ]}
                />
                <FormInput
                  label="Date de l'ESS"
                  type="date"
                  value={formData.date_ess}
                  onChange={(e) => updateField("date_ess", e.target.value)}
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
                          onChange={(e) => updateParticipant(index, "email", e.target.value)}
                          className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none transition text-sm"
                        />
                      </div>
                    </div>
                  ))
                )}
                <AddButton theme="cyan" onClick={addParticipant}>+ Ajouter un participant</AddButton>
              </div>
            </FormSection>

            <SubmitButton theme="cyan" />
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

function FormSelect({
  label,
  options,
  ...props
}: {
  label: string;
  options: { value: string; label: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <BaseFormSelect label={label} options={options} theme="cyan" {...props} />;
}
