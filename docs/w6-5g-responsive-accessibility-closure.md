# W6-5g — Regression guard & Wave 6 closure

Status: complete-guarded  
Reviewed: 2026-09-30

## Purpose

Convert the completed Wave 6 work into a durable repository gate and formally hand the project to Wave 7 once the closure commit passes CI.

Machine-readable closure:

`data/wave6-responsive-accessibility-closure.json`

Browser proof:

`data/wave6-device-browser-pass.json`

## Wave 6 completion

Wave 6 now has guarded coverage across its five major areas:

1. route/navigation baseline;
2. Search discovery and journey QA;
3. core civic journeys;
4. Civic Intelligence relationships, backlinks and BetterGov/BetterLGU handoffs;
5. responsive/accessibility work from W6-5a through the current-build browser pass.

The existing Wave 6 checks remain in both `npm run quality` and `npm run build`.

W6-5g adds one final closure guard:

`check:wave6-responsive-a11y-closure`

It protects the recorded CI browser proof, five-viewport matrix, representative reflow routes, keyboard/reduced-motion/zoom checks, accessibility-route coverage, CI Chromium setup and the explicit closure boundaries.

## Browser proof used for closure

CI #2205 passed on commit `2b0fd57b4b9c70b1534490296b3fbd095b262ff1`.

That run was the first full green run after the final W6-5f responsive fixes. The closure commit itself must also pass CI because it adds the new guard to both build and quality.

## Boundaries carried forward

Wave 6 closes without claiming more than the evidence proves:

- automated checks support the WCAG 2.2 AA target but are not a formal conformance audit;
- CI runtime proof is Chromium on Ubuntu, not every browser/OS combination;
- manual screen-reader and physical-device sampling remain useful ongoing QA.

These are bounded quality activities, not known unresolved Wave 6 defects.

## Exit rule

Once the closure commit passes CI, **Wave 6 is fully complete and verified**.

The next development slice is:

**Wave 7 — visual & polish phase, starting with W7-1.**
