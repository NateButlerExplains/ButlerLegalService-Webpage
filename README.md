# Butler Legal Service Website

A static website for Butler Legal Service, P.L.L.C., a legal consulting and advocacy
practice led by Shatrasha Butler. The attorney is licensed to practice law only in
Missouri and North Carolina.

## Pages

- `index.html` - homepage (About, Services, Community, Contact)
- `accident-claims.html` - Accident Claims & Injury Guidance service page
- `estate-planning.html` - Estate & Legacy Planning service page
- `business-legal-support.html` - Small Business Legal Support service page
- `contract-review.html` - Contract Review & Negotiation service page
- `disclaimer.html` - Disclaimer, sourced from the owner-supplied Disclaimer document
- `privacy.html` - Privacy Policy, sourced from the owner-supplied Privacy Policy document
- `terms.html` - Terms of Use, sourced from the owner-supplied Terms of Use document

## Supporting files

- `styles.css` - responsive visual design (dark green / warm gold / cream, serif display type)
- `script.js` - mobile navigation, header scroll state, and scroll-reveal behavior
- `assets/` - site imagery

The homepage's four service cards link directly to the four dedicated service pages
above. Every page's footer links to the Disclaimer, Privacy Policy, and Terms of Use.

The four service pages use a scannable, marketing-style layout (gold-eyebrow hero with
a serif headline and dual CTAs, a card grid breaking down how the firm helps, a
highlighted "What to Expect" panel, and a closing CTA strip) built from shared
`.service-hero`, `.detail-grid`/`.detail-card`, `.highlight-panel`, and `.notice-panel`
components in `styles.css`. The Disclaimer, Privacy Policy, and Terms of Use pages
remain document-style (`.legal-page` / `.legal-content`) since their content is
canonical legal text.

## Preview

Open `index.html` in a browser, or serve the folder locally, e.g. `python -m http.server`
then visit `http://localhost:8000`. The site can also be published with GitHub Pages.

## Legal content

The Disclaimer, Privacy Policy, and Terms of Use pages contain the firm's canonical legal
text as supplied by the owner. This content should not be rewritten, shortened, or
paraphrased without the owner's explicit direction — treat it as authoritative source
material. Before publishing further changes, have all site copy and policy text reviewed
by the attorney.

## Testing

Playwright tests live in `tests/` and cover page loads, homepage service-card links,
footer link integrity, general internal-link integrity, and mobile navigation behavior.

```
npm install
npx playwright install --with-deps chromium
npm test
```

`npm test` runs `playwright test`, which serves the site locally (via
`python -m http.server`, configured in `playwright.config.js`) and runs the suite against
it. Python 3 must be available on the PATH to run the local test server.
