# BetterMakati UX benchmark and source audit

## What the benchmark showed

This pass reviewed the public landing and service patterns on [Boston.gov](https://www.boston.gov/), [Helsinki.fi](https://www.hel.fi/en), [NYC.gov](https://www.nyc.gov/main), [gov.sg](https://www.gov.sg/), [Isomer](https://www.isomer.gov.sg/), and [Open Government Products](https://www.open.gov.sg/), together with the [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

The useful patterns are consistent:

- A task search belongs near the start of the home page and should be reachable from every page.
- Popular tasks should be visible as short, labelled shortcuts rather than hidden in a large menu.
- City exploration benefits from real, credited photography; service, budget, hotline, and directory pages work better with restrained symbols and clear data tables.
- Status, contact, map, and source actions should be explicit and close to the claim they support.
- Keyboard focus, reduced-motion support, readable contrast, table captions, and descriptive labels are part of the visual design.
- A government portal should make its trust model visible: identify the publisher, link to the authoritative agency, use HTTPS, and explain how a visitor can report a problem.
- A shared government web platform benefits from a disciplined component system, responsive defaults, and clear ownership of each content type.
- Open-government teams earn trust by showing product status, report cards, what worked, and what still needs improvement. Audience routes for citizens, public officers, media, and contributors make participation concrete.

BetterMakati applies these patterns through the persistent “Find a service” action, the home-page task shortcuts, direct links to hotlines/budgets/statistics, accessible focus styling, reduced-motion support, the interactive city comparison on Statistics, an explicit source policy, and the Get Involved submission flow.

## Singapore-specific adaptations

| Reference                                            | Pattern worth adopting                                                                                                                                  | BetterMakati adaptation                                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [gov.sg](https://www.gov.sg/)                        | Trust cues appear before content: government identity, official-domain guidance, HTTPS, scam warning, topical explainers, and a visible feedback route. | Keep the independent-portal disclosure prominent, link every claim to its source, add an “official Makati site” path, and keep correction/reporting links close to the content.  |
| [Isomer](https://www.isomer.gov.sg/)                 | A restrained, prescriptive component system prioritises accessibility, responsive behaviour, resilience, and fast publishing.                           | Keep BetterMakati’s shared cards, buttons, focus styles, reduced-motion rules, source treatment, and task-first templates consistent across routes.                              |
| [Open Government Products](https://www.open.gov.sg/) | Product stories, report cards, audience-specific routes, newsroom content, and open participation make government technology legible.                   | Treat community tools as products with status, owner/source, scope, and a clear “suggest, correct, or volunteer” path. Add outcome and last-checked fields as live tools mature. |

## Page-by-page visual and interaction pass

| Route                                                                   | Keep / add                                                                                                                                                                                 | Source treatment                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `/`                                                                     | Keep task-first hero and icon shortcuts. Use a small number of real, credited city photographs only when a licensed set is available; the current abstract hero avoids uncredited imagery. | KPI cards link to PSA. Visitor cards point to their destination sources.       |
| `/services`, `/services/:category`, `/services/:category/:documentSlug` | Keep icon-led task cards and searchable service index. Avoid decorative photos that slow scanning.                                                                                         | Service records retain their official source and document links.               |
| `/visit`                                                                | Add a curated photography band for parks, markets, museums, and neighbourhoods once images have verified licensing; retain Maps and tourism source links beside each place.                | Every destination card has a Maps action and source link.                      |
| `/mobility`, `/parking`, `/cinemas`                                     | Keep practical icons, route/map actions, and operator links. Prioritise current links over static imagery.                                                                                 | Operators and route sources are shown with each action.                        |
| `/whats-on`, `/news`, `/live`                                           | Use event/news imagery only with a source, date, and alt text. Keep live status cards icon-led and timestamped.                                                                            | Each external update links to its publisher.                                   |
| `/heritage`, `/history`                                                 | These are the strongest candidates for credited archival and streetscape images. Add one image per story group, not a gallery on every card.                                               | NHCP, city history, and museum sources remain beside each claim.               |
| `/government`, `/barangays`, `/estates`                                 | Use office, barangay, HOA, and estate symbols. Keep directories dense and searchable; photography adds little to the task.                                                                 | Official contacts and association sites are linked in context.                 |
| `/statistics`                                                           | Keep charts, source links, and exact tables. The new comparison is filterable, downloadable, and explicitly defines GDP per person.                                                        | PSA source links are attached to cards, tables, and methodology notes.         |
| `/projects-budget`                                                      | Use charts and document links before PDFs. Keep the year-by-year archive for auditability.                                                                                                 | DBM/BLGF and city budget links are attached to each relevant section and year. |
| `/community-tools`, `/community-tools/saan-ako-lalapit`                 | Keep the tool grid and search-first flow. Use status chips and service symbols rather than stock photos.                                                                                   | Tools link to their owning service or official channel.                        |
| `/get-involved`, `/contact`, `/hotlines`                                | Use action icons and clickable phone/email links. Avoid decorative imagery that competes with urgent actions.                                                                              | Official city and programme contacts remain linked.                            |
| `/about`, `/privacy`, `/terms`                                          | Keep text-led layouts. A compact source policy is more useful than a hero photo.                                                                                                           | Method, attribution, and external sources are linked in prose.                 |

## Source-link rule used in the code

Every externally verifiable number, date, official contact, current programme, destination, or historical assertion should have a nearby source link. A link to a search result is not sufficient when the first-party page or document is available. Derived calculations are labelled as derived and show the underlying source data.
