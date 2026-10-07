# Featured Report publishing

Each article lives in one `src/data/reports/NN-slug.ts` module. The module owns
its English report, sources, tables or charts, methodology, and Filipino copy.
Use `fil: null` only to retain the established English fallback for an older
article that does not yet have a Filipino edition.

The numeric filename prefix controls publication order. The Vite registry in
`src/data/reports.ts` discovers modules automatically; publishers do not edit
that registry, `reportTranslations.ts`, `ReportArticle.tsx`, or
`ReportTeaser.tsx` when adding an ordinary report. Existing slug aliases remain
in the registry because they are shared routing infrastructure.

Report modules may reuse canonical values from `reportSharedData.ts`. Put a
genuinely article-specific timeline or relationship in a separate propagation
module when another page needs it; do not copy canonical population, election,
budget, place, or accountability records into propagation data.

Before opening a pull request, run `npm run quality` and `npm run build`. The
report schema check bundles every discovered module and rejects duplicate
slugs, missing required English or translated fields, duplicate source IDs,
unknown evidence source references, empty sections, and malformed modules.
Normal repository CI also runs the required browser smoke tests, including the
English/Filipino report paths.
