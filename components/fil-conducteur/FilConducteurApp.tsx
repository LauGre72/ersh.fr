import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { filConducteurApi, isApiError } from "./api";
import type {
  CouleurPastel,
  Etablissement,
  EtatCategorie,
  EtatDossier,
  FicheEleve,
  FichePayload,
  Historique,
  ImportCsvResponse,
  KanbanResponse,
  OrientationEleve,
  ParcoursEleve,
  SearchResult,
} from "./types";
import {
  alerteClass,
  Button,
  orientationIcon,
  parcoursClass,
  pastelClasses,
  SelectInput,
  StatusMessage,
  TextareaInput,
  TextInput,
} from "./ui";

const couleurs: CouleurPastel[] = ["rose", "bleu", "vert", "jaune", "orange", "violet", "gris", "menthe", "lavande", "peche"];
const parcoursOptions: ParcoursEleve[] = ["Première demande", "Réexamen"];
const orientationOptions: OrientationEleve[] = ["Ordinaire", "Dispositif"];
const categorieOptions: EtatCategorie[] = ["Visible", "Masqué"];

export default function FilConducteurApp() {
  return (
    <main className="fc-app min-h-screen bg-slate-50 px-4 py-6 text-gray-900">
      <div className="mx-auto w-full max-w-none">
        <div className="mb-5 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/fil-conducteur-logo.svg" alt="Fil Conducteur" className="h-14 w-auto" />
            <div>
              <h1 className="sr-only">Fil Conducteur</h1>
              <p className="text-sm text-gray-600">Suivi visuel des dossiers eleves par etablissement.</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white" to="/fil-conducteur">
              Etablissements
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white" to="/fil-conducteur/import">
              Import CSV
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white" to="/fil-conducteur/historique">
              Historique
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-white" to="/fil-conducteur/configuration">
              Configuration
            </Link>
          </nav>
        </div>

        <Routes>
          <Route index element={<EtablissementSelector />} />
          <Route path="kanban/:etablissementId" element={<KanbanPage />} />
          <Route path="import" element={<CsvImportPage />} />
          <Route path="historique" element={<HistoriquePage />} />
          <Route path="configuration" element={<SettingsPage />} />
        </Routes>
      </div>
    </main>
  );
}

