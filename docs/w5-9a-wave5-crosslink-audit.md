# W5-9a — Wave 5 cross-link audit

Reviewed: 2026-09-28

## Status

**Complete.**

W5-9a audits the user journeys between the Wave 5 city-knowledge and practical-life surfaces before final closeout.

The aim is not all-to-all linking. A cross-link should help the user continue a concrete task or move from a summary/discovery layer into the canonical owner.

## Fixes made

### Mobility

The remaining public **Parking** card was stale after Parking was removed from BetterMakati.

It now links to **Areas & districts**, which is a useful continuation for understanding where a transport connection sits in the city.

The legacy `/parking` route may remain only as a compatibility redirect for old links.

### History

The History page already linked individual events to canonical places and barangays and could return a filtered heritage collection to Heritage.

It now also gives an unfiltered reader two durable continuations:

- **Heritage places**
- **Explore Makati**

### Estates & Districts

Area cards already linked to their barangays and canonical places.

The page now also exposes:

- **Explore Makati**
- **Getting around**

This closes the district → visitor/mobility journey without duplicating visitor or transport data inside the area registry.

## Cross-domain result

### History

History ↔ Heritage is now bidirectional at both generic and collection level.

History also links event geography into canonical Place and Barangay records and can continue into Explore Makati.

### Heritage

Heritage routes link directly to canonical places and filtered History. No extra generic directory is needed.

### Estates & Districts

Estates links canonical areas to Barangays and Places and now continues into Explore Makati and Mobility.

### Mobility

Mobility links verified stations/terminals to the Place Registry, fixed systems into Search/Civic Map, and now back to Estates & Districts.

Parking is no longer a public Mobility destination.

### Explore Makati

Explore remains the broad Wave 5 discovery hub, linking Areas, Barangays, Heritage, History, Mobility, Calendar and Cinemas while leaving volatile restaurant/café/nightlife discovery to live external search.

### Makati Calendar

Calendar cards link back to their canonical owner and original source. Geography links resolve to canonical Barangay, Area or Place records where available.

This is the correct integration pattern: Calendar is a time index, not another record database.

### Makati in the News

News links to City Monitor and Calendar and generates **Related in BetterMakati** links only when a story explicitly matches a canonical entity/reference.

The news feed remains discovery, not canonical truth.

## BetterGov / BetterLGU boundary

The wider ecosystem is part of the audit.

BetterMakati already exposes two useful global escape routes in the footer:

- **National services — BetterGov**
- **Other LGUs — BetterLGU**

W5-9a does not force those links into History, Heritage, Estates, Mobility, Calendar or News because none of those pages currently has a stronger page-specific national/cross-LGU task continuation than the Makati-local one.

That follows the existing ecosystem rule: integrate when the external product completes the user’s task; do not add ecosystem architecture as promotional UI.

## Parking rule

Parking remains removed.

W5-9a introduces a guard that permits `/parking` only as the App compatibility redirect and forbids it from the Wave 5 public pages, Home, navigation and Search.

## Guard

New gate:

`check:wave5-crosslinks`

It protects the useful cross-domain journeys above, the Parking removal, and the existing global BetterGov/BetterLGU handoffs.

## Next

**W5-9b — Search & discovery audit.**
