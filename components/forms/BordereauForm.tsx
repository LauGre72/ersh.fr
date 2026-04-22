import { useState } from "react";
import PDFGenerator from "../PDFGenerator";
import {
  FormCheckbox,
  FormHeader,
  FormInput,
  FormLabel,
  FormSection,
  FormSelect,
  ResetButton,
  SubmitButton,
} from "./FormControls";

// Options pour les multi-select
const DEMANDES_OPTIONS = [
  { id: "aeeh", label: "AEEH" },
  { id: "aesh", label: "AESH" },
  { id: "aesh_ulis", label: "AESH collectif (ULIS)" },
  { id: "amen_exam", label: "Aménagements d'examen (DNB, Bac…)" },
  { id: "camsp", label: "CAMSP" },
  { id: "cmi", label: "CMI" },
  { id: "cmp", label: "CMP" },
  { id: "cmpp", label: "CMPP" },
  { id: "enseignement_amenage", label: "Enseignement ordinaire avec aménagements" },
  { id: "erea", label: "EREA" },
  { id: "iem", label: "IEM" },
  { id: "ies", label: "IES" },
  { id: "ime", label: "IME" },
  { id: "indemnisation_transport", label: "Indemnisation de transport" },
  { id: "itep", label: "ITEP" },
  { id: "logiciel", label: "Logiciel spécifique (ex : dictée vocale)" },
  { id: "maintien_maternelle", label: "Maintien en maternelle" },
  { id: "materiel_adapte", label: "Matériel pédagogique adapté" },
  { id: "ordi", label: "Ordinateur portable" },
  { id: "pai_pap", label: "Mise en place d'un PAI / PAP" },
  { id: "pch", label: "PCH" },
  { id: "rqth", label: "RQTH" },
  { id: "safe", label: "SAFE" },
  { id: "segpa", label: "SEGPA" },
  { id: "sessad", label: "SESSAD" },
  { id: "tablette", label: "Tablette" },
  { id: "temps_majore", label: "Temps majoré ou secrétariat aux épreuves" },
  { id: "transport_adapte", label: "Transport scolaire adapté" },
  { id: "ue_ems", label: "UE (Unité d'Enseignement en EMS)" },
  { id: "ulis_college", label: "ULIS collège" },
  { id: "ulis_ecole", label: "ULIS école" },
  { id: "ulis_lycee", label: "ULIS lycée" },
];

const PI_OPTIONS = [
  { id: "delegation_parentale", label: "Attestation de délégation parentale"},   
  { id: "ofpra", label: "Attestation OFPRA / réfugié" },
  { id: "ci_eleve", label: "Carte d'identité de l'élève" },
  { id: "ci_parent1", label: "Carte d'identité représentant légal (Parent 1)" },
  { id: "ci_parent2", label: "Carte d'identité représentant légal (Parent 2)" },
  { id: "doc_provisoire", label: "Document provisoire (préfecture)" },   
  { id: "extrait_naissance", label: "Extrait d'acte de naissance" },
  { id: "identite_mecs", label: "Identité transmise par établissement / MECS" },
  { id: "jugement_divorce", label: "Jugement de divorce / autorité parentale" },
  { id: "livret_famille", label: "Livret de famille" },
  { id: "pass_eleve", label: "Passeport élève" },
  { id: "pass_parent1", label: "Passeport représentant légal (Parent 1)" },
  { id: "pass_parent2", label: "Passeport représentant légal (Parent 2)" },
  { id: "titre_sejour", label: "Titre de séjour" },
  { id: "tutelle", label: "Tutelle / curatelle" },

];

const JD_OPTIONS = [
  { id: "attestation_caf", label: "Attestation CAF de résidence" },
  { id: "attestation_hebergement", label: "Attestation d'hébergement" },
  { id: "bail", label: "Bail locatif" },
  { id: "contrat", label: "Contrat" },
  { id: "courrier_mairie", label: "Courrier mairie / CCAS" },
  { id: "facture_nrj", label: "Facture d'énergie" },
  { id: "facture_tel", label: "Facture de téléphone / box" },
  { id: "hebergement_mecs", label: "Hébergement en foyer / MECS" },
  { id: "impots", label: "Impots (taxe d'habitation...)" },
  { id: "jd_parents", label: "Justificatif de domicile des représentants légaux" },
  { id: "quittance_loyer", label: "Quittance de loyer (organisme social ou agence)" },
  { id: "rib_adresse", label: "RIB avec adresse" },
  { id: "titre_propriete", label: "Titre de propriété" },
];