function EtablissementSelector() {
  const navigate = useNavigate();
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [nom, setNom] = useState("");
  const [chef, setChef] = useState("");
  const [emailChef, setEmailChef] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setEtablissements(await filConducteurApi.listEtablissements());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!nom.trim()) return;
    setError("");
    try {
      const etablissement = await filConducteurApi.createEtablissement({
        nom: nom.trim(),
        chef_etablissement: chef.trim() || null,
        email_chef_etablissement: emailChef.trim() || null,
      });
      navigate(`/fil-conducteur/kanban/${etablissement.id}`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Choisir un etablissement</h2>
          <Button variant="secondary" onClick={load} disabled={loading}>
            Actualiser
          </Button>
        </div>
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {loading ? (
          <p className="mt-4 text-sm text-gray-500">Chargement des etablissements...</p>
        ) : etablissements.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">Aucun etablissement pour le moment.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {etablissements.map((etablissement) => (
              <button
                key={etablissement.id}
                type="button"
                onClick={() => navigate(`/fil-conducteur/kanban/${etablissement.id}`)}
                className="rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="font-bold text-gray-950">{etablissement.nom}</div>
                {etablissement.chef_etablissement && <div className="mt-1 text-sm text-gray-600">{etablissement.chef_etablissement}</div>}
                {etablissement.email_chef_etablissement && <div className="mt-1 text-sm text-gray-600">{etablissement.email_chef_etablissement}</div>}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-bold">Nouvel etablissement</h2>
        <div className="space-y-4">
          <TextInput label="Nom" value={nom} onChange={(event) => setNom(event.target.value)} />
          <TextInput label="Chef d'etablissement" value={chef} onChange={(event) => setChef(event.target.value)} />
          <TextInput label="Email du chef d'etablissement" type="email" value={emailChef} onChange={(event) => setEmailChef(event.target.value)} />
          <Button className="w-full" onClick={create} disabled={!nom.trim()}>
            Creer et ouvrir
          </Button>
        </div>
      </section>
    </div>
  );
}

function KanbanPage() {
  const { etablissementId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const id = Number(etablissementId);
  const [kanban, setKanban] = useState<KanbanResponse | null>(null);
  const [etats, setEtats] = useState<EtatDossier[]>([]);
  const [editing, setEditing] = useState<FicheEleve | "new" | null>(null);
  const [dropEtatId, setDropEtatId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [kanbanData, etatsData] = await Promise.all([filConducteurApi.getKanban(id), filConducteurApi.listEtats()]);
      setKanban(sortKanban(kanbanData));
      setEtats(etatsData.sort((a, b) => a.ordre_affichage - b.ordre_affichage));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  useEffect(() => {
    const ficheId = (location.state as { ficheId?: number } | null)?.ficheId;
    if (!ficheId || !kanban) return;
    const fiche = kanban.colonnes.flatMap((colonne) => colonne.fiches).find((item) => item.id === ficheId);
    if (!fiche) return;
    setEditing(fiche);
    navigate(location.pathname, { replace: true, state: null });
  }, [kanban, location.pathname, location.state, navigate]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setEditing("new");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const moveFiche = async (ficheId: number, etatId: number) => {
    if (!kanban) return;
    const previous = kanban;
    setKanban(moveLocal(previous, ficheId, etatId));
    try {
      await filConducteurApi.moveFiche(ficheId, etatId);
    } catch (err) {
      setKanban(previous);
      setError(errorMessage(err));
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Chargement du Kanban...</p>;
  if (error && !kanban) return <StatusMessage type="error">{error}</StatusMessage>;
  if (!kanban) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button type="button" className="text-sm font-semibold text-blue-700 hover:text-blue-900" onClick={() => navigate("/fil-conducteur")}>
            ← Changer d'etablissement
          </button>
          <h2 className="mt-1 text-xl font-bold">{kanban.etablissement.nom}</h2>
          {kanban.etablissement.chef_etablissement && <p className="text-sm text-gray-600">{kanban.etablissement.chef_etablissement}</p>}
          {kanban.etablissement.email_chef_etablissement && <p className="text-sm text-gray-600">{kanban.etablissement.email_chef_etablissement}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <SearchBar currentEtablissementId={id} onOpen={(result) => navigate(`/fil-conducteur/kanban/${result.etablissement.id}`, { state: { ficheId: result.fiche.id } })} />
          <Button onClick={() => setEditing("new")}>Nouvelle fiche</Button>
        </div>
      </div>

      {error && <StatusMessage type="error">{error}</StatusMessage>}

      <div className="grid w-full gap-2 pb-4" style={{ gridTemplateColumns: `repeat(${kanban.colonnes.length}, minmax(0, 1fr))` }}>
        {kanban.colonnes.map((colonne) => (
          <section
            key={colonne.etat.id}
            onDragOver={(event) => {
              event.preventDefault();
              setDropEtatId(colonne.etat.id);
            }}
            onDragLeave={() => setDropEtatId(null)}
            onDrop={(event) => {
              event.preventDefault();
              setDropEtatId(null);
              const ficheId = Number(event.dataTransfer.getData("text/plain"));
              if (ficheId) void moveFiche(ficheId, colonne.etat.id);
            }}
            className={`min-w-0 min-h-[520px] rounded-lg border p-2 ${pastelClasses[colonne.etat.couleur]} ${dropEtatId === colonne.etat.id ? "ring-2 ring-blue-400" : ""}`}
          >
            <div className="mb-2 flex items-center justify-between gap-1">
              <h3 className="min-w-0 truncate text-xs font-bold" title={colonne.etat.nom}>
                {colonne.etat.nom}
              </h3>
              <span className="shrink-0 rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">{colonne.fiches.length}</span>
            </div>
            <div className="space-y-2">
              {colonne.fiches.map((fiche) => (
                <StudentCard
                  key={fiche.id}
                  fiche={fiche}
                  onEdit={() => setEditing(fiche)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {editing && (
        <StudentModal
          fiche={editing === "new" ? null : editing}
          etablissement={kanban.etablissement}
          etablissementId={id}
          etats={etats}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
          }}
          onDeleted={() => {
            setEditing(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function StudentCard({
  fiche,
  onEdit,
}: {
  fiche: FicheEleve;
  onEdit: () => void;
}) {
  return (
    <article
      draggable
      onDragStart={(event) => event.dataTransfer.setData("text/plain", String(fiche.id))}
      onDoubleClick={onEdit}
      className={`cursor-pointer rounded-lg border p-2 shadow-sm transition hover:shadow-md ${parcoursClass(fiche.parcours)} ${alerteClass(fiche.alerte_notification)}`}
      title="Double-cliquer pour modifier"
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0">
          <h4 className="truncate text-xs font-bold text-gray-950" title={fiche.nom_eleve}>
            {fiche.nom_eleve}
          </h4>
          <p className="mt-0.5 text-xs text-gray-600">{fiche.niveau_scolaire}</p>
        </div>
        <span className="shrink-0 text-base" title={fiche.orientation}>
          {orientationIcon(fiche.orientation)}
        </span>
      </div>
    </article>
  );
}

function StudentModal({
  fiche,
  etablissement,
  etablissementId,
  etats,
  onClose,
  onSaved,
  onDeleted,
}: {
  fiche: FicheEleve | null;
  etablissement: Etablissement;
  etablissementId: number;
  etats: EtatDossier[];
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const navigate = useNavigate();
  const defaultEtatId = fiche?.etat_id || etats.find((etat) => etat.categorie === "Visible")?.id || etats[0]?.id || 0;
  const [form, setForm] = useState<FichePayload>({
    nom_eleve: fiche?.nom_eleve || "",
    numero_dossier_mdph: fiche?.numero_dossier_mdph || "",
    date_naissance: fiche?.date_naissance || "",
    niveau_scolaire: fiche?.niveau_scolaire || "",
    parcours: fiche?.parcours || "Première demande",
    orientation: fiche?.orientation || "Ordinaire",
    date_fin_notification: fiche?.date_fin_notification || "",
    commentaire: fiche?.commentaire || "",
    etat_id: defaultEtatId,
    etablissement_id: etablissementId,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const formPrefill = {
    nom: form.nom_eleve,
    date_nais: form.date_naissance || "",
    dossier_num: form.numero_dossier_mdph || "",
    niveau: form.niveau_scolaire,
    etablissement: etablissement.nom,
    chef_etab: etablissement.chef_etablissement || "",
  };

  const persistFiche = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        numero_dossier_mdph: form.numero_dossier_mdph || null,
        date_naissance: form.date_naissance || null,
        date_fin_notification: form.date_fin_notification || null,
        commentaire: form.commentaire || null,
      };
      if (fiche) await filConducteurApi.updateFiche(fiche.id, payload);
      else await filConducteurApi.createFiche(payload);
      return true;
    } catch (err) {
      setError(errorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openForm = async (path: string, prefill: Record<string, string>) => {
    if (!(await persistFiche())) return;
    navigate(path, { state: { prefill } });
  };

  const save = async () => {
    if (await persistFiche()) onSaved();
  };

  const remove = async () => {
    if (!fiche) return;
    if (!window.confirm(`Supprimer la fiche de ${fiche.nom_eleve} ?`)) return;
    setSaving(true);
    try {
      await filConducteurApi.deleteFiche(fiche.id);
      onDeleted();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{fiche ? "Modifier la fiche" : "Nouvelle fiche"}</h2>
            <p className="text-sm text-gray-600">Les modifications sont enregistrees dans Fil Conducteur.</p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </div>
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput label="Nom complet de l'eleve" value={form.nom_eleve} onChange={(event) => setForm({ ...form, nom_eleve: event.target.value })} required />
          <TextInput
            label="Numero de dossier MDPH"
            value={form.numero_dossier_mdph || ""}
            onChange={(event) => setForm({ ...form, numero_dossier_mdph: event.target.value })}
          />
          <TextInput
            label="Date de naissance"
            type="date"
            value={form.date_naissance || ""}
            onChange={(event) => setForm({ ...form, date_naissance: event.target.value })}
          />
          <TextInput label="Niveau scolaire" value={form.niveau_scolaire} onChange={(event) => setForm({ ...form, niveau_scolaire: event.target.value })} />
          <SelectInput label="Parcours" value={form.parcours} onChange={(event) => setForm({ ...form, parcours: event.target.value as ParcoursEleve })}>
            {parcoursOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
          <SelectInput label="Orientation" value={form.orientation} onChange={(event) => setForm({ ...form, orientation: event.target.value as OrientationEleve })}>
            {orientationOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
          <TextInput
            label="Date de fin de notification"
            type="date"
            value={form.date_fin_notification || ""}
            onChange={(event) => setForm({ ...form, date_fin_notification: event.target.value })}
          />
          <SelectInput label="Etat du dossier" value={form.etat_id} onChange={(event) => setForm({ ...form, etat_id: Number(event.target.value) })}>
            {etats.map((etat) => (
              <option key={etat.id} value={etat.id}>
                {etat.nom}
              </option>
            ))}
          </SelectInput>
          <div className="sm:col-span-2">
            <TextareaInput label="Commentaire" value={form.commentaire || ""} onChange={(event) => setForm({ ...form, commentaire: event.target.value })} />
          </div>
        </div>
        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 text-sm font-semibold text-gray-800">Creer un document avec cette identite</div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              variant="secondary"
              onClick={() => openForm("/bordereau", { ...formPrefill, typedemande: form.parcours })}
              disabled={saving || !form.nom_eleve.trim() || !form.etat_id}
            >
              Bordereau
            </Button>
            <Button variant="secondary" onClick={() => openForm("/emargement", formPrefill)} disabled={saving || !form.nom_eleve.trim() || !form.etat_id}>
              Emargement
            </Button>
            <Button
              variant="secondary"
              onClick={() => openForm("/reunion-ess", { ...formPrefill, type_geva_sco: form.parcours })}
              disabled={saving || !form.nom_eleve.trim() || !form.etat_id}
            >
              Compte rendu ESS
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {fiche && (
            <Button variant="danger" onClick={remove} disabled={saving}>
              Supprimer
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button onClick={save} disabled={saving || !form.nom_eleve.trim() || !form.etat_id}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}

function SearchBar({ currentEtablissementId, onOpen }: { currentEtablissementId: number; onOpen: (result: SearchResult) => void }) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"current" | "global">("global");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError("");
      return;
    }
    const handle = window.setTimeout(async () => {
      try {
        setResults(await filConducteurApi.searchEleves(trimmed, scope === "current" ? currentEtablissementId : undefined));
        setError("");
      } catch (err) {
        setError(errorMessage(err));
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [query, scope, currentEtablissementId]);

  return (
    <div className="relative flex min-w-[300px] flex-1 gap-2">
      <input
        aria-label="Recherche eleve"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher un eleve..."
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <select
        aria-label="Perimetre de recherche"
        value={scope}
        onChange={(event) => setScope(event.target.value as "current" | "global")}
        className="rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
      >
        <option value="global">Global</option>
        <option value="current">Courant</option>
      </select>
      {(results.length > 0 || error) && (
        <div className="absolute left-0 right-0 top-12 z-20 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
          {error ? (
            <p className="px-2 py-1 text-sm text-red-700">{error}</p>
          ) : (
            results.map((result) => (
              <button
                key={result.fiche.id}
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  onOpen(result);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                <span className="font-semibold">{result.fiche.nom_eleve}</span>
                <span className="block text-gray-600">{result.etablissement.nom}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <EtablissementsSettings />
      <EtatsSettings />
      <section className="rounded-lg border border-gray-200 bg-white p-5 xl:col-span-2">
        <h2 className="text-lg font-bold">Cles API</h2>
        <StatusMessage type="info">
          Le cahier des charges prevoit la gestion des cles API, mais `openapi.yaml` ne declare pas encore les endpoints correspondants.
          L'ecran pourra etre branche des que le backend expose la creation, la liste et la revocation.
        </StatusMessage>
      </section>
    </div>
  );
}

function EtablissementsSettings() {
  const [items, setItems] = useState<Etablissement[]>([]);
  const [editing, setEditing] = useState<Etablissement | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems(await filConducteurApi.listEtablissements());
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async (item: Etablissement) => {
    try {
      await filConducteurApi.updateEtablissement(item.id, {
        nom: item.nom,
        chef_etablissement: item.chef_etablissement || null,
        email_chef_etablissement: item.email_chef_etablissement || null,
      });
      setEditing(null);
      void load();
    } catch (err) {
      if (isApiError(err) && err.status === 409) {
        const targetId = (err.payload as { existing_etablissement_id?: number } | null)?.existing_etablissement_id;
        if (targetId && window.confirm("Un etablissement portant deja ce nom existe. Confirmer la fusion sans supprimer d'eleve ?")) {
          await filConducteurApi.fusionEtablissements(item.id, targetId);
          setEditing(null);
          void load();
          return;
        }
      }
      setError(errorMessage(err));
    }
  };

  const remove = async (item: Etablissement) => {
    if (!window.confirm(`Supprimer l'etablissement ${item.nom} ?`)) return;
    try {
      await filConducteurApi.deleteEtablissement(item.id);
      void load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold">Etablissements</h2>
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-3">
            {editing?.id === item.id ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput label="Nom" value={editing.nom} onChange={(event) => setEditing({ ...editing, nom: event.target.value })} />
                <TextInput
                  label="Chef d'etablissement"
                  value={editing.chef_etablissement || ""}
                  onChange={(event) => setEditing({ ...editing, chef_etablissement: event.target.value })}
                />
                <TextInput
                  label="Email du chef d'etablissement"
                  type="email"
                  value={editing.email_chef_etablissement || ""}
                  onChange={(event) => setEditing({ ...editing, email_chef_etablissement: event.target.value })}
                />
                <div className="flex gap-2 sm:col-span-2">
                  <Button onClick={() => void save(editing)}>Enregistrer</Button>
                  <Button variant="secondary" onClick={() => setEditing(null)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{item.nom}</div>
                  {item.chef_etablissement && <div className="text-sm text-gray-600">{item.chef_etablissement}</div>}
                  {item.email_chef_etablissement && <div className="text-sm text-gray-600">{item.email_chef_etablissement}</div>}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditing(item)}>
                    Modifier
                  </Button>
                  <Button variant="danger" onClick={() => void remove(item)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EtatsSettings() {
  const [items, setItems] = useState<EtatDossier[]>([]);
  const [draft, setDraft] = useState({ nom: "", couleur: "bleu" as CouleurPastel, ordre_affichage: 1, categorie: "Visible" as EtatCategorie });
  const [editing, setEditing] = useState<EtatDossier | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setItems((await filConducteurApi.listEtats()).sort((a, b) => a.ordre_affichage - b.ordre_affichage));
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!draft.nom.trim()) return;
    const lastOrder = items.reduce((max, etat) => Math.max(max, etat.ordre_affichage), 0);
    try {
      await filConducteurApi.createEtat({ ...draft, ordre_affichage: lastOrder + 1 });
      setDraft({ nom: "", couleur: "bleu", ordre_affichage: lastOrder + 2, categorie: "Visible" });
      void load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const save = async (etat: EtatDossier) => {
    try {
      await filConducteurApi.updateEtat(etat.id, {
        nom: etat.nom,
        couleur: etat.couleur,
        ordre_affichage: etat.ordre_affichage,
        categorie: etat.categorie,
      });
      setEditing(null);
      void load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (etat: EtatDossier) => {
    if (!window.confirm(`Supprimer l'etat ${etat.nom} ?`)) return;
    try {
      await filConducteurApi.deleteEtat(etat.id);
      void load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const moveEtat = async (etatId: number, direction: -1 | 1) => {
    const orderedItems = [...items].sort((a, b) => a.ordre_affichage - b.ordre_affichage || a.id - b.id);
    const index = orderedItems.findIndex((etat) => etat.id === etatId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= orderedItems.length) return;

    const reordered = [...orderedItems];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const normalized = reordered.map((etat, itemIndex) => ({ ...etat, ordre_affichage: itemIndex + 1 }));

    setMovingId(etatId);
    setItems(normalized);
    setError("");
    try {
      await Promise.all(normalized.map((etat) => filConducteurApi.updateEtat(etat.id, { ordre_affichage: etat.ordre_affichage })));
      void load();
    } catch (err) {
      setError(errorMessage(err));
      void load();
    } finally {
      setMovingId(null);
    }
  };

  const orderedItems = [...items].sort((a, b) => a.ordre_affichage - b.ordre_affichage || a.id - b.id);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold">Etats du dossier</h2>
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <TextInput label="Nouvel etat" value={draft.nom} onChange={(event) => setDraft({ ...draft, nom: event.target.value })} />
        <SelectInput label="Couleur" value={draft.couleur} onChange={(event) => setDraft({ ...draft, couleur: event.target.value as CouleurPastel })}>
          {couleurs.map((couleur) => (
            <option key={couleur} value={couleur}>
              {couleur}
            </option>
          ))}
        </SelectInput>
        <div className="flex items-end">
          <Button className="w-full" onClick={create} disabled={!draft.nom.trim()}>
            Ajouter
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {orderedItems.map((etat, index) => (
          <div key={etat.id} className={`rounded-lg border p-3 ${pastelClasses[etat.couleur]}`}>
            {editing?.id === etat.id ? (
              <div className="grid gap-3 sm:grid-cols-5">
                <TextInput label="Nom" value={editing.nom} onChange={(event) => setEditing({ ...editing, nom: event.target.value })} />
                <SelectInput label="Couleur" value={editing.couleur} onChange={(event) => setEditing({ ...editing, couleur: event.target.value as CouleurPastel })}>
                  {couleurs.map((couleur) => (
                    <option key={couleur} value={couleur}>
                      {couleur}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  label="Ordre"
                  type="number"
                  value={editing.ordre_affichage}
                  onChange={(event) => setEditing({ ...editing, ordre_affichage: Number(event.target.value) })}
                />
                <SelectInput label="Categorie" value={editing.categorie} onChange={(event) => setEditing({ ...editing, categorie: event.target.value as EtatCategorie })}>
                  {categorieOptions.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </SelectInput>
                <div className="flex items-end gap-2">
                  <Button onClick={() => void save(editing)}>OK</Button>
                  <Button variant="secondary" onClick={() => setEditing(null)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold">{etat.nom}</div>
                  <div className="text-sm">Ordre {etat.ordre_affichage} · {etat.categorie}</div>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="secondary" onClick={() => void moveEtat(etat.id, -1)} disabled={index === 0 || movingId !== null}>
                    Monter
                  </Button>
                  <Button variant="secondary" onClick={() => void moveEtat(etat.id, 1)} disabled={index === orderedItems.length - 1 || movingId !== null}>
                    Descendre
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(etat)}>
                    Modifier
                  </Button>
                  <Button variant="danger" onClick={() => void remove(etat)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CsvImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [etats, setEtats] = useState<EtatDossier[]>([]);
  const [etatDefautId, setEtatDefautId] = useState<number | undefined>();
  const [updateExisting, setUpdateExisting] = useState(true);
  const [report, setReport] = useState<ImportCsvResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void filConducteurApi.listEtats().then(setEtats).catch((err) => setError(errorMessage(err)));
  }, []);

  const onFile = async (nextFile: File | null) => {
    setFile(nextFile);
    setReport(null);
    setError("");
    if (!nextFile) {
      setPreview([]);
      return;
    }
    const text = await nextFile.text();
    setPreview(parseCsvPreview(text).slice(0, 6));
  };

  const importFile = async () => {
    if (!file) return;
    try {
      setReport(await filConducteurApi.importCsv(file, etatDefautId, updateExisting));
      setError("");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const headers = preview[0] || [];
  const missing = ["nom", "niveau", "etablissement"].filter(
    (needle) => !headers.some((header) => header.toLowerCase().includes(needle)),
  );

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-bold">Import CSV Airtable</h2>
      <p className="mt-1 text-sm text-gray-600">Le fichier est envoye au endpoint `POST /eleves/import-csv` apres controle visuel des colonnes.</p>
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
        <h3 className="font-bold">Format attendu du fichier CSV</h3>
        <p className="mt-2">
          La premiere ligne doit contenir les noms de colonnes. Une ligne correspond a une fiche eleve. Le separateur peut etre un point-virgule ou une virgule.
        </p>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <div className="font-semibold">Colonnes obligatoires</div>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li><code>nom</code> : nom complet de l'eleve</li>
              <li><code>niveau</code> : niveau scolaire</li>
              <li><code>etablissement</code> : nom de l'etablissement</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Colonnes optionnelles</div>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li><code>numero_dossier_mdph</code> : numero de dossier MDPH</li>
              <li><code>date_naissance</code> : date au format <code>AAAA-MM-JJ</code></li>
              <li><code>date_fin_notification</code> : date au format <code>AAAA-MM-JJ</code></li>
              <li><code>commentaire</code> : commentaire libre</li>
              <li><code>etat</code> : nom de l'etat du dossier, sinon l'etat par defaut est utilise</li>
              <li><code>parcours</code> : <code>Premiere demande</code> ou <code>Reexamen</code>, sinon <code>Reexamen</code></li>
              <li><code>orientation</code> : <code>Ordinaire</code> ou <code>Dispositif</code>, sinon <code>Ordinaire</code></li>
            </ul>
          </div>
        </div>
        <div className="mt-3 overflow-auto rounded border border-blue-200 bg-white p-3 font-mono text-xs text-blue-950">
          nom;niveau;parcours;orientation;etablissement;numero_dossier_mdph;date_naissance;date_fin_notification;commentaire<br />
          Nora Dupont;6e;Premiere demande;Ordinaire;College Jean Monnet;72-2025-00123;2013-04-12;2026-08-31;Dossier complet
        </div>
      </div>
      {error && <div className="mt-4"><StatusMessage type="error">{error}</StatusMessage></div>}
      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => void onFile(event.target.files?.[0] || null)}
            className="block w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm"
          />
          {preview.length > 0 && (
            <div className="mt-4 overflow-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <tbody className="divide-y divide-gray-100">
                  {preview.map((row, index) => (
                    <tr key={index} className={index === 0 ? "bg-gray-50 font-bold" : "bg-white"}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="whitespace-nowrap px-3 py-2 text-gray-800">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {file && missing.length > 0 && (
            <div className="mt-4">
              <StatusMessage type="error">Colonnes possiblement manquantes: {missing.join(", ")}.</StatusMessage>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <SelectInput label="Etat par defaut" value={etatDefautId || ""} onChange={(event) => setEtatDefautId(Number(event.target.value) || undefined)}>
            <option value="">Aucun</option>
            {etats.map((etat) => (
              <option key={etat.id} value={etat.id}>
                {etat.nom}
              </option>
            ))}
          </SelectInput>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={updateExisting} onChange={(event) => setUpdateExisting(event.target.checked)} />
            Autoriser la mise a jour des fiches existantes
          </label>
          <Button className="w-full" onClick={importFile} disabled={!file || missing.length > 0}>
            Importer
          </Button>
        </div>
      </div>
      {report && (
        <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold">Rapport d'import</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Metric label="Lignes lues" value={report.lignes_lues} />
            <Metric label="Creees" value={report.fiches_creees} />
            <Metric label="Mises a jour" value={report.fiches_mises_a_jour} />
            <Metric label="Etablissements" value={report.etablissements_crees} />
            <Metric label="Rejetees" value={report.lignes_rejetees} />
            <Metric label="Existantes" value={report.fiches_existantes_non_modifiees || 0} />
          </div>
          {report.erreurs.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-red-700">
              {report.erreurs.map((err) => (
                <li key={`${err.ligne}-${err.message}`}>Ligne {err.ligne}: {err.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function HistoriquePage() {
  const [items, setItems] = useState<Historique[]>([]);
  const [fiches, setFiches] = useState<FicheEleve[]>([]);
  const [ficheId, setFicheId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (nextFicheId = ficheId) => {
    setLoading(true);
    setError("");
    try {
      const [historiques, allFiches] = await Promise.all([
        filConducteurApi.listHistoriques(nextFicheId),
        filConducteurApi.listFiches(),
      ]);
      setItems(historiques);
      setFiches(allFiches.sort((a, b) => a.nom_eleve.localeCompare(b.nom_eleve, "fr")));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const ficheNames = new Map(fiches.map((fiche) => [fiche.id, fiche.nom_eleve]));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Historique des modifications</h2>
          <p className="mt-1 text-sm text-gray-600">Journal renvoye par `GET /historiques`.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <SelectInput
            label="Filtrer par fiche"
            value={ficheId || ""}
            onChange={(event) => {
              const next = Number(event.target.value) || undefined;
              setFicheId(next);
              void load(next);
            }}
          >
            <option value="">Toutes les fiches</option>
            {fiches.map((fiche) => (
              <option key={fiche.id} value={fiche.id}>
                {fiche.nom_eleve}
              </option>
            ))}
          </SelectInput>
          <Button variant="secondary" onClick={() => void load()} disabled={loading}>
            Actualiser
          </Button>
        </div>
      </div>

      {error && <div className="mt-4"><StatusMessage type="error">{error}</StatusMessage></div>}
      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Chargement de l'historique...</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">Aucune modification a afficher.</p>
      ) : (
        <div className="mt-5 overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-bold uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Fiche</th>
                <th className="px-3 py-2">Modification</th>
                <th className="px-3 py-2">Ancienne valeur</th>
                <th className="px-3 py-2">Nouvelle valeur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">{formatDateTime(item.created_at)}</td>
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {item.fiche_eleve_id ? ficheNames.get(item.fiche_eleve_id) || `Fiche ${item.fiche_eleve_id}` : "-"}
                  </td>
                  <td className="px-3 py-2 text-gray-700">{item.type_modification}</td>
                  <td className="px-3 py-2 text-gray-600">{item.ancienne_valeur || "-"}</td>
                  <td className="px-3 py-2 text-gray-900">{item.nouvelle_valeur || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-3 text-center">
      <div className="text-xl font-bold text-gray-950">{value}</div>
      <div className="text-xs font-semibold uppercase text-gray-500">{label}</div>
    </div>
  );
}

function sortKanban(kanban: KanbanResponse): KanbanResponse {
  return {
    ...kanban,
    colonnes: [...kanban.colonnes]
      .sort((a, b) => a.etat.ordre_affichage - b.etat.ordre_affichage)
      .map((colonne) => ({
        ...colonne,
        fiches: [...colonne.fiches].sort((a, b) => a.nom_eleve.localeCompare(b.nom_eleve, "fr")),
      })),
  };
}

function moveLocal(kanban: KanbanResponse, ficheId: number, etatId: number): KanbanResponse {
  let moved: FicheEleve | null = null;
  const colonnes = kanban.colonnes.map((colonne) => {
    const fiches = colonne.fiches.filter((fiche) => {
      if (fiche.id !== ficheId) return true;
      moved = { ...fiche, etat_id: etatId };
      return false;
    });
    return { ...colonne, fiches };
  });
  if (!moved) return kanban;
  return sortKanban({
    ...kanban,
    colonnes: colonnes.map((colonne) => (colonne.etat.id === etatId ? { ...colonne, fiches: [...colonne.fiches, moved as FicheEleve] } : colonne)),
  });
}

function parseCsvPreview(text: string) {
  return text
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(/;|,/).map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Erreur inattendue.";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
