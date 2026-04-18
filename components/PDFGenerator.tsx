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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {children(handleSubmit)}
      
      {/* Status Messages */}
      <div className="mt-8 space-y-3">
        {status === "submitting" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-blue-100 rounded-full"></div>
            <span className="text-blue-900 font-medium">Soumission en cours...</span>
          </div>
        )}
        
        {status === "pending" && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-spin h-5 w-5 border-2 border-amber-600 border-t-amber-100 rounded-full"></div>
              <span className="font-medium text-amber-900">Génération du PDF en cours...</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2">
              <div className="bg-amber-600 h-2 rounded-full animate-pulse w-1/3"></div>
            </div>
          </div>
        )}
        
        {status === "done" && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-lg">✓</div>
              <span className="text-green-900 font-bold text-lg">PDF généré avec succès !</span>
            </div>
            <button
              onClick={handleDownload}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold shadow-md hover:shadow-lg"
            >
              📥 Télécharger le PDF
            </button>
          </div>
        )}
        
        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-6 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
              <span className="font-bold text-red-900">Erreur lors de la génération</span>
            </div>
            <p className="text-red-800 text-sm ml-9">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}