import type { Project } from './client';

/** Title evidence only: never substitute a title match for boundary verification. */
export function makatiScope(
  row: Pick<Project, 'title'>
): 'candidate' | 'shared' | 'excluded' {
  if (!/(?<![\p{L}\p{N}])Makati(?![\p{L}\p{N}])/iu.test(row.title))
    return 'excluded';
  if (
    /Makati\s*[-–—/]\s*Mandaluyong|Mandaluyong\s*[-–—/]\s*Makati/iu.test(
      row.title
    )
  )
    return 'shared';
  return 'candidate';
}
