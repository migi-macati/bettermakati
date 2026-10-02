import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import ServiceSearch from '../components/home/ServiceSearch';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { useBarangayScope } from '../hooks/useBarangayScope';

export default function Search() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const { barangaySlug } = useBarangayScope();

  return (
    <>
      <SEO
        title={t('discovery.search.seoTitle')}
        description={t('discovery.search.seoDescription')}
        noIndex
      />
      <Section className="bg-[#fffdf8]">
        <div className="mx-auto max-w-3xl">
          <div className="section-eyebrow">{t('discovery.search.eyebrow')}</div>
          <Heading>{t('discovery.search.title')}</Heading>
          <p className="mb-6 text-gray-600">
            {t('discovery.search.description')}
          </p>
          <ServiceSearch
            scope="site"
            title={t('discovery.search.searchTitle')}
            placeholder={t('discovery.search.placeholder')}
            initialQuery={initialQuery}
            barangaySlug={barangaySlug}
          />
        </div>
      </Section>
    </>
  );
}
