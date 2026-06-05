const items = [
  '100% web — aucune installation',
  'Mobile, tablette, ordinateur',
  'Accès à vie',
  'Mis à jour en continu',
];

export default function ReassuranceBar() {
  return (
    <section className="bg-editorial-noir text-editorial-cream py-6">
      <div className="container mx-auto px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-editorial-olive hidden md:inline-block" />
              )}
              <span className="font-light tracking-wide">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
