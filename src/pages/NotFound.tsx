import { Home, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import ServiceSearch from '../components/home/ServiceSearch';
import { useBarangayScope, withBarangayScope } from '../hooks/useBarangayScope';

export default function NotFound() {
  const { t } = useTranslation();
  const { preferredBarangay } = useBarangayScope();
  const barangaySlug = preferredBarangay?.slug ?? '';
  const searchHref = barangaySlug
    ? withBarangayScope('/search', barangaySlug)
    : '/search';

  return (
    <>
      <SEO
        title={t('discovery.notFound.seoTitle')}"
        description={t('discovery.notFound.seoDescription')}
        noIndex
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">404</div>
          <Heading>{t('discovery.notFound.title')}</Heading>
          <p className="max-w-2xl text-gray-700">
            {t('discovery.notFound.description')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="brand-btn-primary">
              <Home className="h-4 w-4" /> {t('discovery.notFound.home')}
            </Link>
            <Link to={searchHref} className="brand-btn-secondary">
              <Search className="h-4 w-4" /> {t('discovery.notFound.search')}
            </Link>
          </div>
          <div className="mt-9">
            <ServiceSearch
              scope="site"
              title={t('discovery.notFound.searchTitle')}
              placeholder={t('discovery.notFound.placeholder')}
              barangaySlug={barangaySlug}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
