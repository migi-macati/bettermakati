import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Database,
  ExternalLink,
  Eye,
  FileSearch,
  Gauge,
  MessagesSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import { accountabilityCoverageGaps, accountabilityEntries } from '../data/accountability';
import { barangayCoverageGaps, barangayCoverageSummary, barangayProfilesReviewed } from '../data/barangays';
import { electedOfficials } from '../data/electedOfficials';
import {
  doctrineFoundations,
  doctrinePrinciples,
  doctrineReviewed,
  doctrineStatusLabel,
} from '../data/openGovernmentDoctrine';
import { searchIndex } from '../data/searchIndex';
import { cityMonitorRecords, cityMonitorSources } from '../data/cityMonitor';
import { serviceDirectory } from '../data/serviceDirectory';
import { governmentServiceOffices } from '../data/governmentServiceOffices';
import {
  detailedServiceGuideCount,
  serviceGuideDetails,
  verifiedServiceGuideCount,
} from '../data/serviceGuideDetails';

interface SourceWatchRun {
  checkedAt: string;
  changed: Array<{ id: string; label: string; url: string }>;
  failed: Array<{ id: string; label: string; url: string; statusCode?: number | null }>;
  newBaselines: Array<{ id: string; label: string; url: string }>;
}

interface SourceWatchState {
  checkedAt?: string | null;
  cadence?: string | null;
  summary?: {
    checked: number;
    ok: number;
    failed: number;
    changed: number;
    newBaselines: number;
    reachabilityOnly?: number;
  };
  sources?: Array<{
    id: string;
    cadence: 'daily' | 'weekly' | 'monthly';
    monitoringMode: 'content-hash' | 'reachability';
    status: 'ok' | 'http-error' | 'unreachable' | 'not-checked';
  }>;
}

interface PageAuditRow {
  path: string;
  label: string;
  status: 'reviewed' | 'partial';
  reviewedAt: string;
  checks: string[];
  gaps: string[];
}

interface PageFreshnessSignal {
  key: string;
  sourceId: string;
  label: string;
  signalLabel: string;
  detectedAt?: string | null;
}

interface PageFreshnessRow {
  path: string;
  label: string;
  editorialStatus: 'reviewed' | 'partial';
  reviewedAt: string;
  freshnessStatus: 'current' | 'needs-review';
  needsReview: boolean;
  dependencySignals: PageFreshnessSignal[];
  latestDependencySignalAt?: string | null;
}

interface PageFreshnessState {
  generatedAt?: string | null;
  summary: {
    pages: number;
    current: number;
    needsReview: number;
    untrackedAffectedPages: number;
  };
  pages: PageFreshnessRow[];
  untrackedAffectedPages: Array<{
    path: string;
    freshnessStatus: 'needs-review-untracked';
    dependencySignals: PageFreshnessSignal[];
  }>;
}

interface FreshnessReviewSummary {
  generatedAt?: string | null;
  summary: {
    open: number;
    contentChanged: number;
    failed: number;
    manualReview: number;
    affectedPages: number;
  };
}

interface CommunityInput {
  number: number;
  title: string;
  state: 'open' | 'closed';
  url: string;
  updatedAt: string;
  comments: number;
  kind: string;
}

