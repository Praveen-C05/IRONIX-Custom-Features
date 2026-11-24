/**
 * IRONIX Custom Storefront Features & Behaviour Intelligence
 * 
 * Includes:
 * 1. Fit Intelligence (Size Recommendation Form & Logic)
 * 2. Behaviour-Based Product Recommendations & Browsing Signals
 * 3. Personalised Fit Guidance
 * 4. Cart Abandonment Assistance
 * 5. Customer Feedback Category Tracking
 * 6. Analytics & Success Measurement Events
 */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. FIT INTELLIGENCE (SIZE RECOMMENDATION)
  // ==========================================

  const fitForm = document.getElementById("fitForm");

  if (fitForm) {
    fitForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const chest = Number(document.getElementById("chest").value);
      const waist = Number(document.getElementById("waist").value);
      const height = Number(document.getElementById("height").value);
      const preference = document.getElementById("fitPreference").value;
      const result = document.getElementById("fitResult");

      // Validate inputs against guardrails
      if (
        !Number.isFinite(chest) ||
        !Number.isFinite(waist) ||
        !Number.isFinite(height) ||
        chest < 28 || chest > 60 ||
        waist < 24 || waist > 60 ||
        height < 120 || height > 220
      ) {
        result.textContent = "Please enter valid measurements.";
        return;
      }

      if (waist >= chest) {
        result.textContent = "Please check your measurements.";
        return;
      }

      // Illustrative chart only.
      // Replace with verified IRONIX measurements in production.
      const sizes = [
        { name: "S", min: 36, max: 38 },
        { name: "M", min: 38, max: 40 },
        { name: "L", min: 40, max: 42 },
        { name: "XL", min: 42, max: 44 }
      ];

      let selectedIndex = sizes.findIndex(
        size => chest >= size.min && chest < size.max
      );

      if (chest === 44) {
        selectedIndex = 3;
      }

      if (selectedIndex === -1) {
        result.textContent =
          "Your measurement is outside our sample size chart. Contact IRONIX for assistance.";
        return;
      }

      // Adjust based on fit preference
      if (preference === "body") {
        selectedIndex = Math.max(0, selectedIndex - 1);
      } else if (preference === "relaxed") {
        selectedIndex = Math.min(sizes.length - 1, selectedIndex + 1);
      }

      const recommendedSize = sizes[selectedIndex].name;

      result.innerHTML = `
        <div class="ix-result">
          <h3>Recommended Size: ${recommendedSize}</h3>
          <p>Based on your measurements and preferred fit.</p>
          <p>This is an illustrative recommendation, not a guaranteed fit.</p>
        </div>
      `;

      // Trigger analytics event
      trackIronixEvent(IRONIX_EVENTS.FIT_RECOMMENDATION_USED, {
        recommendedSize,
        preference,
        chest,
        waist
      });
    });
  }


  // ==========================================
  // 2. BEHAVIOUR-BASED PRODUCT RECOMMENDATIONS
  // ==========================================

  const recommendationContainer = document.getElementById("recommendedProducts");
  const currentProductId = document.querySelector("[data-product-id]")?.dataset.productId;
  const STORAGE_KEY = "ironix_recently_viewed";

  let recentlyViewed = [];
  try {
    recentlyViewed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    recentlyViewed = [];
  }

  if (currentProductId) {
    recentlyViewed = [
      currentProductId,
      ...recentlyViewed.filter(id => String(id) !== String(currentProductId))
    ].slice(0, 8);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }

  async function loadRecommendations() {
    if (!recommendationContainer) return;

    if (!currentProductId) {
      recommendationContainer.textContent = "Explore our product collection.";
      return;
    }

    try {
      const response = await fetch(
        `/recommendations/products.json?product_id=${encodeURIComponent(currentProductId)}&limit=4&intent=related`
      );

      if (!response.ok) {
        throw new Error("Recommendation request failed");
      }

      const data = await response.json();
      const products = data.products || [];

      recommendationContainer.innerHTML = "";

      if (products.length === 0) {
        recommendationContainer.textContent = "No recommendations available yet.";
        return;
      }

      products.forEach(product => {
        const card = document.createElement("a");
        card.className = "ix-product";
        card.href = product.url;

        card.addEventListener("click", () => {
          trackIronixEvent(IRONIX_EVENTS.PRODUCT_RECOMMENDATION_CLICKED, {
            productId: product.id,
            productTitle: product.title
          });
        });

        const image = document.createElement("img");
        image.src = product.featured_image || product.image || "";
        image.alt = product.title;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = product.title;

        const price = document.createElement("p");
        price.textContent = "₹" + (Number(product.price) / 100).toFixed(0);

        card.append(image, title, price);
        recommendationContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Recommendation error:", error);
      recommendationContainer.textContent = "Explore our latest products.";
    }
  }

  loadRecommendations();


  // ==========================================
  // 3. CART ABANDONMENT ASSISTANCE
  // ==========================================

  if (window.location.pathname === "/cart") {
    trackCartActivity();

    const cartContainer = document.querySelector("main") || document.body;
    const assistance = document.createElement("div");
    assistance.className = "ix-cart-assistance";
    assistance.innerHTML = `
      <h3>Need help with your order?</h3>
      <p>Not sure about your size? Review our fit guide before checkout.</p>
      <a href="/pages/faqs">Get Shopping Help</a>
    `;

    cartContainer.prepend(assistance);

    const help = document.getElementById("cartBehaviourHelp");
    if (help) {
      help.style.display = "block";
    }

    trackIronixEvent(IRONIX_EVENTS.CART_ASSISTANCE_VIEWED, {
      path: "/cart"
    });
  }


  // ==========================================
  // 4. CUSTOMER FEEDBACK INTELLIGENCE
  // ==========================================

  const feedbackForm = document.getElementById("IronixFeedback");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function () {
      const category = document.getElementById("feedbackType")?.value;
      console.log("Feedback category submitted:", category);

      trackIronixEvent(IRONIX_EVENTS.CUSTOMER_FEEDBACK_SUBMITTED, {
        category: category
      });
    });
  }


  // ==========================================
  // 5. PERSONALISED FIT GUIDANCE
  // ==========================================

  const fitDescriptions = {
    body: "Body Hugging: A close-fitting style that follows your body shape.",
    regular: "Regular Athletic: A balanced fit designed for everyday comfort and movement.",
    relaxed: "Relaxed: A looser fit offering additional room and comfort."
  };

  document.querySelectorAll("[data-fit-guide]").forEach(button => {
    button.addEventListener("click", () => {
      const preference = button.dataset.fitGuide;
      const result = document.getElementById("fitGuidanceResult");

      if (result) {
        result.textContent = fitDescriptions[preference];
      }

      trackIronixEvent(IRONIX_EVENTS.FIT_GUIDANCE_SELECTED, {
        preference: preference
      });
    });
  });


  // ==========================================
  // 6. BEHAVIOUR-BASED RECOMMENDATION SIGNALS
  // ==========================================

  const currentProduct = document.querySelector("[data-product-handle]");
  if (currentProduct) {
    trackProductView(currentProduct.dataset.productHandle);
  }

  const behaviourContainer = document.getElementById("behaviourRecommendations");
  if (behaviourContainer) {
    const interests = getCustomerInterests();
    if (interests.length > 0) {
      const paragraph = document.createElement("p");
      paragraph.textContent = "Your frequently explored categories: " + interests.join(", ");
      behaviourContainer.appendChild(paragraph);
    }
  }

  const feedbackCategory = document.getElementById("feedbackType");
  if (feedbackCategory) {
    feedbackCategory.addEventListener("change", () => {
      trackShoppingActivity("feedback_category_selected", feedbackCategory.value);
    });
  }

  // Track category clicks across collections
  document.querySelectorAll("[data-ix-category]").forEach(link => {
    link.addEventListener("click", () => {
      const category = link.dataset.ixCategory;
      trackCategoryInterest(category);
    });
  });

});


