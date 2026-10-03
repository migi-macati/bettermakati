import {
  Building2,
  ExternalLink,
  Home,
  Landmark,
  Network,
} from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import LastReviewed from '../components/ui/LastReviewed';
import SharePage from '../components/ui/SharePage';
import {
  civicAreaById,
  civicAreaRegistrySources,
  civicAreaRelationships,
  civicAreas,
  civicOrganizationById,
  civicOrganizations,
  type CivicAreaRecord,
  type CivicOrganizationRecord,
} from '../data/areaOrganizationRegistry';
import { barangays } from '../data/barangays';
import { placeRegistryById } from '../data/placeRegistry';

const businessAreas = civicAreas.filter(
  area => area.kind !== 'residential-village'
);
const residentialAreas = civicAreas.filter(
  area => area.kind === 'residential-village'
);

const sourceById = new Map(
  civicAreaRegistrySources.map(source => [source.id, source])
);

const areaRelationships = (areaId: string) =>
  civicAreaRelationships.filter(
    relationship =>
      (relationship.from.type === 'area' &&
        relationship.from.id === areaId) ||
      (relationship.to.type === 'area' && relationship.to.id === areaId)
  );

const areaSources = (area: CivicAreaRecord) => {
  const relationshipSourceIds = areaRelationships(area.id).flatMap(
    relationship => relationship.evidence.sourceIds
  );
  const sourceIds = [
    ...area.provenance.assertions.flatMap(assertion => assertion.sourceIds),
    ...(area.attributes?.flatMap(attribute => attribute.sourceIds) ?? []),
    ...relationshipSourceIds,
  ];

  return [...new Set(sourceIds)].flatMap(sourceId => {
    const source = sourceById.get(sourceId);
    return source ? [source] : [];
  });
};

const roleLabel = (kind: string) => {
  if (kind === 'managed-by') return 'Managed by';
  if (kind === 'developed-by') return 'Developed by';
  if (kind === 'operated-by') return 'Estate operations';
  return 'Related organization';
};

const areaKindLabel = (kind: CivicAreaRecord['kind']) => {
  if (kind === 'business-district') return 'Business district';
  if (kind === 'commercial-estate') return 'Commercial estate';
  if (kind === 'mixed-use-estate') return 'Mixed-use estate';
  if (kind === 'named-subdistrict') return 'CBD subdistrict';
  if (kind === 'residential-village') return 'Residential village';
  return 'Managed area';
};

