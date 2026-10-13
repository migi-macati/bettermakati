# Accountability source review dates — BM-ORD-001

The ledger overview date is not a record-specific source review date.

City Monitor publishers may set `sourceReviewedOn` only when the review date
is documented. Publication dates, event dates, deadlines, source update dates,
and Git commit timestamps do not independently establish a source review.
An absent review date becomes `null` in the derived Accountability entry,
“Not recorded” in English, “Walang nakatalang petsa” in Filipino, and `Unknown`
in the CSV export. Do not fill this gap with the page date or today's date.

Procurement records derived from the canonical accountability supplement retain
that record's `lastVerified` date. Source publication/effective dates remain
separate and unchanged. The ledger overview keeps its existing September 24
review date, explicitly labeled as the overview review.

Reproduced: October 2 PhilGEPS notices and records describing October 8 updates
inherited September 24 from `accountabilityReviewed`. The monitor-to-ledger
procurement and commitment adapters now propagate record review metadata only.
No procurement amount, award claim, deadline, source URL or article is changed.

Acceptance: the four affected PhilGEPS cards show unknown review dates, while
the derived BS25-03-OE07 record retains September 25. Regression coverage in
`critical-paths.spec.mjs` exercises English desktop and Filipino mobile output.
CI, merge, deployment and live verification must be tracked separately; this
implementation alone does not close the production acceptance check.
