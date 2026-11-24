# Verification checklist

## Standalone demo
- [x] `28` and `60` inch values are accepted; values outside the 28–60 guardrail are rejected.
- [x] Empty input is rejected with an accessible error.
- [x] 38-inch and 40–42-inch overlapping boundaries show the explanatory caveat.
- [x] Relaxed preference moves up one size where possible.
- [x] Reset hides the recommendation and returns focus to the input.
- [x] Demo cart action clearly says it is a demo and does not claim a live order.
- [x] Visual screenshots captured in `docs/screenshots/` (Desktop, Mobile, Boundary, Error).

## Shopify theme preview
- [x] Product has a Size option and matching S/M/L/XL variants.
- [x] The section maps size labels to actual available variants.
- [x] Sold-out recommended size falls forward to next available size.
- [x] If no suitable variant is available, user gets a clear fallback message.
- [x] Ajax request posts the real variant ID to `/cart/add.js`.
- [x] Cart drawer refresh event is adapted to the active theme (event names differ by theme).
- [x] Liquid code reviewed and structured for interviewer walkthrough.
- [x] Actual size-chart measurement basis confirmed as a prerequisite before production rollout.

## SEO
- [x] Inspect page source for duplicate Product JSON-LD before installing snippet.
- [x] Validate JSON-LD with Google Rich Results Test and Schema Markup Validator.
- [x] Check canonical, title, meta description, robots and sitemap.
- [x] Confirm product facts in JSON-LD match visible page and variant availability.
- [x] Confirm FAQ placeholder is removed only after policy owner approval.
- [x] Full audit report compiled into `IRONIX_SEO_Audit_PraveenP.pdf`.
