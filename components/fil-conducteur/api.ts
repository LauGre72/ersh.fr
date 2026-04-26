import { auth } from "../../firebase";
import type {
  Etablissement,
  DashboardATraiter,
  EleveDocument,
  Ess,
  EssPayload,
  EtablissementPayload,
  EtablissementStats,
  EtatDossier,
  EtatPayload,
  FicheEleve,
  FichePayload,
  Historique,
  ImportCsvResponse,
  KanbanResponse,
  SearchResult,
  TimelineItem,
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
  headers.set("Accept", "application/json");
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
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new ApiError(
      `Reponse non JSON recue depuis ${API_BASE}${path}. Verifiez que le reverse proxy Apache /fc pointe bien vers le backend FilConducteur.`,
      response.status,
      null,
    );
  }
  return response.json() as Promise<T>;
}

export const filConducteurApi = {
  me: () => request<{ user_id: string; email: string }>("/me"),
  listRecentEtablissements: (limit = 10) => request<Etablissement[]>(`/me/recent-etablissements?limit=${limit}`),
  markRecentEtablissement: (id: number) => request<void>(`/me/recent-etablissements/${id}`, { method: "POST" }),
  listFavoriteEtablissements: () => request<Etablissement[]>("/me/favorite-etablissements"),
  toggleFavoriteEtablissement: (id: number) => request<Etablissement>(`/me/favorite-etablissements/${id}`, { method: "POST" }),

  listEtablissements: () => request<Etablissement[]>("/etablissements"),
  getEtablissement: (id: number) => request<Etablissement>(`/etablissements/${id}`),
  getEtablissementStats: (id: number) => request<EtablissementStats>(`/etablissements/${id}/stats`),
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
  dashboardATraiter: (notificationDays = 60, blockedDays = 14) =>
    request<DashboardATraiter>(`/dashboard/a-traiter?notification_days=${notificationDays}&blocked_days=${blockedDays}`),
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
  getFiche: (id: number) => request<FicheEleve>(`/eleves/${id}`),
  getFicheResume: (id: number) => request<Record<string, unknown>>(`/eleves/${id}/resume`),
  getFicheDetails: (id: number) => request<Record<string, unknown>>(`/eleves/${id}/details`),
  getFicheTimeline: (id: number) => request<TimelineItem[]>(`/eleves/${id}/timeline`),
  listEss: (ficheId: number) => request<Ess[]>(`/eleves/${ficheId}/ess`),
  createEss: (ficheId: number, payload: EssPayload) =>
    request<Ess>(`/eleves/${ficheId}/ess`, { method: "POST", body: JSON.stringify(payload) }),
  updateEss: (id: number, payload: Partial<EssPayload>) =>
    request<Ess>(`/ess/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  listDocuments: (ficheId: number) => request<EleveDocument[]>(`/eleves/${ficheId}/documents`),
  createDocument: (ficheId: number, payload: Partial<EleveDocument>) =>
    request<EleveDocument>(`/eleves/${ficheId}/documents`, { method: "POST", body: JSON.stringify(payload) }),
  searchEleves: (query: string, etablissementId?: number) => {
    const params = new URLSearchParams({ q: query });
    if (etablissementId) params.set("etablissement_id", String(etablissementId));
    return request<SearchResult[]>(`/eleves/search?${params.toString()}`);
  },
  importCsv: async (
    file: File,
    etatDefautId?: number,
    updateExisting = true,
    parcoursDefaut = "Reexamen",
    orientationDefaut = "Ordinaire",
  ) => {
    const body = new FormData();
    body.set("file", await normalizeCsvFile(file));
    if (etatDefautId) body.set("etat_defaut_id", String(etatDefautId));
    body.set("update_existing", String(updateExisting));
    body.set("parcours_defaut", parcoursDefaut);
    body.set("orientation_defaut", orientationDefaut);
    return request<ImportCsvResponse>("/eleves/import-csv", { method: "POST", body });
  },
  previewImportCsv: async (file: File) => {
    const body = new FormData();
    body.set("file", await normalizeCsvFile(file));
    return request<Record<string, unknown>>("/eleves/import-csv/preview", { method: "POST", body });
  },
  listHistoriques: (ficheEleveId?: number) => {
    const params = new URLSearchParams();
    if (ficheEleveId) params.set("fiche_eleve_id", String(ficheEleveId));
    const query = params.toString();
    return request<Historique[]>(`/historiques${query ? `?${query}` : ""}`);
  },
};

export async function saveFicheEss(ficheId: number, payload: EssPayload) {
  const items = await request<Ess[]>(`/eleves/${ficheId}/ess`);
  const existing = items.find((item) => {
    if (payload.type_ess === "annuelle") return item.type_ess === "annuelle";
    return item.type_ess === "suivi" && item.numero_suivi === payload.numero_suivi;
  });

  if (existing) {
    return request<Ess>(`/ess/${existing.id}`, { method: "PUT", body: JSON.stringify(payload) });
  }
  return request<Ess>(`/eleves/${ficheId}/ess`, { method: "POST", body: JSON.stringify(payload) });
}

async function normalizeCsvFile(file: File) {
  const text = await file.text();
  const rows = parseCsvRows(text, detectCsvDelimiter(text));
  if (rows.length === 0) return file;

  const normalizedRows = rows.map((row, rowIndex) =>
    row.map((cell, cellIndex) => {
      const value = cell.trim();
      return rowIndex === 0 && cellIndex === 0 ? value.replace(/^\uFEFF/, "") : value;
    }),
  );
  const normalizedText = normalizedRows.map((row) => row.map(escapeCsvCell).join(",")).join("\n");
  return new File([normalizedText], file.name, { type: "text/csv" });
}

function detectCsvDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const semicolons = countDelimiter(firstLine, ";");
  const commas = countDelimiter(firstLine, ",");
  return semicolons > commas ? ";" : ",";
}

function countDelimiter(line: string, delimiter: string) {
  let count = 0;
  let inQuotes = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"') {
      if (inQuotes && next === '"') index += 1;
      else inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && char === delimiter) count += 1;
  }
  return count;
}

function parseCsvRows(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(cell);
      cell = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
      if (char === "\r" && next === "\n") index += 1;
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function escapeCsvCell(value: string) {
  if (!/[",\n\r]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
}
