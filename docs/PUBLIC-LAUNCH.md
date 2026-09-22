# BetterMakati Public Launch Operations

Launch date: 2026-09-21

## Canonical public identity

- Canonical website: https://bettermakati.org
- `www.bettermakati.org`: permanent 308 redirect to the canonical root domain
- `bettermakati.vercel.app`: permanent 308 redirect to the canonical root domain
- Production hosting: Vercel
- Registrar / DNS: Dynadot

Do not publish alternate hostnames as public links. Canonical metadata, sitemaps, RSS and social previews should resolve to `https://bettermakati.org`.

## Domain safeguards

Keep these enabled at the registrar:

- automatic renewal
- full WHOIS/privacy protection
- transfer lock
- account multi-factor authentication

Do not enable Dynamic DNS for the production domain.

DNSSEC may be evaluated separately after the production DNS configuration is stable.

## BetterLGU directory

BetterMakati qualifies as **🟢 Active** under the BetterLGU directory definition because it is publicly launched and actively maintained.

Directory target:

- Domain: https://bettermakati.org
- Repository: https://github.com/migi-macati/bettermakati
- Status: 🟢 Active
- Maintainer: @migi-macati

## Search-engine ownership

Preferred Google Search Console setup:

1. Add a **Domain property** for `bettermakati.org`.
2. Verify it with the unique Google-provided DNS TXT record in Dynadot.
3. Submit `https://bettermakati.org/sitemap.xml`.

Preferred Bing Webmaster Tools setup:

1. After Google Search Console verification, use Bing's **Import from Google Search Console** flow.
2. Confirm that the sitemap is imported or submit `https://bettermakati.org/sitemap.xml` manually.

Verification tokens are account-specific and must never be invented or committed unless the verification method explicitly requires a public file.

## Project email

Live mailbox:

- `hello@bettermakati.org` — sending and receiving confirmed by the project owner on 2026-09-22.

Use the existing BetterMakati contribution/correction forms for structured corrections and source submissions. The mailbox is the general public contact channel and is published on the Contact page and footer.

## Social identity

Live project channels:

1. Facebook: https://www.facebook.com/bettermakati — **@bettermakati**
2. Instagram: https://www.instagram.com/bettermakati/ — **@bettermakati**
3. Other channels only when there is a clear publishing workflow

The website remains the canonical archive. Social platforms distribute links and summaries; they should not become the only home of substantive civic records.

## Release discipline

A public launch does not mean the project is complete. Active status means the site is public and continuously maintained.

Continue to require:

- source-watch and City Monitor checks
- structured service-guide verification
- major-page freshness audits
- production build and browser-smoke tests
- accessibility regression checks
- transparent publication of known coverage gaps

## External-account launch actions

Completed by the project owner:

- BetterLGU directory update merged with `bettermakati.org` and 🟢 Active status
- GitHub repository public website field set
- Google Search Console property created and verified; sitemap submitted
- Bing Webmaster Tools setup completed
- `hello@bettermakati.org` created and tested for sending and receiving
- Facebook and Instagram **@bettermakati** created

These account-level confirmations are maintained by the project owner because their provider dashboards are not public.
