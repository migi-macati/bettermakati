import React from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += '/' + segment;
      const isLast = index === pathSegments.length - 1;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });
    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className={className} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm text-gray-600">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href || item.label} className="flex items-center gap-1">
            {index === 0 && <Home className="h-4 w-4" aria-hidden="true" />}
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:text-primary-600 transition-colors duration-200"
              >
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
