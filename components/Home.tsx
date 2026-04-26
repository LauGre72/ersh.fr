import { Link } from "react-router-dom";
import logoComplet from "../assets/logo-complet.png";
import logoCarre from "../assets/logo-carre.png";

const principles = [
  {
    title: "Accompagner",
    text: "Retrouver rapidement un élève, son établissement, ses ESS et ses documents.",
    color: "#2A6F97",
  },
  {
    title: "Coordonner",
    text: "Travailler depuis le Kanban partagé par établissement et état de dossier.",
    color: "#6FBF73",
  },
  {
    title: "Assurer le parcours",
    text: "Suivre les échéances, les notifications et les étapes à sécuriser.",
    color: "#FF7F7F",
  },
  {
    title: "Valoriser les potentiels",
    text: "Garder les formulaires utiles accessibles depuis la fiche élève.",
    color: "#FFC857",
  },
];

const quickActions = [
  {
    to: "/fil-conducteur",
    title: "Ouvrir le Kanban",
    desc: "Entrée recommandée : établissement, fiche élève, puis document.",
    color: "#2A6F97",
    primary: true,
  },
  {
    to: "/fil-conducteur/import",
    title: "Importer un CSV",
    desc: "Créer ou mettre à jour des fiches élèves par établissement.",
    color: "#4CC9C9",
  },
  {
    to: "/fil-conducteur/historique",
    title: "Consulter l'historique",
    desc: "Vérifier les modifications et les actions enregistrées.",
    color: "#9D8DF1",
  },
];

const standaloneForms = [
  { to: "/bordereau", title: "Bordereau MDPH" },
  { to: "/emargement", title: "Feuille d'émargement" },
  { to: "/reunion-ess", title: "Compte rendu ESS" },
];

function Home() {
  return (
    <main className="min-h-screen bg-[#F7FAFC] px-4 py-8 text-[#153A5B]">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <img src={logoComplet} alt="ERSH.fr" className="h-auto w-full max-w-xl" />
            <h1 className="mt-8 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              Kanban de suivi des dossiers élèves
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">
              ERSH.fr centralise le suivi par établissement : choisissez le Kanban, ouvrez la fiche élève, puis générez les documents depuis ce dossier.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/fil-conducteur"
                className="inline-flex items-center justify-center rounded-lg bg-[#2A6F97] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#235D80]"
              >
                Ouvrir le Kanban
              </Link>
              <Link
                to="/fil-conducteur/import"
                className="inline-flex items-center justify-center rounded-lg border border-[#2A6F97]/25 bg-white px-5 py-3 text-base font-bold text-[#153A5B] transition hover:border-[#2A6F97] hover:bg-[#E6EDF2]"
              >
                Importer les fiches
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#D6E2EA] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4 border-b border-[#E6EDF2] pb-4">
              <img src={logoCarre} alt="" className="h-16 w-16 rounded-lg" />
              <div>
                <h2 className="text-xl font-bold">Parcours recommandé</h2>
                <p className="text-sm text-slate-600">Le dossier élève devient le point d'entrée des actions.</p>
              </div>
            </div>
            <ol className="mt-5 space-y-4">
              <Step number="1" title="Établissement" text="Choisir l'établissement concerné." color="#2A6F97" />
              <Step number="2" title="Élève" text="Ouvrir ou créer la fiche dans le Kanban." color="#6FBF73" />
              <Step number="3" title="Document" text="Générer bordereau, émargement ou compte rendu depuis la fiche." color="#FF7F7F" />
              <Step number="4" title="Suivi" text="Retrouver les ESS, notes et échéances dans le dossier." color="#FFC857" />
            </ol>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <ActionTile key={action.to} {...action} />
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-[#D6E2EA] bg-white p-5">
            <h2 className="text-xl font-bold">Repères ERSH.fr</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {principles.map((principle) => (
                <div key={principle.title} className="flex gap-3">
                  <div className="mt-1 h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: principle.color }} />
                  <div>
                    <h3 className="font-bold uppercase tracking-wide" style={{ color: principle.color }}>
                      {principle.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{principle.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#D6E2EA] bg-white p-5">
            <h2 className="text-xl font-bold">Formulaires hors dossier</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              À utiliser seulement lorsqu'aucune fiche élève n'existe encore dans le Kanban.
            </p>
            <div className="mt-4 space-y-2">
              {standaloneForms.map((form) => (
                <Link
                  key={form.to}
                  to={form.to}
                  className="block rounded-lg border border-[#E6EDF2] px-4 py-3 text-sm font-bold text-[#153A5B] transition hover:border-[#2A6F97] hover:bg-[#F7FAFC]"
                >
                  {form.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ number, title, text, color }: { number: string; title: string; text: string; color: string }) {
  return (
    <li className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ backgroundColor: color }}>
        {number}
      </div>
      <div>
        <h3 className="font-bold text-[#153A5B]">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </li>
  );
}

function ActionTile({
  to,
  title,
  desc,
  color,
  primary = false,
}: {
  to: string;
  title: string;
  desc: string;
  color: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`rounded-lg border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        primary ? "border-[#2A6F97] bg-[#2A6F97] text-white" : "border-[#D6E2EA] bg-white text-[#153A5B]"
      }`}
    >
      <div className="mb-4 h-2 w-16 rounded-full" style={{ backgroundColor: primary ? "#FFC857" : color }} />
      <h2 className="text-lg font-bold">{title}</h2>
      <p className={`mt-2 text-sm leading-6 ${primary ? "text-white/90" : "text-slate-600"}`}>{desc}</p>
    </Link>
  );
}

export default Home;