export default function ProjectStatus() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-PH';
  const [sourceRuns, setSourceRuns] = useState<SourceWatchRun[]>([]);
  const [sourceState, setSourceState] = useState<SourceWatchState>({});
  const [communityInput, setCommunityInput] = useState<CommunityInput[]>([]);
  const [sourceFeedFailed, setSourceFeedFailed] = useState(false);
  const [inputFeedFailed, setInputFeedFailed] = useState(false);
  const [monitorRuns, setMonitorRuns] = useState<SourceWatchRun[]>([]);
  const [monitorFeedFailed, setMonitorFeedFailed] = useState(false);
  const [pageAudit, setPageAudit] = useState<PageAuditRow[]>([]);
  const [pageFreshness, setPageFreshness] = useState<PageFreshnessState>({
    summary: { pages: 0, current: 0, needsReview: 0, untrackedAffectedPages: 0 },
    pages: [],
    untrackedAffectedPages: [],
  });
  const [freshnessReview, setFreshnessReview] = useState<FreshnessReviewSummary>({
    summary: { open: 0, contentChanged: 0, failed: 0, manualReview: 0, affectedPages: 0 },
  });
  const [pageAuditFailed, setPageAuditFailed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [historyResponse, stateResponse] = await Promise.all([
          fetch('/source-watch-history.json', { cache: 'no-store' }),
          fetch('/source-watch-state.json', { cache: 'no-store' }),
        ]);
        const history = await historyResponse.json();
        const state = await stateResponse.json();
        if (historyResponse.ok && Array.isArray(history.runs)) setSourceRuns(history.runs);
        else setSourceFeedFailed(true);
        if (stateResponse.ok && Array.isArray(state.sources)) setSourceState(state);
        else setSourceFeedFailed(true);
      } catch {
        setSourceFeedFailed(true);
      }

      try {
        const response = await fetch('/city-monitor-source-history.json', { cache: 'no-store' });
        const data = await response.json();
        if (response.ok && Array.isArray(data.runs)) setMonitorRuns(data.runs);
        else setMonitorFeedFailed(true);
      } catch {
        setMonitorFeedFailed(true);
      }

      try {
        const [auditResponse, freshnessResponse, reviewResponse] = await Promise.all([
          fetch('/page-audit.json', { cache: 'no-store' }),
          fetch('/page-freshness-state.json', { cache: 'no-store' }),
          fetch('/freshness-review-queue.json', { cache: 'no-store' }),
        ]);
        const auditData = await auditResponse.json();
        const freshnessData = await freshnessResponse.json();
        const reviewData = await reviewResponse.json();

        if (auditResponse.ok && Array.isArray(auditData)) setPageAudit(auditData);
        else setPageAuditFailed(true);

        if (freshnessResponse.ok && Array.isArray(freshnessData.pages) && freshnessData.summary) {
          setPageFreshness(freshnessData);
        } else {
          setPageAuditFailed(true);
        }

        if (reviewResponse.ok && reviewData.summary) {
          setFreshnessReview(reviewData);
        } else {
          setPageAuditFailed(true);
        }
      } catch {
        setPageAuditFailed(true);
      }

      try {
        const response = await fetch('/api/community-input');
        const data = await response.json();
        if (response.ok && Array.isArray(data.items)) setCommunityInput(data.items);
        else setInputFeedFailed(true);
      } catch {
        setInputFeedFailed(true);
      }
    };
    void load();
  }, []);

  const latestSourceRun = sourceRuns[0];
  const latestMonitorRun = monitorRuns[0];
  const openCommunityInput = communityInput.filter(item => item.state === 'open').length;
  const auditedPagesWithGaps = pageAudit.filter(item => item.gaps.length > 0).length;
  const pagesNeedingReview = pageFreshness.pages.filter(item => item.needsReview);
  const knownDoctrineGaps = useMemo(
    () =>
      doctrinePrinciples.reduce((sum, item) => sum + item.gaps.length, 0) +
      doctrineFoundations.reduce((sum, item) => sum + item.gaps.length, 0),
    []
  );

  const serviceCoverageByCategory = useMemo(() => {
    const grouped = new Map<
      string,
      { category: string; indexed: number; structured: number; verified: number }
    >();

    serviceDirectory.forEach(item => {
      const current = grouped.get(item.category) || {
        category: item.category,
        indexed: 0,
        structured: 0,
        verified: 0,
      };
      current.indexed += 1;
      const detail = serviceGuideDetails[item.id];
      if (detail) {
        current.structured += 1;
        if (detail.verification === 'verified') current.verified += 1;
      }
      grouped.set(item.category, current);
    });

    return [...grouped.values()].sort(
      (a, b) => b.indexed - a.indexed || a.category.localeCompare(b.category)
    );
  }, []);

  const partialServiceGuideCount = Object.values(serviceGuideDetails).filter(
    item => item.verification === 'partial'
  ).length;

  const coverage = [
    {
      label: t('evidence.status.coverageGovernmentServices'),
      value: serviceDirectory.length.toLocaleString(locale),
      detail: t('evidence.status.coverageGovernmentServicesDetail'),
      icon: Database,
    },
    {
      label: t('evidence.status.coverageStructuredGuides'),
      value: `${detailedServiceGuideCount}/${serviceDirectory.length}`,
      detail: t('evidence.status.coverageStructuredGuidesDetail'),
      icon: FileSearch,
    },
    {
      label: t('evidence.status.coverageVerifiedGuides'),
      value: verifiedServiceGuideCount.toLocaleString(locale),
      detail: t('evidence.status.coverageVerifiedGuidesDetail'),
      icon: BadgeCheck,
    },
    {
      label: t('evidence.status.coverageOffices'),
      value: governmentServiceOffices.length.toLocaleString(locale),
      detail: t('evidence.status.coverageOfficesDetail'),
      icon: Building2,
    },
    {
      label: t('evidence.status.coverageBarangayProfiles'),
      value: `${barangayCoverageSummary.profiles}/23`,
      detail: t('evidence.status.coverageBarangayProfilesDetail'),
      icon: Users,
    },
    {
      label: t('evidence.status.coverageCouncilRosters'),
      value: `${barangayCoverageSummary.councilRosters}/23`,
      detail: t('evidence.status.coverageCouncilRostersDetail', { date: barangayProfilesReviewed }),
      icon: BadgeCheck,
    },
    {
      label: t('evidence.status.coverageHallContacts'),
      value: `${barangayCoverageSummary.hallContacts}/23`,
      detail: t('evidence.status.coverageHallContactsDetail'),
      icon: Building2,
    },
    {
      label: t('evidence.status.coverageYakap'),
      value: `${barangayCoverageSummary.verifiedHealthFacilityBarangays}/23`,
      detail: t('evidence.status.coverageYakapDetail'),
      icon: ShieldCheck,
    },
    {
      label: t('evidence.status.coverageSpecificPages'),
      value: `${barangayCoverageSummary.specificOfficialPages}/23`,
      detail: t('evidence.status.coverageSpecificPagesDetail'),
      icon: Building2,
    },
    {
      label: t('evidence.status.coverageSocial'),
      value: `${barangayCoverageSummary.verifiedSocialChannels}/23`,
      detail: t('evidence.status.coverageSocialDetail'),
      icon: MessagesSquare,
    },
    {
      label: t('evidence.status.coverageOfficials'),
      value: electedOfficials.length.toLocaleString(locale),
      detail: t('evidence.status.coverageOfficialsDetail'),
      icon: Eye,
    },
    {
      label: t('evidence.status.coverageSearch'),
      value: searchIndex.length.toLocaleString(locale),
      detail: t('evidence.status.coverageSearchDetail'),
      icon: Search,
    },
    {
      label: t('evidence.status.coverageAccountability'),
      value: accountabilityEntries.length.toLocaleString(locale),
      detail: t('evidence.status.coverageAccountabilityDetail'),
      icon: FileSearch,
    },
    {
      label: t('evidence.status.coverageGaps'),
      value: accountabilityCoverageGaps.length.toLocaleString(locale),
      detail: t('evidence.status.coverageGapsDetail'),
      icon: AlertCircle,
    },
    {
      label: t('evidence.status.coverageMonitor'),
      value: cityMonitorSources.length.toLocaleString(locale),
      detail: t('evidence.status.coverageMonitorDetail'),
      icon: RefreshCw,
    },
    {
      label: t('evidence.status.coverageValidated'),
      value: cityMonitorRecords.length.toLocaleString(locale),
      detail: t('evidence.status.coverageValidatedDetail'),
      icon: Database,
    },
    {
      label: t('evidence.status.coverageMethodology'),
      value: knownDoctrineGaps.toLocaleString(locale),
      detail: t('evidence.status.coverageMethodologyDetail'),
      icon: Gauge,
    },
  ];

  const notMeasured = [
    t('evidence.status.notMeasuredSearch'),
    t('evidence.status.notMeasuredCorrection'),
    t('evidence.status.notMeasuredParticipation'),
    t('evidence.status.notMeasuredCoverage'),
    t('evidence.status.notMeasuredWcag'),
    t('evidence.status.notMeasuredUsability'),
  ];

  return (
    <>
      <SEO
        title={t('evidence.status.seoTitle')}
        description={t('evidence.status.seoDescription')}
      />

      <Section className="bm-detail-page bg-[#fffdf8]">
        <div className="section-eyebrow">{t('evidence.status.eyebrow')}</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{t('evidence.status.title')}</Heading>
            <p className="mt-2 max-w-4xl text-gray-700 leading-relaxed">
              {t('evidence.status.intro')}
            </p>
          </div>
          <SharePage title={t('evidence.status.title')} />
        </div>
        <LastReviewed date={doctrineReviewed} />

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-success-200 bg-success-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-extrabold text-success-900">
              <BadgeCheck className="h-5 w-5" />
              {t('evidence.status.publicLaunched')}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-success-900">
              {t('evidence.status.active')}
            </p>
          </div>
          <div className="text-xs font-bold text-success-800">{t('evidence.status.launched')}</div>
        </div>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {coverage.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-primary-100 bg-white p-5">
                <Icon className="h-5 w-5 text-primary-700" />
                <div className="mt-3 text-3xl font-extrabold text-gray-950">{item.value}</div>
                <div className="mt-1 font-bold text-gray-800">{item.label}</div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('evidence.status.serviceCoverage')}</div>
        <Heading level={2}>{t('evidence.status.serviceHeading')}</Heading>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <div className="text-3xl font-extrabold text-gray-950">{serviceDirectory.length}</div>
            <div className="mt-1 text-sm font-bold text-gray-700">{t('evidence.status.indexedServices')}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <div className="text-3xl font-extrabold text-gray-950">{detailedServiceGuideCount}</div>
            <div className="mt-1 text-sm font-bold text-gray-700">{t('evidence.status.structuredGuides')}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <div className="text-3xl font-extrabold text-gray-950">{verifiedServiceGuideCount}</div>
            <div className="mt-1 text-sm font-bold text-gray-700">{t('evidence.status.verified')}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5">
            <div className="text-3xl font-extrabold text-gray-950">{partialServiceGuideCount}</div>
            <div className="mt-1 text-sm font-bold text-gray-700">{t('evidence.status.caveat')}</div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {serviceCoverageByCategory.map(item => (
            <div
              key={item.category}
              className="grid gap-3 border-b border-gray-200 p-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <div className="font-extrabold text-gray-950">{item.category}</div>
                <div className="mt-1 text-xs text-gray-500">
                  {t('evidence.status.serviceWithoutGuide', { count: item.indexed - item.structured })}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-gray-700">
                  {item.indexed} {t('evidence.status.indexed')}
                </span>
                <span className="rounded-full bg-primary-50 px-3 py-1.5 text-primary-800">
                  {item.structured} {t('evidence.status.structured')}
                </span>
                <span className="rounded-full bg-success-50 px-3 py-1.5 text-success-800">
                  {item.verified} {t('evidence.status.verifiedShort')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/services" className="brand-btn-primary">
            {t('evidence.status.openServiceDirectory')}
          </Link>
          <Link to="/community-tools/saan-ako-lalapit" className="brand-btn-secondary">
            Saan Ako Lalapit?
          </Link>
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">{t('evidence.status.barangayCoverage')}</div>
        <Heading level={2}>{t('evidence.status.barangayHeading')}</Heading>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-700">
          {t('evidence.status.barangayGapIntro')}
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {barangayCoverageGaps.map(item => (
            <details
              key={item.slug}
              className="rounded-2xl border border-primary-100 bg-white p-5"
            >
              <summary className="cursor-pointer font-extrabold text-gray-950">
                {item.name}
                <span className="ml-2 text-xs font-bold text-gray-500">
                  {item.missing.length === 0
                    ? t('evidence.status.noTrackedGap')
                    : t('evidence.status.openCount', { count: item.missing.length })}
                </span>
              </summary>
              {item.missing.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  {item.missing.map(gap => (
                    <li key={gap} className="flex gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-700" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-600">
                  {t('evidence.status.noMinimumGap')}
                </p>
              )}
              <Link
                to={'/barangays/' + item.slug}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700"
              >
                {t('evidence.status.openBetterBarangay')} <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </details>
          ))}
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('evidence.status.methodology')}</div>
        <Heading level={2}>{t('evidence.status.methodologyHeading')}</Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {doctrinePrinciples.map(item => (
            <Link
              key={item.id}
              to={'/open-government#' + item.id}
              className="rounded-2xl border border-gray-200 bg-[#fffdf8] p-5"
            >
              <ShieldCheck className="h-5 w-5 text-primary-700" />
              <h3 className="mt-3 font-extrabold text-gray-950">{item.name}</h3>
              <div className="mt-2 text-xs font-bold text-primary-700">
                {doctrineStatusLabel[item.status]}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                {t('evidence.status.publishedGap', { count: item.gaps.length })}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="bg-[#f5f8f2]">
        <div className="section-eyebrow">{t('evidence.status.freshness')}</div>
        <Heading level={2}>{t('evidence.status.liveSignals')}</Heading>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div>
              <div className="text-2xl font-extrabold text-gray-950">{freshnessReview.summary.open}</div>
              <div className="text-xs font-bold text-gray-600">{t('evidence.status.openReview')}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-950">{pageFreshness.summary.needsReview}</div>
              <div className="text-xs font-bold text-gray-600">{t('evidence.status.pagesReview')}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-950">{pageFreshness.summary.current}</div>
              <div className="text-xs font-bold text-gray-600">{t('evidence.status.pagesCurrent')}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/records#freshness-review-queue" className="brand-btn-primary">
              {t('evidence.status.reviewQueue')}
            </Link>
            <a href="/freshness-history.json" className="brand-btn-secondary">
              {t('evidence.status.freshnessHistory')}
            </a>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('evidence.status.freshnessAutomation')}</h3>
            {sourceFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                {t('evidence.status.sourceHistoryUnavailable')}
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  {sourceState.checkedAt
                    ? <>{t('evidence.status.lastPublishedCheck')} <strong>{new Date(sourceState.checkedAt).toLocaleString(locale)}</strong> · {sourceState.cadence || 'all'}.</>
                    : t('evidence.status.monitorConfiguredPending')}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{sourceState.sources?.length ?? '—'}</div>
                    <div className="text-xs text-gray-500">{t('evidence.status.configured')}</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">
                      {sourceState.sources?.filter(source => source.status === 'ok').length ?? '—'}
                    </div>
                    <div className="text-xs text-gray-500">{t('evidence.status.lastCheckOk')}</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestSourceRun?.changed.length ?? 0}</div>
                    <div className="text-xs text-gray-500">{t('evidence.status.reviewChanges')}</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">
                      {sourceState.sources?.filter(source => source.status === 'http-error' || source.status === 'unreachable').length ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">{t('evidence.status.checkFailures')}</div>
                  </div>
                </div>
              </>
            )}
            <Link to="/records" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              {t('evidence.status.openSourceFreshness')}
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <RefreshCw className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('evidence.status.cityMonitor')}</h3>
            {monitorFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                {t('evidence.status.monitorHistoryUnavailable')}
              </p>
            ) : latestMonitorRun ? (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  {t('evidence.status.lastMonitorUpdate')}{' '}
                  <strong>{new Date(latestMonitorRun.checkedAt).toLocaleString(locale)}</strong>
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.changed.length}</div>
                    <div className="text-xs text-gray-500">{t('evidence.status.changed')}</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.failed.length}</div>
                    <div className="text-xs text-gray-500">{t('evidence.status.failed')}</div>
                  </div>
                  <div className="rounded-xl bg-[#fffdf8] p-3">
                    <div className="text-xl font-extrabold">{latestMonitorRun.newBaselines.length}</div>
                    <div className="text-xs text-gray-500">{t('evidence.status.baselines')}</div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                {t('evidence.status.noMonitorUpdate')}
              </p>
            )}
            <Link to="/city-monitor" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              {t('evidence.status.openCityMonitor')}
            </Link>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-6">
            <MessagesSquare className="h-5 w-5 text-primary-700" />
            <h3 className="mt-3 font-extrabold text-gray-950">{t('evidence.status.communityInput')}</h3>
            {inputFeedFailed ? (
              <p className="mt-2 text-sm text-gray-600">
                {t('evidence.status.communityUnavailable')}
              </p>
            ) : (
              <>
                <div className="mt-3 text-3xl font-extrabold text-gray-950">
                  {communityInput.length}
                </div>
                <p className="text-sm text-gray-600">
                  {t('evidence.status.trackedItems', { count: communityInput.length, open: openCommunityInput })}
                </p>
              </>
            )}
            <Link to="/participate" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-700">
              {t('evidence.status.openParticipation')}
            </Link>
          </div>
        </div>
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('evidence.status.pageAudit')}</div>
        <Heading level={2}>{t('evidence.status.pageAuditHeading')}</Heading>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600">
          {t('evidence.status.pageAuditIntro')}
        </p>

        {pageAuditFailed ? (
          <div className="mt-6 rounded-xl border border-warning-200 bg-warning-50 p-4 text-sm text-warning-900">
            {t('evidence.status.pageAuditUnavailable')}
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{pageAudit.length}</div>
                <div className="text-sm font-bold text-gray-700">{t('evidence.status.majorReviewed')}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">
                  {pageAudit.filter(item => item.status === 'reviewed').length}
                </div>
                <div className="text-sm font-bold text-gray-700">{t('evidence.status.reviewedNoGaps')}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-[#fffdf8] p-4">
                <div className="text-2xl font-extrabold text-gray-950">{pageFreshness.summary.current}</div>
                <div className="text-sm font-bold text-gray-700">{t('evidence.status.dependencyCurrent')}</div>
              </div>
              <div className="rounded-xl border border-secondary-200 bg-secondary-50 p-4">
                <div className="text-2xl font-extrabold text-gray-950">{pageFreshness.summary.needsReview}</div>
                <div className="text-sm font-bold text-gray-700">{t('evidence.status.needReview')}</div>
              </div>
            </div>

            {pagesNeedingReview.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-secondary-200">
                {pagesNeedingReview.map(item => (
                  <div key={item.path} className="border-b border-secondary-100 bg-secondary-50 p-4 last:border-b-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link to={item.path} className="font-extrabold text-primary-800 hover:underline">
                        {item.label}
                      </Link>
                      <span className="text-xs font-semibold text-secondary-900">{t('evidence.status.needsReview')}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      {t('evidence.status.reviewedLine', { date: item.reviewedAt })} · {item.dependencySignals.map(signal => signal.label).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {auditedPagesWithGaps > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                {pageAudit.filter(item => item.gaps.length > 0).map(item => (
                  <div key={item.path} className="border-b border-gray-200 bg-white p-4 last:border-b-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link to={item.path} className="font-extrabold text-primary-800 hover:underline">
                        {item.label}
                      </Link>
                      <span className="text-xs font-semibold text-gray-500">{t('evidence.status.reviewedLine', { date: item.reviewedAt })}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-gray-600">
                      {item.gaps.map(gap => <li key={gap}>{gap}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      <Section className="bg-white">
        <div className="section-eyebrow">{t('evidence.status.measurementGaps')}</div>
        <Heading level={2}>{t('evidence.status.notMeasured')}</Heading>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {notMeasured.map(item => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-secondary-200 bg-secondary-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary-800" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bm-detail-page bg-[#fffdf8]">
        <div className="rounded-2xl border border-primary-100 bg-white p-6">
          <Database className="h-5 w-5 text-primary-700" />
          <h2 className="mt-3 text-xl font-extrabold text-gray-950">{t('evidence.status.auditCode')}</h2>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-600">
            {t('evidence.status.auditCodeDetail')}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/open-government" className="brand-btn-primary">
              {t('evidence.status.openDoctrine')}
            </Link>
            <Link to="/get-involved?type=correction#submission" className="brand-btn-secondary">
              {t('evidence.status.submitCorrection')}
            </Link>
            <a
              href="https://github.com/migi-macati/bettermakati"
              target="_blank"
              rel="noreferrer"
              className="brand-btn-secondary"
            >
              {t('evidence.status.sourceCode')} <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
