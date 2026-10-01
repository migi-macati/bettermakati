# W8-1 — English / Filipino language foundation

Status: implementation

## Product scope

BetterMakati supports exactly two interface languages:

- **ENG — English**
- **FIL — Filipino**

English remains the default. A visitor's explicit language choice persists locally. Changing language must update the document `lang` attribute so assistive technology receives the correct language context.

## Filipino editorial policy

FIL means natural contemporary Filipino as used by modern Makati residents. It is not a requirement to translate every English word into a formal or respelled Tagalog equivalent.

Use Filipino sentence structure and vocabulary where it sounds natural. Keep familiar English words when replacing them would sound forced, archaic, overly formal, or unlike ordinary civic conversation.

In particular:

- Keep proper nouns, official names, program names, agency names and legally meaningful terminology accurate.
- Keep common English civic and digital terms when they are the natural term in use.
- Prefer **budget**, **jeep** and **record** over artificial respellings such as `badyet`, `dyip` and `rekord`.
- Avoid conyo constructions that mechanically attach Filipino particles or prefixes to otherwise English sentences.
- Avoid literal word-for-word translation.
- Prioritize clarity: a resident should understand what a control, service, requirement or record means on first reading.
- Do not translate factual quotations, document titles or official labels when doing so could change their meaning; explanatory Filipino can sit around them where useful.

## Architecture

`src/i18n.ts` is the single production i18n entry point. It uses i18next with the HTTP locale backend and browser language detection.

Supported language codes are centralized in `src/i18n/languages.ts`. No additional Philippine-language codes are part of Wave 8.

The shell language control uses short labels **ENG** and **FIL**. The visible labels are deliberately language-neutral so a visitor can always switch back.

## Rollout rule

W8-1 establishes the language mechanism and policy. Page content is migrated in bounded page-family slices. English remains the fallback while a page family is being migrated, preventing partially translated keys from breaking navigation or hiding information.
