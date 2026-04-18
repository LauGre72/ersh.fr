const API_BASE = "/api";

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
  const response = await fetch(`${API_BASE}/pdf/submit`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la soumission");
  return response.json();
}

export async function getPDFStatus(jobId: string, token: string): Promise<PDFJob> {
  const response = await fetch(`${API_BASE}/pdf/status/${jobId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Erreur lors de la vérification du statut");
  return response.json();
}

export async function downloadPDF(jobId: string, token: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/pdf/download/${jobId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Erreur lors du téléchargement");
  return response.blob();
}