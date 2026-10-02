import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import CommunityToolsGrid from '../components/community/CommunityToolsGrid';
import SEO from '../components/SEO';

export default function CommunityTools() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('discovery.communityTools.seoTitle')}
        description={t('discovery.communityTools.seoDescription')}
      />
      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('discovery.communityTools.eyebrow')}</div>
        <Heading>{t('discovery.communityTools.title')}</Heading>
        <p className="mt-2 max-w-3xl text-gray-600">
          {t('discovery.communityTools.description')}
        </p>

        <div className="mt-7">
          <CommunityToolsGrid />
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-primary-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-gray-500">{t('discovery.communityTools.statusLabel')}</span>
            <span className="tool-status tool-status-live">{t('discovery.status.Live')}</span>
            <span className="tool-status tool-status-researching">{t('discovery.status.Researching')}</span>
            <span className="tool-status tool-status-planned">{t('discovery.status.Planned')}</span>
          </div>
          <Link to="/get-involved?type=idea" className="brand-btn-secondary">
            {t('discovery.communityTools.suggest')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
