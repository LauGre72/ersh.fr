const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

function formatValidationDetail(detail: unknown): string {
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (!item || typeof item !== "object") return String(item);
        const record = item as { loc?: unknown[]; msg?: string };
        const location = Array.isArray(record.loc) ? record.loc.join(".") : "";
        return location ? `${location}: ${record.msg}` : record.msg;
      })
      .filter(Boolean)
      .join(" | ");
  }

  if (typeof detail === "string") return detail;
  return "";
}

async function getErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const payload = await response.json().catch(() => null);
    const detail = payload && typeof payload === "object" ? (payload as { detail?: unknown }).detail : null;
    const validationDetail = formatValidationDetail(detail);
    return validationDetail || fallback;
  }

  const text = await response.text().catch(() => "");
  return text || fallback;
}

export interface PDFJob {
  job_id: string;
  status: "pending" | "done" | "error";
  path?: string;
  filename?: string;
  download_url?: string;
  error?: string;
  owner: string;
}

export async function submitPDF(data: any, token: string): Promise<{ job_id: string }> {
  const response = await fetch(apiUrl("/pdf/submit"), {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erreur lors de la soumission"));
  }
  return response.json();
}

export async function getPDFStatus(jobId: string, token: string): Promise<PDFJob> {
  const response = await fetch(apiUrl(`/pdf/status/${jobId}`), {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erreur lors de la verification du statut"));
  }
  return response.json();
}

export async function downloadPDF(jobId: string, token: string): Promise<Blob> {
  const response = await fetch(apiUrl(`/pdf/download/${jobId}`), {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erreur lors du telechargement"));
  }
  return response.blob();
}
