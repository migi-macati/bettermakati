import { Link } from 'react-router';
import { withBarangayScope } from '../../hooks/useBarangayScope';

export default function BarangayLocalNav({ slug }: { slug: string }) {
  const items = [
    { label: 'Overview', href: '/barangays/' + slug },
    { label: 'Services', href: withBarangayScope('/services', slug) },
    { label: 'Government', href: '/barangays/' + slug + '#representation' },
    { label: 'Projects & money', href: withBarangayScope('/projects-budget', slug) },
    { label: 'Accountability', href: withBarangayScope('/accountability', slug) },
    { label: 'Map & reports', href: withBarangayScope('/civic-map', slug) },
    { label: 'Participate', href: withBarangayScope('/participate', slug) },
    { label: 'Statistics', href: withBarangayScope('/statistics', slug) },
  ];

  return (
    <nav
      aria-label="Barangay local navigation"
      className="mt-5 overflow-x-auto rounded-2xl border border-primary-100 bg-white"
    >
      <div className="flex min-w-max items-center gap-1 p-2">
        {items.map(item => (
          <Link
            key={item.label}
            to={item.href}
            className="inline-flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-800"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
