export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="font-semibold">ERSH – Portail</div>
        <nav className="hidden md:flex gap-4 text-sm">
          <a className="hover:underline" href="https://bordereau.ersh.fr">Bordereau</a>
          <a className="hover:underline" href="https://emargement.ersh.fr">Émargement</a>		  
          <a className="hover:underline" href="https://gevasco.ersh.fr">GEVA-sco</a>
		  <a className="hover:underline" href="https://lpi.ersh.fr">LPI</a>
		  <a className="hover:underline" href="https://kanban.ersh.fr">Kanban</a>
        </nav>
      </div>
    </header>
  );
}
