/**
 * IRONIX Fit Intelligence — Interactive Prototype Logic
 * 
 * Purpose:
 * Demonstrates deterministic size recommendations for "The Keeper" ribbed athletic tank.
 * Explicitly resolves overlapping size boundaries (38", 40", 42") and adjusts for
 * customer fit preference (Regular, Relaxed, Close).
 */

(() => {
  // Published size matrix for The Keeper
  const SIZES = [
    { name: "S",  min: 36, max: 38, length: 26, variantId: null },
    { name: "M",  min: 38, max: 40, length: 27, variantId: null },
    { name: "L",  min: 40, max: 42, length: 28, variantId: null },
    { name: "XL", min: 40, max: 44, length: 28, variantId: null }
  ];

  // DOM element helper
  const $ = (id) => document.getElementById(id);

  let currentRecommendation = null;

  /**
   * Main recommendation engine
   */
  function recommendSize() {
    const rawChest = $("chest").value.trim();
    const chest = Number(rawChest);
    const fit = $("fit").value;

    // Reset error state
    $("error").textContent = "";

    // 1. Guardrail validation: Must be a finite number between 28 and 60 inches
    if (!rawChest || !Number.isFinite(chest) || chest < 28 || chest > 60) {
      $("error").textContent = "Please enter a valid chest measurement between 28 and 60 inches.";
      $("result").classList.add("hidden");
      return;
    }

    // 2. Chart coverage validation: Chart covers 36 to 44 inches
    if (chest < 36 || chest > 44) {
      $("error").textContent = 
        `Your chest (${chest}") falls outside our standard 36–44" range. Please contact IRONIX for bespoke or manual sizing assistance.`;
      $("result").classList.add("hidden");
      return;
    }

    // 3. Core matching logic:
    // When ranges overlap (e.g. 38" in S & M, 40" in M, L & XL), find the first size
    // whose range contains the chest measurement. This transparently defaults to the
    // snugger athletic fit intended for 220 GSM ribbed fabric.
    let index = SIZES.findIndex(s => chest >= s.min && chest <= s.max);

    // Fallbacks if outside standard indices
    if (index < 0) {
      index = chest < 36 ? 0 : 3;
    }

    // 4. Fit preference adjustment:
    // - "Relaxed": shifts up 1 size for extra torso & armhole room (up to XL)
    // - "Close": shifts down 1 size if near the lower boundary for compression fit
    if (fit === "relaxed" && index < SIZES.length - 1) {
      index += 1;
    } else if (fit === "close" && index > 0 && chest <= SIZES[index].min + 0.5) {
      index -= 1;
    }

    currentRecommendation = SIZES[index];

    // 5. Update UI presentation
    $("size").textContent = currentRecommendation.name;
    $("result-title").textContent = `SIZE ${currentRecommendation.name}`;

    const fitLabel = fit === "relaxed" 
      ? "relaxed (+1 size room)" 
      : fit === "close" 
        ? "closer compression" 
        : "regular athletic";

    $("reason").textContent = 
      `For a ${chest}" chest with a ${fitLabel} preference, Size ${currentRecommendation.name} (${currentRecommendation.min}–${currentRecommendation.max}") provides the best match.`;

    // 6. Transparent boundary caveat
    const isBoundary = (chest === 38 || chest === 40 || chest === 42);
    if (isBoundary) {
      $("caveat").textContent = 
        `Notice: A ${chest}" chest sits directly on an overlapping chart boundary. We recommended Size ${currentRecommendation.name} based on your selected fit preference. If you prefer a looser drape, consider sizing up.`;
      $("caveat").classList.remove("hidden");
    } else {
      $("caveat").textContent = 
        `Guidance note: Sizing is based on published IRONIX chart dimensions. In production, recommendations can be further refined with garment stretch data.`;
      $("caveat").classList.remove("hidden");
    }

    // 7. Render size spectrum chips
    $("size-row").innerHTML = SIZES.map((s, i) => `
      <div class="size-chip ${i === index ? 'active' : ''}">
        <strong>${s.name}</strong>
        <small>${s.min}–${s.max}"</small>
        ${i === index ? '<span class="chip-badge">RECOMMENDED</span>' : ''}
      </div>
    `).join("");

    // 8. Show result panel and clear previous cart message
    $("result").classList.remove("hidden");
    $("cart-message").textContent = "";

    // Smooth scroll down to result on smaller screens
    $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /**
   * Reset the tool and return focus to the input
   */
  function resetForm() {
    $("result").classList.add("hidden");
    $("error").textContent = "";
    $("cart-message").textContent = "";
    $("chest").focus();
  }

  /**
   * Simulate adding recommended size to cart
   */
  function handleAddToCart() {
    if (!currentRecommendation) return;
    $("cart-message").textContent = 
      `✓ Demo simulation: Size ${currentRecommendation.name} selected. In live Shopify store, this triggers an Ajax POST to /cart/add.js with the variant ID.`;
  }

  // Attach event listeners
  $("recommend").addEventListener("click", recommendSize);
  $("reset").addEventListener("click", resetForm);
  $("add").addEventListener("click", handleAddToCart);

  // Allow pressing Enter in the input field to trigger recommendation
  $("chest").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      recommendSize();
    }
  });

  // Check URL parameters for automated testing, deep-linking and screenshot captures
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("chest")) {
    $("chest").value = urlParams.get("chest");
  }
  if (urlParams.has("fit")) {
    $("fit").value = urlParams.get("fit");
  }
  if (urlParams.get("auto") === "1" || urlParams.get("recommend") === "true") {
    recommendSize();
  }
})();
