# Custom Shopify Feature Proposals

This document outlines two custom Shopify features tailored for IRONIX:
1. **Fit Intelligence** (Implemented Prototype) — An on-page size recommendation and stock-aware add-to-cart widget.
2. **Smart Combo Builder** (Proposed Extension) — A guided multi-pack/bundle builder that drives higher Average Order Value (AOV).

---

## 1. Fit Intelligence (Built Prototype)

### The Problem
* **Sizing Confusion:** Buying fitted apparel online is risky for customers when size charts are ambiguous.
* **Overlapping Ranges:** The current public chart for *The Keeper* tank has overlapping chest measurements:
  * **S:** 36–38 in
  * **M:** 38–40 in
  * **L:** 40–42 in
  * **XL:** 40–44 in
* **Shopper Hesitation:** A customer with a 38" or 40" chest is caught on a boundary and cannot confidently decide, causing hesitation, cart abandonment, or preventable returns.

### How It Works (User Flow)
1. **Input:** Shoppers enter their chest circumference and select their fit preference (*Athletic / Standard* or *Relaxed*).
2. **Deterministic Recommendation:** A rule-based algorithm resolves chart overlaps by picking the best baseline size, bumping up one size if *Relaxed* is selected.
3. **Inventory Check ("Fall-Forward"):** The tool immediately checks live Shopify variant stock. If the recommended size is sold out, it transparently suggests the next larger available size rather than failing.
4. **Direct Add-to-Cart:** Adds the recommended variant ID straight to the cart via the Shopify Ajax API (`/cart/add.js`) without reloading the page.
5. **Zero Data Tracking:** All measurements stay client-side in the customer's browser for maximum privacy.

### Why This Matters for IRONIX
* *The Keeper* is a snug 220 GSM ribbed athletic tank where fit precision directly impacts customer satisfaction.
* Resolving sizing uncertainty right on the product page directly reduces returns and boosts checkout conversions.
* *Note:* In production, the sizing logic should be updated with IRONIX’s verified factory garment grading and fit-trial data.

### Implementation Status
* **Demo:** Fully functional standalone demo (`demo/index.html`, `demo/app.js`, `demo/styles.css`).
* **Theme Asset:** Production-ready Online Store 2.0 section (`shopify/sections/fit-intelligence.liquid`).

---

## 2. Smart Combo Builder (Proposed Extension)

### The Problem & Opportunity
* **Combo Promotion Friction:** IRONIX actively highlights "The Keeper Combo" and multi-unit savings.
* **Selection Burden:** Customers interested in multi-packs must manually find, configure, and match sizes across different items while ensuring their combination qualifies for promotional pricing.
* **Risk of Abandonment:** If an item in their mix is out-of-stock or bundle rules are unclear, shoppers get frustrated and drop off.

### Proposed Solution
A guided, interactive bundle panel placed directly on product and collection pages:

1. **Step 1: Pick a Tier**  
   Shoppers select an advertised bundle deal (e.g., "Buy Any 2" or "Buy Any 3").
2. **Step 2: Choose Items & Sizes**  
   Shoppers select their desired colours and sizes per slot. Out-of-stock options are disabled in real-time.
3. **Step 3: Instant Savings Preview**  
   Displays a live total with discount savings calculated before checkout.
4. **Step 4: 1-Click Cart Addition**  
   Adds all selected line items together in a single API request once bundle criteria are complete.

### Context-Aware Personalisation (Behavioural Triggers)
Rather than guessing personal attributes, the builder adapts dynamically based on session behaviour:
* **Quantity Jump:** When a customer increases quantity to 2+, display a prompt: *"Upgrade to a 2-Pack Combo and save \$X"*.
* **Revisited Product:** If a visitor views multiple colours or returns to the product page within the same session, present a multi-item starter bundle.
* **Measurement:** Validate conversion lift and Average Order Value (AOV) using event analytics before rolling out storewide.

### Technical Architecture on Shopify
* **Configuration:** Bundle tiers, eligible products, and tier discounts are managed via Section Settings or Product Metafields.
* **Variant & Stock Retrieval:** Dynamically fetched via Shopify’s Storefront API or Ajax endpoints.
* **Add-to-Cart:** Submits an array of line items in a single `/cart/add.js` payload.
* **Pricing Integrity:** To avoid client-side tampering, final promotional pricing should be validated on the server side using **Shopify Functions (Discounts)** or a native Shopify bundle backend.

### Edge Case Handling
* **Out-of-Stock Variants:** Gray out unavailable options and prevent bundle submission if any chosen slot is unavailable.
* **Tier Qualification:** Recalculate totals immediately if an item is removed; revert to standard pricing if bundle minimums are no longer met.
* **Cart API Failures:** Gracefully catch and display Shopify cart error responses (e.g., inventory limits exceeded) with clear, actionable UI messaging.

