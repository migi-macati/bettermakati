# W7-6c — Heritage editorial and place treatment

Status: implementation-complete  
Reviewed: 2026-09-30

## Scope

Polish the Heritage & Culture page as the place-facing counterpart to W7-6b History without changing place identity, historical claims, provenance, collection membership or route behavior.

Machine-readable record:

`data/wave7-editorial-heritage.json`

## Changes

- Heritage now shares the Wave 7 editorial canvas and restrained gold intro rule used by History.
- Place cards use a consistent paper surface, gold top rule and restrained elevation; archival image captions remain directly attached to their media.
- Map selection stays functionally unchanged while the map band and selected-collection context gain clearer visual hierarchy.
- Thematic collections and self-guided walking routes use intentionally different card accents so routes are not presented as the same kind of asset as buildings, churches, museums or markers.
- Place, source, history-handoff and route-stop links now meet the 44px interaction baseline where they are interactive.
- The final History handoff uses the same evidence/editorial vocabulary instead of an isolated cream card.
- Card/image motion is disabled under reduced-motion preferences.

## Preserved

No heritage or historical content was rewritten.

The slice preserves:

- canonical Place Registry IDs and source ownership;
- place media alt text, credits and license links;
- source URLs and historical context;
- map selector semantics and walking-route path behavior;
- collection and route anchors;
- links from collections/routes into History;
- external walking directions;
- Wave 5 heritage-audit markers for the responsive place grid and map layout.

## Guard

`check:wave7-editorial-heritage` runs in both `quality` and `build`.

## Next

Once this commit passes CI, **W7-6 is complete** and the next slice is **W7-7 — Place and civic-asset integration polish**.
