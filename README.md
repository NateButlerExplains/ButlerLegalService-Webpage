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
- `privacy.html` - Privacy Policy
- `terms.html` - Terms of Use
- `disclaimer.html` - Disclaimer

## Supporting files

- `styles.css` - responsive visual design (dark green / warm gold / cream, serif display type)
- `script.js` - mobile navigation, header scroll state, and scroll-reveal behavior
- `assets/` - site imagery plus the approved SVG brand mark used for the header logo and favicon

The homepage's four service cards link directly to the four dedicated service pages
above. Every page's footer links to the Privacy Policy, Terms of Use, and Disclaimer.

The four service pages use a scannable, marketing-style layout (gold-eyebrow hero with
a serif headline and dual CTAs, a card grid breaking down how the firm helps, a
highlighted "What to Expect" panel, and a closing CTA strip) built from shared
`.service-hero`, `.detail-grid`/`.detail-card`, `.highlight-panel`, and `.notice-panel`
components in `styles.css`. The Privacy Policy, Terms of Use, and Disclaimer pages remain
document-style (`.legal-page` / `.legal-content`) and retain the approved text from
the approved legal source documents.

## Preview

Open `index.html` in a browser, or serve the folder locally, e.g. `python -m http.server`
then visit `http://localhost:8000`. The site can also be published with GitHub Pages.

## Legal content

The Privacy Policy, Terms of Use, and Disclaimer pages should not be rewritten,
shortened, or paraphrased without the owner's explicit direction. Before publishing
further changes, have all site copy and policy text reviewed by the attorney.

## Testing

Playwright tests live in `tests/` and cover page loads, homepage service-card links,
footer link integrity, general internal-link integrity, branding/favicons, service hero
rendering, and mobile navigation behavior.

```
npm install
npx playwright install --with-deps chromium
npm test
```

`npm test` runs `playwright test`, which serves the site locally (via
`python -m http.server`, configured in `playwright.config.js`) and runs the suite against
it. Python 3 must be available on the PATH to run the local test server. If port `4173`
is already in use, run with `PLAYWRIGHT_PORT=<free-port> npm test`.
