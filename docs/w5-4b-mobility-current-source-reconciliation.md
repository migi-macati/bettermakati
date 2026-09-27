# W5-4b — Mobility current-source reconciliation

Reviewed: 2026-09-27

## Scope

Refresh the unstable user-facing mobility families already shown on BetterMakati before introducing a canonical mobility-system model.

This step verifies:
- current identity / operating status;
- appropriate authoritative or first-party source;
- the public-facing link BetterMakati should prefer;
- what claims are stable enough to normalize later.

It does **not** create route geometry, freeze volatile schedules/fare tables, or expand the historical jeepney corpus.

---

## 1. MRT-3

### Decision

**CURRENT / OPERATING — safe to canonicalize as a public rail system.**

The current DOTr MRT-3 website remains the primary public source.

Primary source:
- https://www.dotrmrt3.gov.ph/about-us

Operating-hours source:
- https://www.dotrmrt3.gov.ph/operating-hours.pdf

### Current Makati stations

The DOTr source explicitly lists:
- Guadalupe
- Buendia / Sen. Gil Puyat
- Ayala
- Magallanes

These match BetterMakati’s four existing canonical MRT-3 Place records.

### User-facing source policy

Use the DOTr MRT-3 site as the system link.

Do not copy a full timetable into static BetterMakati content. The official page already publishes current station opening / closing schedules and operating information, and these can change.

Stable claims suitable for later canonical system data:
- system name: MRT-3
- mode: urban rail
- operator/public authority: Department of Transportation — MRT-3
- current lifecycle: operating
- Makati member stops: the four canonical station Place IDs
- official website/source: DOTr MRT-3

Volatile claims to leave at source:
- first/last train times
- headways
- temporary operating-hour adjustments

---

## 2. EDSA Busway / EDSA Carousel

### Decision

**CURRENT / OPERATING — safe to canonicalize as a public busway system.**

Strong current government evidence:
- https://pia.gov.ph/news/dotr-dict-launch-free-wi-fi-for-all-covering-17-edsa-busway-stations/
- https://pia.gov.ph/news/dotr-vows-further-modernization-of-edsa-busway/
- https://pia.gov.ph/news/dotr-eyes-edsa-busway-improvement-additional-stations-for-2026/

The January 16, 2026 PIA report documents active EDSA Busway stations including:
- Guadalupe
- Buendia
- Ayala

These match the three current canonical Makati Busway Place records.

### Important source distinction

The current Mobility page links to:
- https://edsabus.com/route-map

That site is useful as a commuter-facing reference, but the reviewed material does **not** establish it as an official DOTr / LTFRB system portal.

Therefore:

- **do not use edsabus.com as canonical identity/status authority;**
- government DOTr/PIA material should govern system existence and station status;
- a commuter route-map link may remain only as a clearly secondary external reference if later UX work still finds it useful.

### Current expansion

Government sources in 2026 describe additional / improved stations, including Magallanes construction plans.

Do **not** add a current operating Magallanes Busway station until an authoritative source confirms it has actually opened.

Stable claims suitable for later canonical system data:
- system name: EDSA Busway / EDSA Carousel
- mode: bus rapid-transit-style median busway
- public authority: Department of Transportation, with relevant road/public-transport agencies
- lifecycle: operating
- current Makati canonical stops: Guadalupe, Buendia, Ayala

Volatile:
- exact systemwide stop count
- temporary station closures
- construction/opening dates
- fares/schedules

---

## 3. Pasig River Ferry Service

### Decision

**CURRENT / OPERATING — safe to canonicalize as a public ferry system.**

Current 2026 evidence:
- https://pia.gov.ph/news/mmda-suspends-operations-of-pasig-river-ferry-starting-april-1/
- https://pia.gov.ph/news/mmda-dict-launch-free-wi-fi-for-ferry-passengers/
- https://www.gmanetwork.com/news/topstories/metro/987624/free-wifi-installed-at-pasig-river-ferry-stations/story/

