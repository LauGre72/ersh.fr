export type EtatCategorie = "Visible" | "Masqué";
export type CouleurPastel = "rose" | "bleu" | "vert" | "jaune" | "orange" | "violet" | "gris" | "menthe" | "lavande" | "peche";
export type ParcoursEleve = "Première demande" | "Réexamen";
export type OrientationEleve = "Ordinaire" | "Dispositif";
export type AlerteNotification = "aucune" | "echeance_annee_scolaire" | "expiree";

export interface Etablissement {
  id: number;
  user_id: string;
  nom: string;
  chef_etablissement?: string | null;
  email_chef_etablissement?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EtatDossier {
  id: number;
  user_id: string;
  nom: string;
  couleur: CouleurPastel;
  ordre_affichage: number;
  categorie: EtatCategorie;
  created_at?: string;
  updated_at?: string;
}

export interface FicheEleve {
  id: number;
  user_id: string;
  nom_eleve: string;
  numero_dossier_mdph?: string | null;
  date_naissance?: string | null;
  niveau_scolaire: string;
  parcours: ParcoursEleve;
  orientation: OrientationEleve;
  date_fin_notification?: string | null;
  commentaire?: string | null;
  etat_id: number;
  etablissement_id: number;
  alerte_notification?: AlerteNotification;
  created_at?: string;
  updated_at?: string;
}

export interface KanbanColumn {
  etat: EtatDossier;
  fiches: FicheEleve[];
}

export interface KanbanResponse {
  etablissement: Etablissement;
  colonnes: KanbanColumn[];
}

export interface SearchResult {
  fiche: FicheEleve;
  etablissement: Etablissement;
}

export interface ImportCsvResponse {
  lignes_lues: number;
  fiches_creees: number;
  fiches_mises_a_jour: number;
  etablissements_crees: number;
  lignes_rejetees: number;
  fiches_existantes_non_modifiees?: number;
  erreurs: Array<{ ligne: number; message: string }>;
}

export interface Historique {
  id: number;
  user_id: string;
  fiche_eleve_id?: number | null;
  type_modification: string;
  ancienne_valeur?: string | null;
  nouvelle_valeur?: string | null;
  created_at: string;
}

export type EtablissementPayload = Pick<Etablissement, "nom" | "chef_etablissement" | "email_chef_etablissement">;
export type EtatPayload = Pick<EtatDossier, "nom" | "couleur" | "ordre_affichage" | "categorie">;
export type FichePayload = Pick<
  FicheEleve,
  | "nom_eleve"
  | "numero_dossier_mdph"
  | "date_naissance"
  | "niveau_scolaire"
  | "parcours"
  | "orientation"
  | "date_fin_notification"
  | "commentaire"
  | "etat_id"
  | "etablissement_id"
>;
