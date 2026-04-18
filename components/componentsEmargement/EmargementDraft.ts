// src/components/EmargementDraft.ts

// Participant tel qu'il est stocké dans le JSON local
export interface ParticipantDraft {
  nom: string
  fonction: string
  email: string
}

// Brouillon complet d'une feuille d'émargement
export interface EmargementDraft {
  schemaVersion: number
  docType: "feuillePresence"

  nom: string
  date_ess: string
  date_nais: string
  niveau: string
  dossier_num: string
  etablissement: string
  chef_etab: string
  typedemande: string

  participants: ParticipantDraft[]
}

// Modèle pour le backend / PDF
export type EmargementData = {
  doc_type: "feuillePresence"
  typedemande?: string | null
  date_ess: string
  date_nais?: string | null
  nom: string
  niveau?: string | null
  dossier_num?: string | null
  etablissement?: string | null
  chef_etab?: string | null
  participants: {
    nom?: string
    fonction?: string
    email?: string
  }[]
}

// Brouillon vide
export function createEmptyEmargementDraft(): EmargementDraft {
  return {
    schemaVersion: 1,
    docType: "feuillePresence",

    nom: "",
    date_ess: "",
    date_nais: "",
    niveau: "",
    dossier_num: "",
    etablissement: "",
    chef_etab: "",
    typedemande: "",

    participants: [],
  }
}

// Parse strict d'un brouillon JSON (pas de support ancien format)
export function parseEmargementDraft(input: unknown): EmargementDraft {
  if (!input || typeof input !== "object") {
    throw new Error("Contenu JSON invalide")
  }
  const raw = input as any

  if (raw.docType !== "feuillePresence") {
    throw new Error("docType incorrect ou manquant")
  }

  const participants: ParticipantDraft[] = Array.isArray(raw.participants)
    ? raw.participants.map((p: any) => ({
        nom: p?.nom ?? "",
        fonction: p?.fonction ?? "",
        email: p?.email ?? "",
      }))
    : []

  return {
    schemaVersion:
      typeof raw.schemaVersion === "number" ? raw.schemaVersion : 1,
    docType: "feuillePresence",
    nom: raw.nom ?? "",
    date_ess: raw.date_ess ?? "",
    date_nais: raw.date_nais ?? "",
    niveau: raw.niveau ?? "",
    dossier_num: raw.dossier_num ?? "",
    etablissement: raw.etablissement ?? "",
    chef_etab: raw.chef_etab ?? "",
    typedemande: raw.typedemande ?? "",
    participants,
  }
}

// Conversion du brouillon → données backend / PDF
export function buildEmargementPayload(draft: EmargementDraft): EmargementData {
  return {
    doc_type: "feuillePresence",
    typedemande: draft.typedemande || null,
    date_ess: draft.date_ess,
    date_nais: draft.date_nais || null,
    nom: draft.nom,
    niveau: draft.niveau || null,
    dossier_num: draft.dossier_num || null,
    etablissement: draft.etablissement || null,
    chef_etab: draft.chef_etab || null,
    participants: draft.participants.map((p) => ({
      nom: p.nom || undefined,
      fonction: p.fonction || undefined,
      email: p.email || undefined,
    })),
  }
}