The April PIA advisory states the temporary Holy Week suspension would end and regular service resume April 6, 2026.

The June PIA article confirms active Pasig River Ferry passenger service at Guadalupe Ferry Station.

The May DICT/MMDA rollout reported current ferry stations including:
- Guadalupe
- Valenzuela

These match BetterMakati’s two canonical Makati ferry Place records.

### Count caution

Current public reporting is not perfectly clean on the systemwide station denominator. One May report describes 12 stations while its published list is not internally ideal for denominator use.

Therefore BetterMakati should **not freeze a systemwide station count** from this reconciliation step.

Stable claims suitable for later canonical system data:
- system name: Pasig River Ferry Service
- mode: passenger ferry / river transport
- operator: Metropolitan Manila Development Authority
- lifecycle: operating
- Makati member stops: Guadalupe and Valenzuela

Volatile:
- daily trip timetable
- temporary weather/event suspensions
- systemwide station denominator

---

## 4. One Ayala Terminal

### Decision

**CURRENT / OPERATING — retain as a canonical physical transport Place, not a transport system.**

Primary first-party source:
- https://groundbreakers.ayalaland.com.ph/articles/the-ultimate-mixed-use-development-in-makati-cbd-enhancing-connectivity-with-ease-and-convenience.html

Current Ayala Malls presence:
- https://www.ayalamalls.com/explore/one-ayala-mall/

Ayala Land describes One Ayala as an intermodal transport hub containing:
- bus terminal
- P2P services
- UBE Express
- city bus / EDSA Carousel access
- PUJ
- UV Express
- direct connection to MRT-3 Ayala

### Architecture decision

One Ayala should **not** become a mobility “system.”

It remains:
- a canonical `transport-terminal` Place;
- a transfer hub connected to multiple transport systems/services.

The current Mobility page’s Google Maps search link is redundant because BetterMakati already has a canonical One Ayala Place record.

Later page work should make the internal Place record the primary destination and keep the first-party Ayala source as supporting evidence.

Do not infer:
- a complete current route roster;
- operator continuity for every route;
- fares/schedules.

---

## 5. Century City Shuttle / E-Bus

### Decision

**CURRENT / OPERATING — canonicalize later as a private estate shuttle/service, not as a public transport system.**

Strong first-party 2026 source:
- https://www.century-properties.com/clean-convenient-connected-commuting-to-makati-just-got-easier/

Current route/schedule portal:
- https://ccth.framer.ai/

Century Properties states on May 30, 2026 that the Century City Shuttle is fully operational.

The first-party article describes:
- Century City Mall as the main terminal;
- service to MRT-3 Buendia Station;
- service to One Ayala / McKinley Exchange;
- electric vehicles;
- GETPASS cashless payment.

The article also publishes a fare and weekday schedule as of May 2026.

### Classification

This service is not equivalent to MRT-3, EDSA Busway or Pasig River Ferry.

Later canonical type should distinguish:
- **private estate shuttle / local circulator**
from
- regulated / publicly operated mass-transit systems.

### Volatility policy

Do not freeze the May fare or timetable into durable canonical facts unless the user-facing page is prepared to recheck them frequently.

The CCTH page is better for live route/schedule handoff.

Stable:
- service identity
- private-estate shuttle classification
- Century City Mall hub
- links to Buendia and One Ayala / McKinley Exchange
- Century Properties / Century City estate involvement

Volatile:
- fare
- departure schedule
- exact stop sequence

---

## 6. Ride-hailing / app-based mobility

These are current external mobility services shown for convenience. They should remain **external service links**, not Makati civic Places or public-transport systems.

### Grab

Current official Philippines source:
- https://www.grab.com/ph/transport/
- https://www.grab.com/ph/download/

Status:
- **CURRENT**
- current first-party site offers ride-hailing / private-hire mobility in the Philippines.

Page classification:
- app-based car / taxi mobility

### Angkas

