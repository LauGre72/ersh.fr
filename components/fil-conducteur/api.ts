import { auth } from "../../firebase";
import type {
  Etablissement,
  EtablissementPayload,
  EtatDossier,
  EtatPayload,
  FicheEleve,
  FichePayload,
  Historique,
  ImportCsvResponse,
  KanbanResponse,
  SearchResult,
} from "./types";

const API_BASE = (import.meta.env.VITE_FIL_CONDUCTEUR_API_URL || "/fc").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

async function getToken() {
  const user = auth.currentUser;
  if (!user) throw new Error("Utilisateur non connecte.");
  return user.getIdToken();
}

async function readJson(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return response.json().catch(() => null);
}

function formatError(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  return fallback;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    const payload = await readJson(response);
    const message = formatError(payload, `Erreur HTTP ${response.status}`);
    throw new ApiError(message, response.status, payload);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const filConducteurApi = {
  me: () => request<{ user_id: string; email: string }>("/me"),

  listEtablissements: () => request<Etablissement[]>("/etablissements"),
  createEtablissement: (payload: EtablissementPayload) =>
    request<Etablissement>("/etablissements", { method: "POST", body: JSON.stringify(payload) }),
  updateEtablissement: (id: number, payload: Partial<EtablissementPayload>) =>
    request<Etablissement>(`/etablissements/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteEtablissement: (id: number) => request<void>(`/etablissements/${id}`, { method: "DELETE" }),
  fusionEtablissements: (source_id: number, target_id: number) =>
    request<Etablissement>("/etablissements/fusion", { method: "POST", body: JSON.stringify({ source_id, target_id }) }),

  listEtats: (visibleOnly = false) => request<EtatDossier[]>(`/etats?visible_only=${visibleOnly ? "true" : "false"}`),
  createEtat: (payload: EtatPayload) => request<EtatDossier>("/etats", { method: "POST", body: JSON.stringify(payload) }),
  updateEtat: (id: number, payload: Partial<EtatPayload>) =>
    request<EtatDossier>(`/etats/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteEtat: (id: number) => request<void>(`/etats/${id}`, { method: "DELETE" }),

  getKanban: (etablissementId: number) => request<KanbanResponse>(`/kanban/${etablissementId}`),
  listFiches: (filters: { etablissementId?: number; etatId?: number } = {}) => {
    const params = new URLSearchParams();
    if (filters.etablissementId) params.set("etablissement_id", String(filters.etablissementId));
    if (filters.etatId) params.set("etat_id", String(filters.etatId));
    const query = params.toString();
    return request<FicheEleve[]>(`/eleves${query ? `?${query}` : ""}`);
  },
  createFiche: (payload: FichePayload) => request<FicheEleve>("/eleves", { method: "POST", body: JSON.stringify(payload) }),
  updateFiche: (id: number, payload: Partial<FichePayload>) =>
    request<FicheEleve>(`/eleves/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteFiche: (id: number) => request<void>(`/eleves/${id}`, { method: "DELETE" }),
  moveFiche: (id: number, etat_id: number) =>
    request<FicheEleve>(`/eleves/${id}/move`, { method: "POST", body: JSON.stringify({ etat_id }) }),
  searchEleves: (query: string, etablissementId?: number) => {
    const params = new URLSearchParams({ q: query });
    if (etablissementId) params.set("etablissement_id", String(etablissementId));
    return request<SearchResult[]>(`/eleves/search?${params.toString()}`);
  },
  importCsv: (file: File, etatDefautId?: number, updateExisting = true) => {
    const body = new FormData();
    body.set("file", file);
    if (etatDefautId) body.set("etat_defaut_id", String(etatDefautId));
    body.set("update_existing", String(updateExisting));
    return request<ImportCsvResponse>("/eleves/import-csv", { method: "POST", body });
  },
  listHistoriques: (ficheEleveId?: number) => {
    const params = new URLSearchParams();
    if (ficheEleveId) params.set("fiche_eleve_id", String(ficheEleveId));
    const query = params.toString();
    return request<Historique[]>(`/historiques${query ? `?${query}` : ""}`);
  },
};
