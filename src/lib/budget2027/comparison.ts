import type { Project } from './client';

export type ComparisonStatus = 'unchanged' | 'increased' | 'decreased' | 'missing-nep' | 'missing-house' | 'unconfirmed';

// Compare like-for-like versions only. Missing matches are never additions/removals.
export function compareProject(row: Pick<Project, 'nep_php' | 'hgab3_php' | 'held'>): { status: ComparisonStatus; delta: number | null } {
  if (row.held) return { status: 'unconfirmed', delta: null };
  if (row.nep_php === null) return { status: 'missing-nep', delta: null };
  if (row.hgab3_php === null) return { status: 'missing-house', delta: null };
  const delta = row.hgab3_php - row.nep_php;
  return { status: delta === 0 ? 'unchanged' : delta > 0 ? 'increased' : 'decreased', delta };
}
