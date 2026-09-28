# W5-4f3 — Transfer and network presentation

Reviewed: 2026-09-28

## Status

**Complete.**

The Mobility page now renders the explicit interchange relationships already
held in the canonical mobility-network layer.

## Transfer points

Five physical transfer relationships are shown from
`mobilityNetworkRelationships`:

1. MRT-3 Ayala ↔ One Ayala Terminal;
2. EDSA Busway Ayala ↔ One Ayala Terminal;
3. MRT-3 Ayala ↔ EDSA Busway Ayala;
4. MRT-3 Buendia ↔ EDSA Busway Buendia;
5. MRT-3 Guadalupe ↔ EDSA Busway Guadalupe.

Each card uses the canonical Place names, links back to both Place records when
available, carries the relationship note, states whether the evidence is direct
or corroborated, and exposes the cited evidence.

## One Ayala system connections

The page separately renders the two canonical service-to-hub relationships:

- MRT-3 ↔ One Ayala Terminal;
- EDSA Busway ↔ One Ayala Terminal.

These are network relationships rather than duplicate transport-system or route
records.

## Evidence rule

The page does not derive transfers from distance between map points. It renders
only relationships already present in `mobilityNetwork.ts` and resolves their
source references through the canonical network, system and route source
registries.

No Magallanes MRT ↔ Busway transfer is shown because no canonical operating
Magallanes Busway station exists.

## Guard

`check:mobility-page` now verifies that:

- the page consumes the canonical mobility-network registry;
- five explicit transfer relationships remain available;
- two explicit service-to-One-Ayala relationships remain available;
- the transfer and service-hub views are both rendered;
- no Magallanes MRT/Busway transfer is introduced.

## Next micro-step

**W5-4f4 — mobility page cross-link and journey pass.**

Connect the rebuilt systems, anchors, interchanges and route registry more
tightly to Civic Map, search/Civic Intelligence and relevant Area pages, while
keeping door-to-door routing as a live external handoff.