// ==========================================
// CUSTOMER BEHAVIOUR TRACKING UTILITIES
// ==========================================

const IRONIX_BEHAVIOUR_KEY = "ironix_customer_behaviour";

function getBehaviourData() {
  try {
    return JSON.parse(localStorage.getItem(IRONIX_BEHAVIOUR_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveBehaviourData(data) {
  localStorage.setItem(IRONIX_BEHAVIOUR_KEY, JSON.stringify(data));
}

function trackProductView(product) {
  const data = getBehaviourData();
  data.views = data.views || [];
  data.views.push({
    product: product,
    timestamp: new Date().toISOString()
  });
  data.views = data.views.slice(-30);
  saveBehaviourData(data);
}

function trackCategoryInterest(category) {
  const data = getBehaviourData();
  data.categories = data.categories || {};
  data.categories[category] = (data.categories[category] || 0) + 1;
  saveBehaviourData(data);
}

function trackShoppingActivity(action, product) {
  const data = getBehaviourData();
  data.activities = data.activities || [];
  data.activities.push({
    action: action,
    product: product,
    timestamp: new Date().toISOString()
  });
  data.activities = data.activities.slice(-50);
  saveBehaviourData(data);
}

function trackCartActivity() {
  const data = getBehaviourData();
  data.cart = {
    lastVisited: new Date().toISOString(),
    status: "cart_visited"
  };
  saveBehaviourData(data);
}

function getCustomerInterests() {
  const data = getBehaviourData();
  const categories = data.categories || {};
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(item => item[0]);
}


// ==========================================
// SUCCESS MEASUREMENT ANALYTICS EVENTS
// ==========================================

const IRONIX_EVENTS = {
  FIT_RECOMMENDATION_USED: "fit_recommendation_used",
  PRODUCT_RECOMMENDATION_CLICKED: "product_recommendation_clicked",
  FIT_GUIDANCE_SELECTED: "fit_guidance_selected",
  CART_ASSISTANCE_VIEWED: "cart_assistance_viewed",
  CUSTOMER_FEEDBACK_SUBMITTED: "customer_feedback_submitted"
};

function trackIronixEvent(eventName, details = {}) {
  console.log("IRONIX Analytics Event:", {
    event: eventName,
    details: details,
    timestamp: new Date().toISOString()
  });
}
