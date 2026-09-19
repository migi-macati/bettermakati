export interface SectionNavItem {
  label: string;
  href: string;
}

export default function SectionNav({
  items,
  label = 'On this page',
}: {
  items: SectionNavItem[];
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2"
    >
      <div className="flex min-w-max gap-1">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-bold text-primary-800 hover:bg-primary-50"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