Current official consumer source:
- https://www.angkas.com/consumer

Status:
- **CURRENT**
- first-party consumer page continues to offer transportation booking.

Page classification:
- app-based motorcycle transport

### JoyRide

Current official source:
- https://joyride.com.ph/

Status:
- **CURRENT**
- first-party site currently lists MC Taxi, Car, Taxi and other mobility services.

Page classification:
- multi-mode app-based mobility

### MOVE IT

Current official sources:
- https://moveit.com.ph/how-it-works/
- https://moveit.com.ph/home

Status:
- **CURRENT**
- first-party material identifies MOVE IT as an on-demand motorcycle-taxi booking platform.

An older official service-area page includes Makati:
- https://moveit.com.ph/service-areas/

Do not treat the older service-area page as proof of a permanently fixed geographic service area. Booking availability should remain app-determined.

Page classification:
- app-based motorcycle taxi

---

## Reconciliation table

| Family | Current status | Canonical role | Preferred authority / link | Do not freeze |
| --- | --- | --- | --- | --- |
| MRT-3 | Operating | Public transport system | DOTr MRT-3 | timetable/headway |
| EDSA Busway | Operating | Public transport system | DOTr / PIA government evidence | total stops, construction/opening dates, timetable |
| Pasig River Ferry | Operating | Public transport system | MMDA-backed government current evidence | trip schedule, systemwide denominator |
| One Ayala | Operating | Physical intermodal Place / transfer hub | BetterMakati Place + Ayala Land | full route roster / fares |
| Century City Shuttle | Operating | Private estate shuttle/service | Century Properties + CCTH | fare, timetable, exact live stop sequence |
| Grab | Current | External app-based mobility | Grab PH | availability/fare |
| Angkas | Current | External app-based mobility | Angkas | availability/fare |
| JoyRide | Current | External app-based mobility | JoyRide PH | availability/fare |
| MOVE IT | Current | External app-based mobility | MOVE IT | availability/fare/service-area permanence |

---

## Corrections to carry into W5-4c / W5-4f

1. **Add Pasig River Ferry to the system-level Mobility presentation.**
   It has two canonical Makati stations and current 2026 operating evidence.

2. **Stop treating One Ayala as an external-only card.**
   Its BetterMakati Place record should be the primary internal destination.

3. **Label Century City Shuttle as a private estate shuttle.**
   Do not present it at the same semantic level as MRT-3 / EDSA Busway / MMDA ferry without the distinction.

4. **Do not treat edsabus.com as the Busway authority.**
   It can be a secondary commuter reference only.

5. **Retain ride-hailing as external service links.**
   Do not create Civic Map points or civic-system entities for Grab, Angkas, JoyRide or MOVE IT.

6. **Update Mobility’s review date when the page is rebuilt.**
   The current page says 2026-09-20; this reconciliation is 2026-09-27.

7. **Do not copy volatile schedules/fares into static cards by default.**
   Use first-party/current links for live operational details.

---

## Canonical-model implications

W5-4c should introduce two concepts, not one:

### Transport system / service

Examples:
- MRT-3
- EDSA Busway
- Pasig River Ferry Service
- Century City Shuttle

Required distinction:
- public mass-transit system
- public ferry
- private estate shuttle / circulator

### Physical transport Place

Examples:
- MRT-3 Ayala Station
- EDSA Busway Ayala Station
- Guadalupe Ferry Station
- One Ayala Terminal

The system/service model should reference member Place IDs rather than duplicate station names and addresses.

Ride-hailing apps remain outside both canonical sets as external mobility resources.

## Next micro-step

**W5-4c — introduce the canonical mobility-system/service schema and populate exactly four current services: MRT-3, EDSA Busway, Pasig River Ferry Service and Century City Shuttle.**

Do not create route polylines yet.

One Ayala remains a Place and should be linked as a transfer hub in W5-4d. Ride-hailing remains external-resource data for the later Mobility page rebuild.
