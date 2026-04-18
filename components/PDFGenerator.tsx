import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { submitPDF, getPDFStatus, downloadPDF } from "./api";

interface PDFGeneratorProps {
  docType: string;
  children: (onSubmit: (data: any) => void) => React.ReactNode;
}

export default function PDFGenerator({ docType, children }: PDFGeneratorProps) {
  const [user, setUser] = useState<any>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "pending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("document.pdf");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  const handleSubmit = async (formData: any) => {
    if (!user) return;
    setStatus("submitting");
    setError(null);
    try {
      const token = await user.getIdToken();
      const data = { doc_type: docType, ...formData };
      const result = await submitPDF(data, token);
      setJobId(result.job_id);
      setStatus("pending");
      pollStatus(result.job_id, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setStatus("error");
    }
  };

  const pollStatus = async (id: string, token: string) => {
    const interval = setInterval(async () => {
      try {
        const job = await getPDFStatus(id, token);
        setStatus(job.status);
        if (job.filename) setFilename(job.filename);
        if (job.status === "done") {
          clearInterval(interval);
        } else if (job.status === "error") {
          setError(job.error || "Erreur lors de la génération");
          clearInterval(interval);
        }
      } catch (err) {
        setError("Erreur lors de la vérification du statut");
        setStatus("error");
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleDownload = async () => {
    if (!jobId || !user) return;
    try {
      const token = await user.getIdToken();
      const blob = await downloadPDF(jobId, token);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Erreur lors du téléchargement");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {children(handleSubmit)}
      {status === "submitting" && <p>Soumission en cours...</p>}
      {status === "pending" && <p>Génération en cours...</p>}
      {status === "done" && (
        <div>
          <p>PDF généré avec succès !</p>
          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Télécharger le PDF
          </button>
        </div>
      )}
      {status === "error" && <p className="text-red-600">Erreur: {error}</p>}
    </div>
  );
}