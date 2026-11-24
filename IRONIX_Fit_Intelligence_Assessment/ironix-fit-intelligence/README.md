# IRONIX Fit Intelligence — Shopify Assessment

A dark, responsive fit-recommendation prototype for IRONIX, plus Shopify theme integration assets and a focused SEO/AI-discovery audit.

## Project structure
- `demo/index.html` — standalone interactive demo (no build step)
- `demo/styles.css` — dark responsive UI
- `demo/app.js` — recommendation logic, validation, size availability and demo cart
- `shopify/sections/fit-intelligence.liquid` — Online Store 2.0 section; reads product variants and adds the chosen variant through Shopify Ajax Cart
- `shopify/snippets/product-jsonld.liquid` — implementation-ready Product JSON-LD example
- `docs/seo-audit.md` — audit, prioritised implementation plan and AI discovery recommendations
- `docs/custom-feature-proposals.md` — two feature proposals (Fit Intelligence built; Smart Combo Builder proposed)
- `docs/verification.md` — manual QA checklist, verification status and test cases
- `docs/screen-recording-guide.md` — minute-by-minute 3–5 min video presentation script
- `docs/screenshots/` — full visual captures of the demo across desktop, mobile, and boundary states
- `IRONIX_SEO_Audit_PraveenP.pdf` — complete compiled SEO & AI Discovery Audit report for submission
- `ironix-shopify/` — comprehensive 5-feature Shopify theme integration bundle (`assets/`, `sections/`, `snippets/`, plus standalone interactive `index.html`)

## Run the demo
Open `demo/index.html` in a browser. It is dependency-free and uses sample data for The Keeper. Use a local static server if your browser restricts local file behavior:
```bash
python -m http.server 8000
# visit http://localhost:8000/demo/
```

## Shopify installation
1. Duplicate the live theme and work in the unpublished copy.
2. In **Online Store → Themes → Edit code**, add `shopify/sections/fit-intelligence.liquid` under Sections.
3. Add the section to the relevant product JSON template or product page through the theme editor.
4. Confirm the product has size options and variant inventory configured. The section uses real variant IDs, availability and `/cart/add.js`.
5. Add `shopify/snippets/product-jsonld.liquid` only if the theme/app does not already emit valid Product structured data. Avoid duplicate Product JSON-LD.
6. Test on mobile, with sold-out sizes, invalid measurements, and cart drawer behavior.

## Recommendation model
The demo uses the public-facing The Keeper chart as a *prototype input*, not as a verified body-size grading specification. It maps chest measurements to the currently displayed ranges and handles overlapping ranges by selecting the smallest size that accommodates the measurement. Customers between sizes can choose a relaxed preference to move up one available size. In production, replace these assumptions with IRONIX-approved **body measurement** ranges, fit testing and garment ease data.

Current product page publicly displays chest ranges S 36–38, M 38–40, L 40–42, XL 40–44 inches, plus a 220 GSM cotton-rich rib fabric and regular athletic fit. The ranges overlap; this demo makes the tie-break transparent rather than pretending the chart is unambiguous.

## Privacy
Measurements stay in the browser. The prototype does not send body measurements to a server, analytics provider or Shopify cart attributes. If IRONIX later wants aggregate fit analytics, obtain consent, minimise retention and document the purpose in the privacy notice.

## AI disclosure
AI assistance was used to draft and structure the assessment materials. All implementation choices, assumptions and code should be reviewed and explained by the candidate before submission.