const createInitialFormData = () => ({
  typedemande: "",
  dossier_num: "",
  nom: "",
  date_nais: "",
  demandes: [] as string[],
  demandes_autre: "",
  CERFA: false,
  HAS_PI: false,
  PI: [] as string[],
  PI_autre: "",
  HAS_JD: false,
  JD: [] as string[],
  JD_autre: "",
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

export default function BordereauForm() {
  const [formData, setFormData] = useState(createInitialFormData);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMultiSelect = (field: string, value: string) => {
    const arr = formData[field as keyof typeof formData] as string[];
    if (Array.isArray(arr)) {
      if (arr.includes(value)) {
        updateField(field, arr.filter(v => v !== value));
      } else {
        updateField(field, [...arr, value]);
      }
    }
  };

  const linesFromText = (value: string) =>
    value
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean);

  const buildBulletList = (selectedIds: string[], options: { id: string; label: string }[], freeText = "") => {
    const labels = selectedIds
      .map(id => options.find(opt => opt.id === id)?.label)
      .filter((label): label is string => Boolean(label));
    const lines = [...labels, ...linesFromText(freeText)];

    return lines.length ? lines.map(label => `* ${label}`).join("\n") : null;
  };

  const emptyToNull = (value: string) => value.trim() || null;

  const resetForm = () => {
    setFormData(createInitialFormData());
  };

  const buildPayload = () => ({
    typedemande: emptyToNull(formData.typedemande),
    dossier_num: emptyToNull(formData.dossier_num),
    nom: emptyToNull(formData.nom),
    date_nais: emptyToNull(formData.date_nais),
    demandes: buildBulletList(formData.demandes, DEMANDES_OPTIONS, formData.demandes_autre),
    CERFA: formData.CERFA,
    HAS_PI: formData.HAS_PI,
    PI: formData.HAS_PI ? buildBulletList(formData.PI, PI_OPTIONS, formData.PI_autre) : null,
    HAS_JD: formData.HAS_JD,
    JD: formData.HAS_JD ? buildBulletList(formData.JD, JD_OPTIONS, formData.JD_autre) : null,
    cert_med: emptyToNull(formData.cert_med),
    HAS_GEVASco: formData.HAS_GEVASco,
    date_geva_sco: formData.HAS_GEVASco ? emptyToNull(formData.date_geva_sco) : null,
    type_reunion: formData.HAS_GEVASco ? emptyToNull(formData.type_reunion) : null,
    HAS_LPI: formData.HAS_LPI,
    NUM_LPI: formData.HAS_LPI ? emptyToNull(formData.NUM_LPI) : null,
    HAS_PSY: formData.HAS_PSY,
    PSY: formData.HAS_PSY ? emptyToNull(formData.PSY) : null,
    HAS_PRO: formData.HAS_PRO,
    PRO: formData.HAS_PRO ? emptyToNull(formData.PRO) : null,
    HAS_AUTRE: formData.HAS_AUTRE,
    AUTRE: formData.HAS_AUTRE ? emptyToNull(formData.AUTRE) : null,
  });

  return (
    <PDFGenerator
      docType="bordereau"
      draftData={formData}
      onLoadDraft={(data) => setFormData(prev => ({ ...prev, ...data }))}
    >
      {(onSubmit) => (
        <div>
          <FormHeader
            title="📋 Bordereau de dépôt MDPH"
            description="Complétez tous les champs pour générer votre bordereau"
          />

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(buildPayload()); }} className="w-full space-y-6">
            {/* Identité */}
            <FormSection title="👤 Identité de l'élève">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Nom et prénom"
                  value={formData.nom}
                  onChange={(e) => updateField("nom", e.target.value)}
                />
                <FormInput
                  label="Date de naissance"
                  type="date"
                  value={formData.date_nais}
                  onChange={(e) => updateField("date_nais", e.target.value)}
                />
                <FormInput
                  label="N° de dossier MDPH"
                  value={formData.dossier_num}
                  onChange={(e) => updateField("dossier_num", e.target.value)}
                  placeholder="Ex. 72-2025-00123"
                />
              </div>
            </FormSection>

            {/* Dossier */}
            <FormSection title="📁 Dossier">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Type de GEVA-Sco"
                  value={formData.typedemande}
                  onChange={(e) => updateField("typedemande", e.target.value)}
                  options={[
                    { value: "", label: "Sélectionner..." },
                    { value: "Première demande", label: "Première demande" },
                    { value: "Réexamen", label: "Réexamen" },
                    { value: "Autre", label: "Autre" },
                  ]}
                />
              </div>
            </FormSection>

            {/* Demandes */}
            <FormSection title="🎯 Demandes">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {DEMANDES_OPTIONS.map(opt => (
                  <FormCheckbox
                    key={opt.id}
                    checked={formData.demandes.includes(opt.id)}
                    onChange={() => toggleMultiSelect("demandes", opt.id)}
                    label={opt.label}
                  />
                ))}
              </div>
              <div className="mt-4">
                <FormLabel>Demandes</FormLabel>
                <textarea
                  value={formData.demandes_autre}
                  onChange={(e) => updateField("demandes_autre", e.target.value)}
                  placeholder="Ex. Orientation vers un service spécifique"
                  className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-24"
                />
              </div>
            </FormSection>

            {/* Documents CERFA */}
            <FormSection title="📄 Documents">
              <div className="space-y-4">
                <FormCheckbox
                  checked={formData.CERFA}
                  onChange={(e) => updateField("CERFA", e.target.checked)}
                  label="CERFA 15692*01 rempli"
                />

                <div className="border-t pt-4">
                  <FormCheckbox
                    checked={formData.HAS_PI}
                    onChange={(e) => updateField("HAS_PI", e.target.checked)}
                    label="Presence d’une piece d’identité"
                  />
                  {formData.HAS_PI && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2 border border-blue-200">
                      {PI_OPTIONS.map(opt => (
                        <FormCheckbox
                          key={opt.id}
                          label={opt.label}
                          checked={formData.PI.includes(opt.id)}
                          onChange={() => toggleMultiSelect("PI", opt.id)}
                        />
                      ))}
                      <div className="sm:col-span-2">
                        <FormLabel>Piece d’identité</FormLabel>
                        <textarea
                          value={formData.PI_autre}
                          onChange={(e) => updateField("PI_autre", e.target.value)}
                          placeholder="Ex. Attestation d'identité"
                          className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-24 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <FormCheckbox
                    checked={formData.HAS_JD}
                    onChange={(e) => updateField("HAS_JD", e.target.checked)}
                    label="Presence du justificatif de domiciliation"
                  />
                  {formData.HAS_JD && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2 border border-green-200">
                      {JD_OPTIONS.map(opt => (
                        <FormCheckbox
                          key={opt.id}
                          label={opt.label}
                          checked={formData.JD.includes(opt.id)}
                          onChange={() => toggleMultiSelect("JD", opt.id)}
                        />
                      ))}
                      <div className="sm:col-span-2">
                        <FormLabel>Justificatif de domiciliation</FormLabel>
                        <textarea
                          value={formData.JD_autre}
                          onChange={(e) => updateField("JD_autre", e.target.value)}
                          placeholder="Ex. Attestation de résidence"
                          className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-24 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <FormLabel>Certificat medical</FormLabel>
                <textarea
                  value={formData.cert_med}
                  onChange={(e) => updateField("cert_med", e.target.value)}
                  className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-20"
                />
              </div>
            </FormSection>

            {/* GEVA-Sco */}
            <FormSection title="📊 LPI et GEVA-Sco">
              <div className="space-y-3">
                <FormCheckbox
                  checked={formData.HAS_GEVASco}
                  onChange={(e) => updateField("HAS_GEVASco", e.target.checked)}
                  label="GEVA-Sco PDF"
                />
                {formData.HAS_GEVASco && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                    <FormInput
                      label="Date du GEVA-Sco"
                      type="date"
                      value={formData.date_geva_sco}
                      onChange={(e) => updateField("date_geva_sco", e.target.value)}
                    />
                    <FormSelect
                      label="Type de reunion dont est issu le GEVA-Sco"
                      value={formData.type_reunion}
                      onChange={(e) => updateField("type_reunion", e.target.value)}
                      options={[
                        { value: "", label: "Sélectionner..." },
                        { value: "ESS", label: "ESS" },
                        { value: "Equipe éducative", label: "Équipe éducative" },
                      ]}
                    />
                  </div>
                )}
                <FormCheckbox
                  checked={formData.HAS_LPI}
                  onChange={(e) => updateField("HAS_LPI", e.target.checked)}
                  label="LPI"
                />
                {formData.HAS_LPI && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <FormInput
                      label="N° LPI"
                      value={formData.NUM_LPI}
                      onChange={(e) => updateField("NUM_LPI", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </FormSection>

            {/* Autres sections */}
            <FormSection title="📌 Documents supplémentaires">
              <div className="space-y-3">
                

                <div className="border-t pt-4">
                  <FormCheckbox
                    checked={formData.HAS_PSY}
                    onChange={(e) => updateField("HAS_PSY", e.target.checked)}
                    label="Bilan psychologique"
                  />
                  {formData.HAS_PSY && (
                    <div className="mt-2">
                      <textarea
                        value={formData.PSY}
                        onChange={(e) => updateField("PSY", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-20"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <FormCheckbox
                    checked={formData.HAS_PRO}
                    onChange={(e) => updateField("HAS_PRO", e.target.checked)}
                    label="Synthèse de professionnels"
                  />
                  {formData.HAS_PRO && (
                    <div className="mt-2">

                      <textarea
                        value={formData.PRO}
                        onChange={(e) => updateField("PRO", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-20"
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <FormCheckbox
                    checked={formData.HAS_AUTRE}
                    onChange={(e) => updateField("HAS_AUTRE", e.target.checked)}
                    label="Autres documents"
                  />
                  {formData.HAS_AUTRE && (
                    <div className="mt-2">
                      <textarea
                        value={formData.AUTRE}
                        onChange={(e) => updateField("AUTRE", e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition h-20"
                      />
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ResetButton onClick={resetForm} />
              <div className="flex-1">
                <SubmitButton />
              </div>
            </div>
          </form>
        </div>
      )}
    </PDFGenerator>
  );
}
