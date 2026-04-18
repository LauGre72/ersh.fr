// src/components/EmargementForm.tsx
import type {
  EmargementDraft,
  ParticipantDraft,
} from "./EmargementDraft"

export default function EmargementForm({
  value,
  onChange,
}: {
  value: EmargementDraft
  onChange: (v: EmargementDraft) => void
}) {
  const setField = <K extends keyof EmargementDraft>(
    key: K,
    v: EmargementDraft[K],
  ) => {
    onChange({ ...value, [key]: v })
  }

  const updateParticipant = (
    index: number,
    patch: Partial<ParticipantDraft>,
  ) => {
    const list = [...value.participants]
    const prev = list[index] || { nom: "", fonction: "", email: "" }
    list[index] = { ...prev, ...patch }
    onChange({ ...value, participants: list })
  }

  const addParticipant = () => {
    const list = [
      ...value.participants,
      { nom: "", fonction: "", email: "" },
    ]
    onChange({ ...value, participants: list })
  }

  const removeParticipant = (index: number) => {
    const list = [...value.participants]
    list.splice(index, 1)
    onChange({ ...value, participants: list })
  }

  const moveParticipant = (from: number, to: number) => {
    if (to < 0 || to >= value.participants.length) return
    const list = [...value.participants]
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    onChange({ ...value, participants: list })
  }

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl ring-1 ring-black/5 p-6 space-y-6">
      <h2 className="text-[15px] font-semibold text-gray-900">
        Feuille d’émargement — informations
      </h2>

      {/* Identité / dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm text-gray-700">Nom de l’élève</span>
          <input
            value={value.nom}
            onChange={(e) => setField("nom", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
            placeholder="Ex. Nora Dupont"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">N° de dossier</span>
          <input
            value={value.dossier_num}
            onChange={(e) => setField("dossier_num", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
            placeholder="Ex. 72-2025-00123"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">Date de naissance</span>
          <input
            type="date"
            value={value.date_nais}
            onChange={(e) => setField("date_nais", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">Niveau</span>
          <input
            value={value.niveau}
            onChange={(e) => setField("niveau", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
            placeholder="Ex. 3e, 2nde GT, 1ère Pro."
          />
        </label>
      </div>

      {/* Contexte ESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm text-gray-700">Date ESS</span>
          <input
            type="date"
            value={value.date_ess}
            onChange={(e) => setField("date_ess", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">Type de demande</span>
          <select
            value={value.typedemande}
            onChange={(e) => setField("typedemande", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
          >
            <option value="">-- Sélectionner --</option>
            <option value="Première demande">Première demande</option>
            <option value="Réexamen">Réexamen</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">Établissement</span>
          <input
            value={value.etablissement}
            onChange={(e) => setField("etablissement", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
            placeholder="Ex. Lycée St-Charles Ste-Croix"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm text-gray-700">
            Chef d’établissement
          </span>
          <input
            value={value.chef_etab}
            onChange={(e) => setField("chef_etab", e.target.value)}
            className="w-full border border-neutral-200 rounded-xl p-2.5 bg-neutral-50"
            placeholder="Nom Prénom"
          />
        </label>
      </div>

      {/* Participants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            Participants
          </span>
          <button
            type="button"
            onClick={addParticipant}
            className="px-3 py-1.5 rounded-md text-sm text-gray-800 bg-neutral-100 border border-neutral-200 hover:bg-neutral-200"
          >
            + Ajouter un participant
          </button>
        </div>

        <div className="space-y-2">
          {value.participants.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start bg-neutral-50 border border-neutral-200 rounded-xl p-3"
            >
              <input
                className="border border-neutral-200 rounded-lg p-2 bg-white"
                placeholder="Nom"
                value={p.nom}
                onChange={(e) =>
                  updateParticipant(idx, { nom: e.target.value })
                }
              />
              <input
                className="border border-neutral-200 rounded-lg p-2 bg-white"
                placeholder="Fonction (PP, CPE, ERSH, AESH...)"
                value={p.fonction}
                onChange={(e) =>
                  updateParticipant(idx, { fonction: e.target.value })
                }
              />
              <input
                type="email"
                className="border border-neutral-200 rounded-lg p-2 bg-white"
                placeholder="Email (optionnel)"
                value={p.email}
                onChange={(e) =>
                  updateParticipant(idx, { email: e.target.value })
                }
              />

              <div className="flex flex-row items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => moveParticipant(idx, idx - 1)}
                  disabled={idx === 0}
                  title="Monter"
                  className="px-2 py-1 rounded-md text-sm bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveParticipant(idx, idx + 1)}
                  disabled={idx === value.participants.length - 1}
                  title="Descendre"
                  className="px-2 py-1 rounded-md text-sm bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeParticipant(idx)}
                  title="Supprimer"
                  className="px-2 py-1 rounded-md text-sm bg-white border border-neutral-200 hover:bg-neutral-100"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {value.participants.length === 0 && (
            <p className="text-xs text-gray-500">
              Ajoute au moins une ligne si tu veux une table de signatures
              plus large dans le PDF.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
