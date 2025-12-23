export default function AppTile({
  href, title, desc, explain,
}: {
  href: string;
  title: string;
  desc: string;
  explain: string;
}) {
  return (
    <a href={href} className="block rounded-2xl border p-4 hover:shadow-lg transition bg-white">
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-gray-700">{desc}</div>

      <div className="mt-3 text-xs text-gray-600 leading-relaxed">
        {explain}
      </div>

      <div className="mt-4">
        <span className="inline-block rounded-lg border px-3 py-1 text-sm">
          Ouvrir l’application
        </span>
      </div>
    </a>
  );
}