const AreaCard = ({ area }: { area: CivicAreaRecord }) => {
  const relationships = areaRelationships(area.id);
  const parentRelationship = relationships.find(
    relationship =>
      relationship.kind === 'within-area' &&
      relationship.from.type === 'area' &&
      relationship.from.id === area.id &&
      relationship.to.type === 'area'
  );
  const childRelationships = relationships.filter(
    relationship =>
      relationship.kind === 'within-area' &&
      relationship.to.type === 'area' &&
      relationship.to.id === area.id &&
      relationship.from.type === 'area'
  );
  const barangayRelationships = relationships.filter(
    relationship =>
      relationship.kind === 'within-barangay' &&
      relationship.from.type === 'area' &&
      relationship.from.id === area.id &&
      relationship.to.type === 'barangay'
  );
  const organizationRelationships = relationships.filter(
    relationship =>
      relationship.from.type === 'area' &&
      relationship.from.id === area.id &&
      relationship.to.type === 'organization' &&
      ['managed-by', 'developed-by', 'operated-by'].includes(
        relationship.kind
      )
  );
  const placeRelationships = relationships.filter(
    relationship =>
      relationship.kind === 'place-within-area' &&
      relationship.to.type === 'area' &&
      relationship.to.id === area.id &&
      relationship.from.type === 'place'
  );
  const sources = areaSources(area).slice(0, 3);
  const AreaIcon =
    area.kind === 'residential-village' ? Home : Building2;

  return (
    <article
      id={'area-' + area.id}
      className="scroll-mt-24 rounded-2xl border border-primary-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
          <AreaIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-secondary-50 px-3 py-1 text-xs font-bold text-secondary-800">
          {areaKindLabel(area.kind)}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-extrabold text-gray-950">
        {area.name}
      </h3>

      {(area.aliases?.length ?? 0) > 0 && (
        <div className="mt-1 text-xs font-semibold text-gray-500">
          {area.aliases?.map(alias => alias.name).join(' · ')}
        </div>
      )}

      {area.summary && (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {area.summary}
        </p>
      )}

      {(area.attributes?.length ?? 0) > 0 && (
        <dl className="mt-4 grid gap-2 text-sm">
          {area.attributes?.map(attribute => (
            <div
              key={attribute.label}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <dt className="font-bold text-gray-950">{attribute.label}</dt>
              <dd className="text-gray-600">{attribute.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {(parentRelationship ||
        childRelationships.length > 0 ||
        barangayRelationships.length > 0 ||
        organizationRelationships.length > 0 ||
        placeRelationships.length > 0) && (
        <div className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
          {parentRelationship?.to.type === 'area' && (
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                Part of
              </div>
              <a
                href={'#area-' + parentRelationship.to.id}
                className="mt-1 inline-flex font-bold text-primary-700 underline underline-offset-2"
              >
                {civicAreaById.get(parentRelationship.to.id)?.name ??
                  parentRelationship.to.id}
              </a>
            </div>
          )}

          {childRelationships.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                Areas within this district
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {childRelationships.map(relationship => {
                  if (relationship.from.type !== 'area') return null;
                  const child = civicAreaById.get(relationship.from.id);
                  if (!child) return null;
                  return (
                    <a
                      key={relationship.id}
                      href={'#area-' + child.id}
                      className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                    >
                      {child.name}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {barangayRelationships.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                Barangay
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {barangayRelationships.map(relationship => {
                  if (relationship.to.type !== 'barangay') return null;
                  const barangay = barangays.find(
                    item => item.slug === relationship.to.id
                  );
                  if (!barangay) return null;
                  return (
                    <Link
                      key={relationship.id}
                      to={'/barangays/' + barangay.slug}
                      className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                    >
                      Better{barangay.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {organizationRelationships.map(relationship => {
            if (relationship.to.type !== 'organization') return null;
            const organization = civicOrganizationById.get(
              relationship.to.id
            );
            if (!organization) return null;
            return (
              <div key={relationship.id}>
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                  {roleLabel(relationship.kind)}
                </div>
                <a
                  href={'#organization-' + organization.id}
                  className="mt-1 inline-flex font-bold text-primary-700 underline underline-offset-2"
                >
                  {organization.name}
                </a>
              </div>
            );
          })}

          {placeRelationships.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                Canonical places
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {placeRelationships.map(relationship => {
                  if (relationship.from.type !== 'place') return null;
                  const place = placeRegistryById.get(relationship.from.id);
                  if (!place) return null;
                  return (
                    <Link
                      key={relationship.id}
                      to={'/civic-map/' + place.id}
                      className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                    >
                      {place.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-5 border-t border-gray-200 pt-4">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
            Sources
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {sources.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary-700 underline underline-offset-2"
              >
                {source.publisher ?? source.label}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

const connectedAreasForOrganization = (
  organization: CivicOrganizationRecord
) =>
  civicAreaRelationships.flatMap(relationship => {
    if (
      relationship.from.type !== 'area' ||
      relationship.to.type !== 'organization' ||
      relationship.to.id !== organization.id
    ) {
      return [];
    }

    const area = civicAreaById.get(relationship.from.id);
    return area ? [{ area, relationship }] : [];
  });

export default function Estates() {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('corePages.estates.seoTitle')}
        description={t('corePages.estates.seoDescription')}
      />

      <Section className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('corePages.estates.city')}</div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Heading>{t('corePages.estates.title')}</Heading>
            <p className="max-w-3xl text-gray-600">
              Business districts, mixed-use estates and residential villages,
              linked to the organizations that manage, operate or develop them.
            </p>
          </div>
          <SharePage title={`${t('corePages.estates.title')} | BetterMakati`} />
        </div>
        <LastReviewed date="2026-09-27" />

        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/visit" className="brand-btn-secondary">
            Explore Makati
          </Link>
          <Link to="/mobility" className="brand-btn-secondary">
            Getting around
          </Link>
        </div>

        <nav
          className="mt-7 flex flex-wrap gap-2"
          aria-label="Estates and districts sections"
        >
          <a href="#business-areas" className="brand-btn-secondary">
            Business districts & estates
          </a>
          <a href="#residential-villages" className="brand-btn-secondary">
            Residential villages
          </a>
          <a href="#organizations" className="brand-btn-secondary">
            Associations & organizations
          </a>
        </nav>
      </Section>

      <Section id="business-areas" className="bg-[#f5f8f2]">
        <div className="section-eyebrow">{t('corePages.estates.commercial')}</div>
        <Heading level={2}>{t('corePages.estates.managed')}</Heading>
        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {businessAreas.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section id="residential-villages" className="bg-white">
        <div className="section-eyebrow">{t('corePages.estates.villages')}</div>
        <Heading level={2}>{t('corePages.estates.villageAreas')}</Heading>
        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {residentialAreas.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section id="organizations" className="bg-[#fffdf8]">
        <div className="section-eyebrow">{t('corePages.estates.organizations')}</div>
        <Heading level={2}>{t('corePages.estates.official')}</Heading>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {civicOrganizations.map(organization => {
            const connectedAreas = connectedAreasForOrganization(
              organization
            );

            return (
              <article
                key={organization.id}
                id={'organization-' + organization.id}
                className="scroll-mt-24 rounded-2xl border border-primary-100 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700">
                    {organization.kind === 'homeowners-association' ? (
                      <Home className="h-5 w-5" aria-hidden="true" />
                    ) : organization.kind === 'developer' ? (
                      <Landmark className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Network className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-gray-950">
                      {organization.name}
                    </h3>
                    {(organization.abbreviations?.length ?? 0) > 0 && (
                      <div className="mt-1 text-xs font-bold text-primary-700">
                        {organization.abbreviations?.join(' · ')}
                      </div>
                    )}
                  </div>
                </div>

                {organization.summary && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {organization.summary}
                  </p>
                )}

                {connectedAreas.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">
                      Connected areas
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {connectedAreas.map(({ area, relationship }) => (
                        <a
                          key={relationship.id}
                          href={'#area-' + area.id}
                          className="rounded-full border border-primary-200 px-3 py-1.5 text-xs font-bold text-primary-700"
                        >
                          {area.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {organization.channels.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    {organization.channels.map(channel => (
                      <a
                        key={channel.kind + ':' + channel.url}
                        href={channel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-primary-700 underline underline-offset-2"
                      >
                        {channel.label}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-500">
                    No verified public organization channel is currently listed.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Section>
    </>
  );
}
