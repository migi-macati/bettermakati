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

Preferred first mailbox:

- `hello@bettermakati.org`

Use the existing BetterMakati contribution/correction forms for structured corrections and source submissions even after a mailbox is created.

Do not publish the address on the site until the mailbox can both receive and send successfully.

## Social identity

Preferred account/page name: **BetterMakati**

Preferred username where available: **@BetterMakati** or **@bettermakati**.

Priority launch channel:

1. Facebook Page
2. Instagram / Threads username reservation
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

## External-account actions still requiring account-owner access

Some launch steps cannot be completed from repository automation alone because they require owner authentication or provider-generated verification tokens:

- upstream BetterLGU pull-request submission
- GitHub repository About/Homepage website field
- Google Search Console property creation and DNS verification token
- Bing Webmaster Tools import
- Dynadot mailbox creation
- Facebook / Instagram account or Page creation

After those one-time account actions, BetterMakati can automate or document the ongoing workflows where supported.
