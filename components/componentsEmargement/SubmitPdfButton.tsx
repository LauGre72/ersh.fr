// src/components/SubmitPdfButton.tsx
import { useState } from "react"
import { submitEmargement } from "../lib/api"

export default function SubmitPdfButton({
  data,
  onSubmitted,
}: {
  data: Record<string, any>
  onSubmitted: (jobId: string) => void
}) {
  const [loading, setLoading] = useState(false)

  // Nom + date ESS requis pour lancer le PDF
  const disabled = !data?.nom || !data?.date_ess || loading

  const run = async () => {
    try {
      setLoading(true)
      const r = await submitEmargement(data)
      onSubmitted(r.job_id)
    } catch (e: any) {
      alert(e?.message || "Erreur lors de la soumission")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={run}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-sm text-gray-900 bg-neutral-100/90 hover:bg-neutral-200 disabled:opacity-50"
      >
        {loading ? "Soumission…" : "Générer le PDF"}
      </button>
    </div>
  )
}
