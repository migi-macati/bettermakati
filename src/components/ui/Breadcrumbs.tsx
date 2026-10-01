import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  tone?: 'light' | 'dark';
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  tone = 'light',
}) => {
  const location = useLocation();
  const { t } = useTranslation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: t('breadcrumbs.home'), href: '/' }];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment;
      const isLast = index === pathSegments.length - 1;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label, href: isLast ? undefined : currentPath });
    });
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();
  const isDark = tone === 'dark';

  return (
    <nav className={`bm-breadcrumbs ${className}`} aria-label={t('breadcrumbs.label')}>
      <ol className={'bm-breadcrumb-list flex items-center gap-x-1 text-sm ' + (isDark ? 'text-primary-100' : 'text-gray-600')}>
        {breadcrumbItems.map((item, index) => {
          const isCurrent = index === breadcrumbItems.length - 1;
          return (
            <li key={item.href || item.label} className="flex min-w-0 shrink-0 items-center gap-1">
              {index === 0 && <Home className={'h-4 w-4 ' + (isDark ? 'text-primary-200' : 'text-gray-500')} aria-hidden="true" />}
              {index > 0 && <ChevronRight className={'h-4 w-4 ' + (isDark ? 'text-primary-300' : 'text-gray-400')} aria-hidden="true" />}
              {!isCurrent && item.href ? (
                <Link to={item.href} className={'inline-flex min-h-11 items-center transition-colors duration-200 ' + (isDark ? 'hover:text-white' : 'hover:text-primary-600')}>
                  {item.label}
                </Link>
              ) : (
                <span className={'bm-breadcrumb-current max-w-[18rem] truncate sm:max-w-[28rem] ' + (isDark ? 'font-semibold text-white' : 'font-medium text-gray-900')} aria-current={isCurrent ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
