import { ArrowRight, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

export type CivicRelationshipTone = 'primary' | 'secondary' | 'neutral';

export interface CivicRelationshipLinkItem {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon?: ReactNode;
}

interface CivicRelationshipLinksProps {
  label: string;
  items: CivicRelationshipLinkItem[];
  tone?: CivicRelationshipTone;
  framed?: boolean;
  className?: string;
}

const toneClasses: Record<CivicRelationshipTone, string> = {
  primary:
    'border-primary-200 bg-primary-50 text-primary-800 hover:border-primary-400',
  secondary:
    'border-secondary-200 bg-secondary-50 text-secondary-900 hover:border-secondary-400',
  neutral:
    'border-gray-200 bg-white text-gray-800 hover:border-primary-300 hover:text-primary-800',
};

const frameClasses: Record<CivicRelationshipTone, string> = {
  primary: 'border-primary-100 bg-primary-50',
  secondary: 'border-secondary-100 bg-secondary-50',
  neutral: 'border-gray-200 bg-white',
};

export const civicRelationshipOwnerLabel = (owner: string) => {
  switch (owner) {
    case 'statistics':
      return 'Statistics';
    case 'legislation':
      return 'Legislation';
    case 'integrity':
      return 'Integrity';
    case 'reports':
      return 'Report';
    case 'place-registry':
      return 'Place';
    case 'area-registry':
      return 'Area';
    case 'barangays':
      return 'Barangay';
    case 'services':
      return 'Service';
    case 'accountability':
      return 'Accountability';
    case 'city-monitor':
      return 'City Monitor';
    case 'public-records':
      return 'Public record';
    case 'budgets':
      return 'Budget';
    case 'officials':
      return 'Official';
    case 'elections':
      return 'Election record';
    case 'timeline':
      return 'Calendar entry';
    case 'ecosystem':
      return 'External civic resource';
    default:
      return 'Related record';
  }
};

export default function CivicRelationshipLinks({
  label,
  items,
  tone = 'primary',
  framed = false,
  className = '',
}: CivicRelationshipLinksProps) {
  if (!items.length) return null;

  return (
    <div
      className={
        (framed
          ? 'rounded-2xl border p-5 ' + frameClasses[tone] + ' '
          : '') + className
      }
    >
      <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-gray-600">
        {label}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map(item => {
          const classes =
            'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition ' +
            toneClasses[tone];

          if (item.external) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={classes}
              >
                {item.icon}
                {item.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            );
          }

          return (
            <Link key={item.id} to={item.href} className={classes}>
              {item.icon}
              {item.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
