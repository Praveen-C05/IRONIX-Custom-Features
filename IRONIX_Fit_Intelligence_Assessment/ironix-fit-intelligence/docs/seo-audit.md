# IRONIX SEO + AI Discovery Audit
**Candidate:** Praveen P · **Review date:** 24 November 2026  
**Scope:** Public storefront only. No Shopify admin, Search Console, GA4, crawl logs or conversion data were accessed.

## Executive view
The highest-value work is not adding generic keywords. It is resolving conflicting product information, strengthening product entity data, and turning the current narrow catalogue into crawlable, useful discovery paths. The live storefront presents IRONIX as premium activewear/gym wear and currently features The Keeper ribbed tank.

## Five priority opportunities

| Priority / URL | Public observation | Why it matters | Specific fix |
|---|---|---|---|
| P0 — `/products/ironix-rib-tank-black` | Public page lists chest ranges S 36–38, M 38–40, L 40–42, XL 40–44 inches. Ranges overlap at 38 and 40–42. Description calls the fit “regular athletic” and says it is not heavily compressed. | Ambiguous sizing creates decision friction and can cause wrong-size orders. | Confirm whether chart values are body or garment measurements. Publish separate body-fit ranges and finished garment measurements. Add Fit Intelligence with boundary handling and inventory-aware variant selection. |
| P0 — `/pages/faqs` | Return-window answer contains an editorial placeholder: “[2 days from delivery]”. | Visible unfinished policy content undermines trust and conflicts with a live policy. | Replace placeholder with approved 48-hour window, or link directly to the current policy. Add a release checklist to prevent editorial placeholders from publishing. |
| P1 — `/products/ironix-rib-tank-black` | Product copy contains useful specifics (220 GSM, 95% combed ring-spun cotton, 5% elastane, 2×2 rib, bio-washed finish), but those facts should be consistently structured and visible. | Specific attributes help shoppers compare and give crawlers explicit product context. | Add structured product highlights, concise material/fit/care sections, descriptive image alt text and variant-specific Product/Offer JSON-LD. Check for duplicate schema before adding. |
| P1 — `/collections/all` and `/collections` | Public collection surface is small (four items in All; collection navigation includes Ribbed Vests Plane / Combo Ribs). | Thin or overlapping collection paths make product discovery less descriptive. | Build curated collection landing pages such as “Ribbed Gym Tanks” and “Gym-to-Street Essentials”, with unique 150–250 word intros, product links, FAQs only where genuinely useful, and self-canonical URLs. Avoid empty/near-duplicate collections. |
| P2 — `/` and product pages | Homepage identifies brand/product category, but crawlable internal links and answer-first buying guidance can be expanded. | Internal links clarify topical relationships and help discovery beyond a single product URL. | Add homepage links to fit guide, fabric/quality explainer, collections and shipping/returns. Add a short “Who this tank is for / fit / fabric / care” block on product pages and contextual links to related products. |

## Shopify implementation plan

| Order | Work | Shopify implementation | Impact / effort |
|---|---|---|---|
| 1 | Resolve chart and FAQ inconsistency | Product metafields for body chest min/max, fit note, fabric GSM and care; edit FAQ page content after policy-owner confirmation. | High / Low–Medium |
| 2 | Fit Intelligence | OS 2.0 product section using product variants and availability; validate measurements client-side; add selected variant through `/cart/add.js`. | High / Medium |
| 3 | Product entity/schema QA | Audit rendered HTML and JSON-LD; use theme snippet only if schema is missing/incomplete; validate with Rich Results Test and Schema Markup Validator. | Medium–High / Medium |
| 4 | Collection content + internal links | Shopify collection descriptions, custom collection templates, product recommendations and contextual links. | Medium / Low |
| 5 | Technical hygiene | Check canonical tags, sitemap.xml, robots.txt, redirects, image dimensions/alt text, mobile CWV and indexability. | Medium / Medium |

## Three practical AI-discovery steps

1. **Make product facts explicit and consistent.** Use stable product fields for fabric composition, GSM, fit, sizing, country of origin, care and returns. Render important facts in HTML text and matching structured data. This is sound SEO/entity hygiene; it does not guarantee citation in an AI answer.
2. **Publish useful, answer-first pages.** Add a genuinely helpful size/measurement guide and fabric explainer with clear headings, concise direct answers, examples and links to the relevant product. Keep claims consistent with product and policy pages. This improves retrieval clarity, not guaranteed AI visibility.
3. **Maintain crawl access and entity consistency.** Keep important pages indexable, canonicalised and linked; maintain sitemap coverage; use valid Product/Breadcrumb structured data; ensure brand, product names and support/policy facts are consistent. Monitor Search Console indexing and query data. No special “AI schema”, llms.txt file or markup can guarantee Google AI Overview or ChatGPT Search inclusion.

## Proof of execution
Included in this project:
- `shopify/snippets/product-jsonld.liquid`: dynamic Product and Offer JSON-LD using Shopify product/variant values. Install only after checking for existing schema to avoid duplication.
- `shopify/sections/fit-intelligence.liquid`: inventory-aware size recommender using live product variants and Shopify Ajax Cart.

**Verification:** View rendered source and confirm one Product entity, correct variant prices/availability and canonical URL. Run Rich Results Test and Schema Markup Validator. In Shopify theme preview, test valid/invalid chest input, overlapping boundaries, unavailable recommended variant, and successful cart addition.

## Evidence and limitations
Public pages reviewed:
- https://ironix.in/
- https://ironix.in/products/ironix-rib-tank-black
- https://ironix.in/collections/all
- https://ironix.in/pages/faqs
- https://ironix.in/policies/refund-policy
- https://ironix.in/policies/terms-of-service

The FAQ currently has a `[2 days from delivery]` placeholder while the refund policy and terms describe a 2-day/48-hour request window. Confirm final wording with IRONIX before publishing. Product chart ranges are transcribed from the public page; their measurement basis is not stated clearly enough to treat them as validated body-size grading.
