import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FileCheck2, MessageSquareText, Activity } from 'lucide-react';

/** A consistent route back to evidence and page-specific corrections. */
export default function PageHelp() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  if (pathname === '/get-involved' || pathname === '/contact') return null;
  const correction =
    '/get-involved?type=correction&subject=' +
    encodeURIComponent('Correction: ' + pathname) +
    '#submission';
  return (
    <aside
      className="page-help border-t border-primary-100 bg-primary-50"
      aria-label={t('pageHelp.label')}
    >
      <div className="container px-5 py-7 md:px-6 lg:px-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-bold text-primary-900">{t('pageHelp.title')}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">
            {t('pageHelp.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link to={correction} className="brand-btn-primary">
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
            {t('pageHelp.correction')}
          </Link>
          <Link to="/records" className="brand-btn-secondary">
            <FileCheck2 className="h-4 w-4" aria-hidden="true" />
            {t('pageHelp.records')}
          </Link>
          <Link to="/status" className="brand-btn-secondary">
            <Activity className="h-4 w-4" aria-hidden="true" />
            {t('pageHelp.coverage')}
          </Link>
        </div>
      </div>
    </aside>
  );
}
