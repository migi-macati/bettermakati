import { electedOfficials, findOfficial } from './electedOfficials';
import {
  election2025OfficialResults,
  findElection2025OfficialResult,
} from './election2025';
import {
  createCivicIntelligenceRelationshipIndex,
  type CivicIntelligenceNodeResolver,
  type CivicIntelligenceRelationship,
} from './civicIntelligenceRelationships';

const electionRecordId = (officialSlug: string) =>
  'official-result-2025:' + officialSlug;

const officialSlugsWithResults = new Set(
  election2025OfficialResults.map(result => result.officialSlug)
);

export const officialCivicRelationships: CivicIntelligenceRelationship[] =
  electedOfficials
    .filter(official => officialSlugsWithResults.has(official.slug))
    .map(official => ({
      id: 'official-' + official.slug + '-election-result-2025',
      kind: 'context-for' as const,
      from: { type: 'election-record' as const, id: electionRecordId(official.slug) },
      to: { type: 'official' as const, id: official.slug },
      evidence: {
        basis: 'canonical-id' as const,
        note:
          'The canonical 2025 election result stores this elected official slug. The relationship records election context only and does not infer later votes, sponsorship, project responsibility or procurement control.',
      },
    }));

export const officialCivicRelationshipIndex =
  createCivicIntelligenceRelationshipIndex(officialCivicRelationships);

export const officialCivicNodeResolver: CivicIntelligenceNodeResolver =
  ref => {
    if (ref.type === 'official') {
      const official = findOfficial(ref.id);
      if (!official) return undefined;
      return {
        ref,
        label: official.displayName,
        href: '/officials/' + official.slug,
        owner: 'officials',
      };
    }

    if (ref.type === 'election-record') {
      if (!ref.id.startsWith('official-result-2025:')) return undefined;
      const officialSlug = ref.id.slice('official-result-2025:'.length);
      const result = findElection2025OfficialResult(officialSlug);
      const official = findOfficial(officialSlug);
      if (!result || !official) return undefined;
      return {
        ref,
        label: official.displayName + ' · 2025 election result',
        href:
          '/elections#' +
          (official.office === 'City Councilor'
            ? 'council-results'
            : 'results-2025'),
        owner: 'elections',
      };
    }

    return undefined;
  };

for (const relationship of officialCivicRelationships) {
  if (!officialCivicNodeResolver(relationship.from)) {
    throw new Error(
      'Unresolved official civic relationship source: ' + relationship.id
    );
  }
  if (!officialCivicNodeResolver(relationship.to)) {
    throw new Error(
      'Unresolved official civic relationship target: ' + relationship.id
    );
  }
}

export const electionRecordForOfficial = (officialSlug: string) =>
  officialCivicRelationshipIndex
    .forRef({ type: 'official', id: officialSlug })
    .map(view => ({
      ...view,
      node: officialCivicNodeResolver(view.related),
    }))
    .filter(item => item.related.type === 'election-record' && Boolean(item.node));

export const officialForElectionRecord = (officialSlug: string) =>
  officialCivicRelationshipIndex
    .forRef({
      type: 'election-record',
      id: electionRecordId(officialSlug),
    })
    .map(view => ({
      ...view,
      node: officialCivicNodeResolver(view.related),
    }))
    .filter(item => item.related.type === 'official' && Boolean(item.node));

export const officialCivicRelationshipCoverage = {
  officials: electedOfficials.length,
  electionResults: election2025OfficialResults.length,
  exactOfficialElectionEdges: officialCivicRelationships.length,
} as const;
