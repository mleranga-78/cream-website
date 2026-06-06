// Dimark Skincare Core JavaScript Application
// Handles Product Data, Shopping Cart, UI Drawer, and Page-specific interactions

// 1. PRODUCT DATABASE
const PRODUCTS = [
  {
    id: "spot-cream",
    name: "Dimark Brightening & Anti-Spot Cream",
    tagline: "Unveil an even, luminous skin tone with clinical precision.",
    description: "Formulated specifically to target stubborn dark spots, hyperpigmentation, acne marks, and sun damage. This dermatologically-tested cream blends powerful skin brighteners to safely and effectively block melanin production while nourishing the skin barrier.",
    price: 3450,
    rating: 4.9,
    reviewsCount: 142,
    category: "Brightening",
    ingredients: [
      { name: "Alpha Arbutin (2%)", benefit: "Reduces melanin synthesis and hyperpigmentation" },
      { name: "Niacinamide (5%)", benefit: "Strengthens skin barrier and fades dark spots" },
      { name: "Glycolic Acid (AHA)", benefit: "Gently exfoliates dead skin cells for instant glow" },
      { name: "Vitamin E", benefit: "Provides antioxidant protection against environmental damage" }
    ],
    howToUse: [
      "Cleanse your face thoroughly with a gentle cleanser.",
      "Apply a pea-sized amount directly onto hyperpigmented areas or all over the face.",
      "Gently massage in upward circular motions until fully absorbed.",
      "For best results, use twice daily. Always follow with sunscreen in the morning."
    ],
    image: "./assets/images/prod-spot-cream.png",
    badge: "Best Seller",
    sizes: ["50ml", "100ml"]
  },
  {
    id: "night-repair",
    name: "Dimark Advanced Night Repair Cream",
    tagline: "Wake up to firmer, smoother, and deeply rejuvenated skin.",
    description: "An intensive overnight treatment designed to accelerate skin cell renewal while you sleep. Combining cell-communicating retinol with deeply moisturizing botanicals, it targets fine lines, wrinkles, and loss of elasticity to restore a youthful bounce by morning.",
    price: 3850,
    rating: 4.8,
    reviewsCount: 96,
    category: "Anti-Aging",
    ingredients: [
      { name: "Retinol (0.5%)", benefit: "Speeds up cellular turnover and boosts collagen production" },
      { name: "Ceramides NP/AP", benefit: "Restores and locks in moisture barrier" },
      { name: "Hyaluronic Acid", benefit: "Deeply hydrates and plumps skin cells" },
      { name: "Lavender Extract", benefit: "Soothes inflammation and provides natural calming scent" }
    ],
    howToUse: [
      "Use only during your evening (PM) skincare routine.",
      "After cleansing and toning, apply a small amount to your face and neck.",
      "Avoid the immediate eye area.",
      "Start by using 2-3 times per week, gradually increasing frequency as your skin builds tolerance."
    ],
    image: "./assets/images/prod-night-repair.png",
    badge: "Clinical Formula",
    sizes: ["50ml", "100ml"]
  },
  {
    id: "hydra-boost",
    name: "Dimark Hydra-Boost Gel-Cream",
    tagline: "Instant 72-hour hydration burst in a weightless water gel.",
    description: "Specifically engineered for dehydrated and oily-to-combination skin. This ultra-lightweight gel-cream absorbs instantly like a gel but holds the long-lasting moisturizing power of a heavy cream, leaving skin refreshed, bouncy, and oil-free.",
    price: 2900,
    rating: 4.7,
    reviewsCount: 118,
    category: "Hydration",
    ingredients: [
      { name: "Multi-weight Hyaluronic Acid", benefit: "Hydrates different layers of the epidermis" },
      { name: "Centella Asiatica (Cica)", benefit: "Soothes irritation and reduces redness" },
      { name: "Aloe Vera Gel", benefit: "Provides cooling hydration and calms sun exposure" },
      { name: "Squalane", benefit: "Locks in hydration without clogging pores" }
    ],
    howToUse: [
      "Apply evenly to clean face and neck daily.",
      "Can be worn under makeup as a smoothing, hydrating primer.",
      "Apply extra layer on highly dry patches before bed for intensive hydration."
    ],
    image: "./assets/images/prod-hydra-boost.png",
    badge: "Ultra Hydrating",
    sizes: ["50ml", "100ml"]
  },
  {
    id: "sunscreen",
    name: "Dimark UV Defense Sunscreen SPF 50+",
    tagline: "Broad-spectrum daily shield with zero white cast and matte finish.",
    description: "Protect your glow from aging UVA and burning UVB rays. This hybrid chemical-physical sunscreen is formulated to be non-greasy, non-comedogenic (won't clog pores), and perfectly suited for daily wear under makeup or skincare.",
    price: 3200,
    rating: 4.9,
    reviewsCount: 165,
    category: "Sun Protection",
    ingredients: [
      { name: "Zinc Oxide & Titanium Dioxide", benefit: "Reflects UV rays safely away from skin" },
      { name: "Vitamin C (Sodium Ascorbyl Phosphate)", benefit: "Boosts SPF efficacy and brightens skin tone" },
      { name: "Green Tea Extract", benefit: "Calms UV-induced redness and provides antioxidant support" },
      { name: "Silica", benefit: "Absorbs excess oil to keep a soft-focus matte finish" }
    ],
    howToUse: [
      "Apply as the final step of your AM skincare routine, at least 15 minutes before sun exposure.",
      "Use the 'two-finger rule' to apply an adequate amount over face and neck.",
      "Reapply every 2 hours if exposed to direct sunlight, sweating, or swimming."
    ],
    image: "./assets/images/prod-sunscreen.png",
    badge: "SPF 50+ PA+++",
    sizes: ["50ml", "100ml"]
  }
];

// 2. SHOPPING CART STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem("dimark_cart")) || [];
let currentPromo = JSON.parse(localStorage.getItem("dimark_promo")) || null;

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem("dimark_cart", JSON.stringify(cart));
  updateCartUI();
}

// Add Item
function addToCart(productId, size = "50ml", quantity = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Calculate adjusted unit price depending on volume size selected
  const priceMultiplier = size === "100ml" ? 1.7 : 1.0;
  const itemPrice = Math.round(product.price * priceMultiplier);

  const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: itemPrice,
      image: product.image,
      size: size,
      quantity: quantity
    });
  }

  saveCart();
  showToast(`${product.name} added to cart!`);
  openCartDrawer();
}

// Remove Item
function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  saveCart();
  showToast("Item removed from cart");
}

// Update Quantity
function updateQuantity(productId, size, quantity) {
  const item = cart.find(item => item.id === productId && item.size === size);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart();
  }
}

// Apply Promo Code
function applyPromo(code) {
  const formattedCode = code.trim().toUpperCase();
  if (formattedCode === "GLOW15") {
    currentPromo = { code: "GLOW15", discountPercent: 15 };
    localStorage.setItem("dimark_promo", JSON.stringify(currentPromo));
    saveCart();
    return { success: true, message: "Promo code GLOW15 applied! (15% Off)" };
  }
  return { success: false, message: "Invalid promo code" };
}

// Remove Promo Code
function removePromo() {
  currentPromo = null;
  localStorage.removeItem("dimark_promo");
  saveCart();
}

// Calculate Totals
function getCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  if (currentPromo) {
    discount = (subtotal * currentPromo.discountPercent) / 100;
  }
  const total = subtotal - discount;
  return { subtotal, discount, total, promo: currentPromo };
}

// 3. CART DRAWER & BADGES UI UPDATES
function updateCartUI() {
  // Update Header Badges
  const badges = document.querySelectorAll(".cart-count-badge");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  badges.forEach(badge => {
    badge.innerText = totalItems;
    if (totalItems > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });

  // Render Side Cart Drawer List
  const drawerList = document.getElementById("cart-drawer-items");
  const drawerSubtotal = document.getElementById("cart-drawer-subtotal");
  const drawerDiscountRow = document.getElementById("cart-drawer-discount-row");
  const drawerDiscount = document.getElementById("cart-drawer-discount");
  const drawerTotal = document.getElementById("cart-drawer-total");

  if (!drawerList) return; // Drawer not in DOM yet (e.g. if loaded before body)

  if (cart.length === 0) {
    drawerList.innerHTML = `
      <div class="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-40 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="font-serif text-lg text-emerald-900">Your cart is empty</p>
        <p class="text-sm mt-1">Start shopping Dimark formulas today!</p>
        <a href="shop.html" class="mt-4 px-6 py-2 bg-emerald-800 text-white rounded-md hover:bg-emerald-950 transition">Shop Now</a>
      </div>
    `;
    drawerSubtotal.innerText = "Rs. 0";
    drawerDiscountRow.classList.add("hidden");
    drawerTotal.innerText = "Rs. 0";
  } else {
    drawerList.innerHTML = cart.map(item => `
      <div class="flex items-center gap-4 py-4 border-b border-stone-200">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-stone-100 border border-stone-200" />
        <div class="flex-1">
          <h4 class="font-serif text-sm font-semibold text-emerald-900 line-clamp-1">${item.name}</h4>
          <p class="text-xs text-stone-500">Size: ${item.size}</p>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-stone-300 rounded">
              <button onclick="changeQty('${item.id}', '${item.size}', -1)" class="px-2 py-0.5 text-xs bg-stone-100 hover:bg-stone-200">-</button>
              <span class="px-3 text-xs font-semibold">${item.quantity}</span>
              <button onclick="changeQty('${item.id}', '${item.size}', 1)" class="px-2 py-0.5 text-xs bg-stone-100 hover:bg-stone-200">+</button>
            </div>
            <span class="text-sm font-semibold text-stone-800">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        </div>
        <button onclick="removeItem('${item.id}', '${item.size}')" class="text-stone-400 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    `).join("");

    const totals = getCartTotals();
    drawerSubtotal.innerText = `Rs. ${totals.subtotal.toLocaleString()}`;
    if (totals.discount > 0) {
      drawerDiscountRow.classList.remove("hidden");
      drawerDiscount.innerText = `- Rs. ${totals.discount.toLocaleString()}`;
    } else {
      drawerDiscountRow.classList.add("hidden");
    }
    drawerTotal.innerText = `Rs. ${totals.total.toLocaleString()}`;
  }

  // Update Cart Page (if current loaded page is cart.html)
  if (typeof renderCartPage === "function") {
    renderCartPage();
  }
}

// Helper quantity changes inside drawer
window.changeQty = function(id, size, change) {
  const item = cart.find(item => item.id === id && item.size === size);
  if (item) {
    updateQuantity(id, size, item.quantity + change);
  }
};

window.removeItem = function(id, size) {
  removeFromCart(id, size);
};

// 4. COMMON INTERACTION HANDLERS
function openCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  const overlay = document.getElementById("cart-overlay");
  if (drawer && overlay) {
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
}

// Toast System
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "bg-emerald-900 text-white font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-auto border-l-4 border-gold";
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 10);

  // Remove toast
  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 5. GLOBAL DOM INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Mount Header and Footer onto placeholders if they exist
  mountLayouts();
  
  // Set up drawers
  const cartOpenBtn = document.getElementById("cart-open-btn");
  const cartOpenBtnMobile = document.getElementById("cart-open-btn-mobile");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartOverlay = document.getElementById("cart-overlay");

  if (cartOpenBtn) cartOpenBtn.addEventListener("click", openCartDrawer);
  if (cartOpenBtnMobile) cartOpenBtnMobile.addEventListener("click", openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Update Cart interface
  updateCartUI();

  // Run Page-Specific Code
  routePageSpecific();
});

// Mount common header/footers dynamically to reduce boilerplate across pages
function mountLayouts() {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");
  const cartDrawerPlaceholder = document.getElementById("cart-drawer-placeholder");

  const activePage = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = [
    { name: "Home", href: "index.html" },
    { name: "Shop", href: "shop.html" },
    { name: "About Us", href: "about.html" },
    { name: "Contact & Quiz", href: "contact.html" }
  ];

  const linkHtml = navLinks.map(link => {
    const isActive = activePage === link.href;
    return `<a href="${link.href}" class="font-medium text-sm transition-colors ${isActive ? 'text-gold border-b-2 border-gold pb-1' : 'text-emerald-50 hover:text-gold'}">${link.name}</a>`;
  }).join("");

  const mobileLinkHtml = navLinks.map(link => {
    const isActive = activePage === link.href;
    return `<a href="${link.href}" class="block px-4 py-2 font-medium border-l-4 transition-all ${isActive ? 'text-gold border-gold bg-emerald-950' : 'text-stone-300 border-transparent hover:bg-emerald-900'}">${link.name}</a>`;
  }).join("");

  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
      <header class="bg-emerald-900 text-white shadow-md sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="index.html" class="flex items-center gap-2 group">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-gold to-yellow-200 flex items-center justify-center font-bold text-emerald-900 shadow-inner group-hover:scale-105 transition-transform">D</div>
              <span class="font-serif text-2xl font-bold tracking-wider bg-gradient-to-r from-gold to-yellow-200 bg-clip-text text-transparent">DIMARK</span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            ${linkHtml}
          </nav>

          <!-- Action Buttons -->
          <div class="flex items-center gap-4">
            <button id="cart-open-btn" class="relative p-2 text-stone-200 hover:text-gold transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span class="cart-count-badge absolute -top-1 -right-1 bg-gold text-emerald-950 font-bold text-xs h-5 w-5 rounded-full flex items-center justify-center shadow hidden">0</span>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button id="mobile-menu-btn" class="md:hidden p-2 text-stone-200 hover:text-gold transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-emerald-950 border-t border-emerald-800 pb-4">
          <nav class="pt-2 space-y-1">
            ${mobileLinkHtml}
            <button id="cart-open-btn-mobile" class="w-full text-left px-4 py-2 font-medium text-stone-300 hover:bg-emerald-900 flex items-center justify-between">
              <span>View Cart</span>
              <span class="cart-count-badge bg-gold text-emerald-950 font-bold text-xs px-2 py-0.5 rounded-full hidden">0</span>
            </button>
          </nav>
        </div>
      </header>
    `;
  }

  if (cartDrawerPlaceholder) {
    cartDrawerPlaceholder.innerHTML = `
      <div id="cart-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden transition-opacity duration-300"></div>
      <div id="cart-drawer" class="fixed top-0 right-0 h-full w-full sm:w-96 bg-stone-50 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col border-l border-stone-200">
        <div class="p-6 border-b border-stone-200 flex items-center justify-between bg-emerald-900 text-white">
          <h2 class="font-serif text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shopping Bag
          </h2>
          <button id="cart-close-btn" class="p-1 text-stone-200 hover:text-white rounded-full hover:bg-emerald-850">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="cart-drawer-items" class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Dynamic Items inserted here -->
        </div>

        <div class="p-6 border-t border-stone-200 bg-white">
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span id="cart-drawer-subtotal">Rs. 0</span>
            </div>
            <div id="cart-drawer-discount-row" class="flex justify-between text-sm text-emerald-700 hidden">
              <span>Discount (GLOW15)</span>
              <span id="cart-drawer-discount">- Rs. 0</span>
            </div>
            <div class="flex justify-between font-serif text-lg font-bold text-emerald-900 border-t border-stone-150 pt-2">
              <span>Total Estimated</span>
              <span id="cart-drawer-total">Rs. 0</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <a href="cart.html" class="block w-full text-center py-3 border border-emerald-800 text-emerald-800 font-semibold rounded hover:bg-emerald-50 transition">View Bag</a>
            <a href="checkout.html" class="block w-full text-center py-3 bg-emerald-800 text-white font-semibold rounded hover:bg-emerald-950 transition shadow">Checkout</a>
          </div>
        </div>
      </div>
    `;
  }

  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = `
      <footer class="bg-emerald-950 text-stone-200 pt-16 pb-8 border-t border-emerald-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-full bg-gold flex items-center justify-center font-bold text-emerald-950">D</div>
              <span class="font-serif text-xl font-bold tracking-wider text-white">DIMARK SKINCARE</span>
            </div>
            <p class="text-stone-400 text-sm max-w-sm mb-6">
              Pioneering advanced dermatological skincare with vegan, clinical formulations designed to restore, enhance, and protect your skin's natural luminescence.
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-8 h-8 rounded-full bg-emerald-900 hover:bg-gold hover:text-emerald-950 flex items-center justify-center transition text-stone-300">
                <span class="sr-only">Facebook</span>
                FB
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-emerald-900 hover:bg-gold hover:text-emerald-950 flex items-center justify-center transition text-stone-300">
                <span class="sr-only">Instagram</span>
                IG
              </a>
              <a href="#" class="w-8 h-8 rounded-full bg-emerald-900 hover:bg-gold hover:text-emerald-950 flex items-center justify-center transition text-stone-300">
                <span class="sr-only">Pinterest</span>
                PIN
              </a>
            </div>
          </div>
          <div>
            <h3 class="font-serif text-white font-semibold text-lg mb-4">Shop Solutions</h3>
            <ul class="space-y-2 text-sm text-stone-400">
              <li><a href="shop.html?category=Brightening" class="hover:text-gold transition">Anti-Spot & Brightening</a></li>
              <li><a href="shop.html?category=Hydration" class="hover:text-gold transition">Deep Hydration</a></li>
              <li><a href="shop.html?category=Anti-Aging" class="hover:text-gold transition">Advanced Repair & Retinol</a></li>
              <li><a href="shop.html?category=Sun%20Protection" class="hover:text-gold transition">Sun Defense Protection</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-serif text-white font-semibold text-lg mb-4">Customer Care</h3>
            <ul class="space-y-2 text-sm text-stone-400">
              <li><a href="about.html" class="hover:text-gold transition">Our Story</a></li>
              <li><a href="contact.html" class="hover:text-gold transition">Free Skin Consultation</a></li>
              <li><a href="contact.html#faqs" class="hover:text-gold transition">FAQ Support</a></li>
              <li><a href="contact.html" class="hover:text-gold transition">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© 2026 Dimark Skincare Products. All rights reserved. Developed for luxury skincare selling.</p>
          <div class="flex gap-4 mt-4 sm:mt-0">
            <a href="#" class="hover:text-stone-300">Privacy Policy</a>
            <a href="#" class="hover:text-stone-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    `;
  }
}

// 6. ROUTING PAGE-SPECIFIC SCRIPTS
function routePageSpecific() {
  const path = window.location.pathname.split("/").pop() || "index.html";

  if (path === "index.html" || path === "") {
    initHomePage();
  } else if (path === "shop.html") {
    initShopPage();
  } else if (path === "product-detail.html") {
    initProductDetailPage();
  } else if (path === "cart.html") {
    initCartPage();
  } else if (path === "checkout.html") {
    initCheckoutPage();
  } else if (path === "contact.html") {
    initContactPage();
  }
}

// ==========================================
// PAGE INITIALIZERS & LOGIC
// ==========================================

// --- HOME PAGE LOGIC ---
function initHomePage() {
  // 1. Featured Products Grid (Carousel / Flex)
  const productGrid = document.getElementById("featured-products-grid");
  if (productGrid) {
    productGrid.innerHTML = PRODUCTS.slice(0, 3).map(product => `
      <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-150 card-hover flex flex-col h-full group">
        <div class="relative overflow-hidden aspect-square bg-stone-100">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-3 left-3 bg-emerald-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">${product.badge}</span>
        </div>
        <div class="p-6 flex flex-col flex-1">
          <div class="flex items-center gap-1 mb-2">
            ${Array(5).fill(0).map((_, i) => `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-stone-300'}" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            `).join("")}
            <span class="text-xs text-stone-500 ml-1">(${product.reviewsCount})</span>
          </div>
          <h3 class="font-serif text-lg font-bold text-emerald-900 mb-2 leading-snug">
            <a href="product-detail.html?id=${product.id}" class="hover:text-gold transition-colors">${product.name}</a>
          </h3>
          <p class="text-stone-600 text-sm mb-4 line-clamp-2">${product.tagline}</p>
          <div class="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
            <span class="text-lg font-bold text-stone-800">Rs. ${product.price.toLocaleString()}</span>
            <button onclick="addToCart('${product.id}')" class="px-4 py-2 bg-emerald-800 text-white rounded text-sm font-semibold hover:bg-emerald-950 transition btn-sage-hover">Add to Bag</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  // 2. Before/After Slider Interaction
  initBeforeAfterSlider();
}

function initBeforeAfterSlider() {
  const handle = document.getElementById("slider-handle");
  const resizeContainer = document.getElementById("slider-resize");
  const container = document.getElementById("slider-container");

  if (!handle || !resizeContainer || !container) return;

  let isDragging = false;

  function move(x) {
    const rect = container.getBoundingClientRect();
    const position = ((x - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, position));

    handle.style.left = `${clamped}%`;
    resizeContainer.style.width = `${clamped}%`;
  }

  // Mouse Actions
  container.addEventListener("mousedown", () => { isDragging = true; });
  window.addEventListener("mouseup", () => { isDragging = false; });
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    move(e.clientX);
  });

  // Touch Actions (Mobile support)
  container.addEventListener("touchstart", () => { isDragging = true; });
  window.addEventListener("touchend", () => { isDragging = false; });
  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    move(e.touches[0].clientX);
  });
}

// --- SHOP PAGE LOGIC ---
let activeCategory = "All";
let shopSearchQuery = "";
let shopSortOption = "featured";

function initShopPage() {
  // Capture URL category filter if exists (e.g. ?category=Brightening)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");
  if (categoryParam) {
    activeCategory = categoryParam;
    // Set active class on navigation matching elements
  }

  renderFilters();
  renderCatalog();

  // Bind Search bar
  const searchInput = document.getElementById("shop-search");
  if (searchInput) {
    searchInput.value = shopSearchQuery;
    searchInput.addEventListener("input", (e) => {
      shopSearchQuery = e.target.value.toLowerCase();
      renderCatalog();
    });
  }

  // Bind Sort selector
  const sortSelect = document.getElementById("shop-sort");
  if (sortSelect) {
    sortSelect.value = shopSortOption;
    sortSelect.addEventListener("change", (e) => {
      shopSortOption = e.target.value;
      renderCatalog();
    });
  }
}

function renderFilters() {
  const filterContainer = document.getElementById("shop-filters");
  if (!filterContainer) return;

  const categories = ["All", "Brightening", "Anti-Aging", "Hydration", "Sun Protection"];

  filterContainer.innerHTML = categories.map(cat => `
    <button 
      onclick="filterShopCategory('${cat}')" 
      class="px-4 py-2 rounded-full border text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-emerald-800 border-emerald-800 text-white shadow' : 'border-stone-300 text-stone-700 bg-white hover:border-emerald-800'}"
    >
      ${cat}
    </button>
  `).join("");
}

window.filterShopCategory = function(cat) {
  activeCategory = cat;
  renderFilters();
  renderCatalog();
};

function renderCatalog() {
  const catalogGrid = document.getElementById("shop-catalog-grid");
  if (!catalogGrid) return;

  // Filter items
  let filtered = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(shopSearchQuery) || p.tagline.toLowerCase().includes(shopSearchQuery);
    return matchesCategory && matchesSearch;
  });

  // Sort items
  if (shopSortOption === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (shopSortOption === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (shopSortOption === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    catalogGrid.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="font-serif text-xl font-bold text-emerald-950">No formulas found</h3>
        <p class="text-sm mt-1">Try resetting your filters or search terms.</p>
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = filtered.map(product => `
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200 card-hover flex flex-col h-full group">
      <div class="relative overflow-hidden aspect-square bg-stone-100">
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </a>
        <span class="absolute top-3 left-3 bg-emerald-900 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">${product.badge}</span>
      </div>
      <div class="p-6 flex flex-col flex-1">
        <div class="flex items-center gap-1 mb-2">
          ${Array(5).fill(0).map((_, i) => `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-stone-300'}" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          `).join("")}
          <span class="text-xs text-stone-500 ml-1">(${product.reviewsCount})</span>
        </div>
        <h3 class="font-serif text-lg font-bold text-emerald-900 mb-2 leading-snug">
          <a href="product-detail.html?id=${product.id}" class="hover:text-gold transition-colors">${product.name}</a>
        </h3>
        <p class="text-stone-600 text-sm mb-4 line-clamp-2">${product.tagline}</p>
        <div class="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
          <span class="text-lg font-bold text-stone-800">Rs. ${product.price.toLocaleString()}</span>
          <button onclick="addToCart('${product.id}')" class="px-4 py-2 bg-emerald-800 text-white rounded text-sm font-semibold hover:bg-emerald-950 transition btn-sage-hover">Add to Bag</button>
        </div>
      </div>
    </div>
  `).join("");
}

// --- PRODUCT DETAILS PAGE LOGIC ---
let selectedSize = "50ml";
let detailQty = 1;
let selectedTab = "description";
let productReviews = [];

function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id") || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    window.location.href = "shop.html";
    return;
  }

  // Load reviews from localStorage unique to this product, or load default mock rating
  const reviewKey = `dimark_reviews_${product.id}`;
  productReviews = JSON.parse(localStorage.getItem(reviewKey)) || [
    { name: "Nisha Perera", rating: 5, date: "May 24, 2026", text: "Truly works for dark spots. I saw visible improvements on my cheeks in just 2 weeks. Highly recommend this brand!" },
    { name: "Damith Silva", rating: 4, date: "April 18, 2026", text: "Good non-greasy application. Helps soothe the acne scars. Satisfied with the purchase." }
  ];

  renderProductDetails(product);

  // Bind size selection
  window.selectDetailSize = function(size) {
    selectedSize = size;
    // Update active UI styling
    document.querySelectorAll(".size-btn").forEach(btn => {
      if (btn.innerText === size) {
        btn.className = "size-btn px-4 py-2 border-2 border-emerald-800 text-emerald-800 font-semibold bg-emerald-50 rounded";
      } else {
        btn.className = "size-btn px-4 py-2 border border-stone-300 text-stone-700 bg-white hover:border-stone-400 rounded";
      }
    });

    // Adjust price if 100ml is selected (e.g., +50% price or simple multiplier)
    const priceDisplay = document.getElementById("detail-price");
    if (priceDisplay) {
      const multiplier = size === "100ml" ? 1.7 : 1.0;
      const adjustedPrice = Math.round(product.price * multiplier);
      priceDisplay.innerText = `Rs. ${adjustedPrice.toLocaleString()}`;
    }
  };

  // Bind Qty Buttons
  window.changeDetailQty = function(change) {
    detailQty = Math.max(1, detailQty + change);
    const qtyText = document.getElementById("detail-qty-val");
    if (qtyText) qtyText.innerText = detailQty;
  };

  // Bind Add To Cart Button
  const addBtn = document.getElementById("detail-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      // Calculate final product price based on size
      let finalPrice = product.price;
      if (selectedSize === "100ml") {
        finalPrice = Math.round(product.price * 1.7);
      }
      
      // We will intercept adding to customize price override
      const itemToCart = PRODUCTS.find(p => p.id === product.id);
      
      // Standard dynamic injection logic
      addToCart(product.id, selectedSize, detailQty);
    });
  }

  // Bind Information Tabs
  window.selectDetailTab = function(tabName) {
    selectedTab = tabName;
    document.querySelectorAll(".tab-header-btn").forEach(btn => {
      if (btn.dataset.tab === tabName) {
        btn.className = "tab-header-btn font-serif text-lg font-bold border-b-2 border-emerald-800 pb-2 text-emerald-900";
      } else {
        btn.className = "tab-header-btn font-serif text-lg text-stone-500 hover:text-stone-800 pb-2";
      }
    });

    const body = document.getElementById("detail-tab-body");
    if (!body) return;

    if (tabName === "description") {
      body.innerHTML = `<p class="text-stone-600 leading-relaxed">${product.description}</p>`;
    } else if (tabName === "ingredients") {
      body.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${product.ingredients.map(ing => `
            <div class="p-4 bg-emerald-50 bg-opacity-60 rounded border border-emerald-100 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-800 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 class="font-semibold text-emerald-950 text-sm">${ing.name}</h4>
                <p class="text-xs text-stone-600 mt-1">${ing.benefit}</p>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    } else if (tabName === "usage") {
      body.innerHTML = `
        <ol class="space-y-4">
          ${product.howToUse.map((step, idx) => `
            <li class="flex gap-4 items-start">
              <span class="w-6 h-6 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">${idx + 1}</span>
              <p class="text-stone-600 text-sm leading-relaxed">${step}</p>
            </li>
          `).join("")}
        </ol>
      `;
    }
  };

  // Bind Submit Review
  const reviewForm = document.getElementById("review-submit-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rName = document.getElementById("rev-name").value.trim();
      const rRating = parseInt(document.getElementById("rev-rating").value);
      const rText = document.getElementById("rev-text").value.trim();

      if (!rName || !rText) return;

      const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

      productReviews.unshift({
        name: rName,
        rating: rRating,
        date: dateStr,
        text: rText
      });

      localStorage.setItem(reviewKey, JSON.stringify(productReviews));
      showToast("Review submitted successfully!");
      
      // Clear inputs
      reviewForm.reset();
      renderReviewList();
    });
  }

  // Initial tab loading
  selectDetailTab("description");
  renderReviewList();
}

function renderProductDetails(product) {
  document.getElementById("detail-image").src = product.image;
  document.getElementById("detail-image").alt = product.name;
  document.getElementById("detail-badge").innerText = product.badge;
  document.getElementById("detail-title").innerText = product.name;
  document.getElementById("detail-tagline").innerText = product.tagline;
  document.getElementById("detail-price").innerText = `Rs. ${product.price.toLocaleString()}`;
  document.getElementById("detail-review-count").innerText = `${productReviews.length} Reviews`;

  // Render Star Bar
  const starsContainer = document.getElementById("detail-stars");
  starsContainer.innerHTML = Array(5).fill(0).map((_, i) => `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-current' : 'text-stone-300'}" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  `).join("");
}

function renderReviewList() {
  const container = document.getElementById("reviews-list-container");
  if (!container) return;

  if (productReviews.length === 0) {
    container.innerHTML = `<p class="text-stone-500 py-6">Be the first to review this formula.</p>`;
    return;
  }

  container.innerHTML = productReviews.map(rev => `
    <div class="py-6 border-b border-stone-200">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h4 class="font-semibold text-emerald-950 text-sm">${rev.name}</h4>
          <div class="flex items-center gap-1 mt-1">
            ${Array(5).fill(0).map((_, i) => `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ${i < rev.rating ? 'text-amber-400 fill-current' : 'text-stone-300'}" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            `).join("")}
          </div>
        </div>
        <span class="text-xs text-stone-500">${rev.date}</span>
      </div>
      <p class="text-sm text-stone-600 leading-relaxed">${rev.text}</p>
    </div>
  `).join("");
}

// --- CART PAGE LOGIC ---
function initCartPage() {
  renderCartPage();

  // Bind promo form
  const promoForm = document.getElementById("cart-promo-form");
  if (promoForm) {
    promoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = document.getElementById("cart-promo-input").value;
      const res = applyPromo(code);
      showToast(res.message);
      if (res.success) {
        promoForm.reset();
      }
    });
  }
}

function renderCartPage() {
  const container = document.getElementById("cart-page-items");
  const totals = getCartTotals();

  if (!container) return;

  if (cart.length === 0) {
    document.getElementById("cart-layout-container").innerHTML = `
      <div class="max-w-xl mx-auto text-center py-20 bg-white border border-stone-200 rounded-xl shadow-sm px-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto mb-6 text-emerald-800 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="font-serif text-3xl font-bold text-emerald-950 mb-3">Your Shopping Bag is Empty</h2>
        <p class="text-stone-600 mb-8">It looks like you haven't added any skincare formulas to your bag yet. Begin exploring our clinician-approved formulas.</p>
        <a href="shop.html" class="px-8 py-3 bg-emerald-800 text-white font-semibold rounded hover:bg-emerald-950 transition shadow">Continue Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = cart.map(item => `
    <tr class="border-b border-stone-200">
      <td class="py-6 flex items-center gap-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded bg-stone-50 border border-stone-200" />
        <div>
          <h3 class="font-serif text-sm font-semibold text-emerald-950">${item.name}</h3>
          <p class="text-xs text-stone-500 mt-0.5">Size: ${item.size}</p>
        </div>
      </td>
      <td class="py-6 text-sm text-stone-600">Rs. ${item.price.toLocaleString()}</td>
      <td class="py-6">
        <div class="flex items-center border border-stone-300 rounded max-w-[100px]">
          <button onclick="changeQty('${item.id}', '${item.size}', -1)" class="px-2 py-1 text-sm bg-stone-100 hover:bg-stone-200">-</button>
          <span class="flex-1 text-center text-xs font-semibold">${item.quantity}</span>
          <button onclick="changeQty('${item.id}', '${item.size}', 1)" class="px-2 py-1 text-sm bg-stone-100 hover:bg-stone-200">+</button>
        </div>
      </td>
      <td class="py-6 text-sm font-bold text-emerald-950 text-right">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
      <td class="py-6 text-center">
        <button onclick="removeItem('${item.id}', '${item.size}')" class="text-stone-400 hover:text-red-500 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  `).join("");

  // Update Summary DOM
  document.getElementById("cart-subtotal").innerText = `Rs. ${totals.subtotal.toLocaleString()}`;
  
  const discountRow = document.getElementById("cart-discount-row");
  const discountVal = document.getElementById("cart-discount");
  if (totals.discount > 0) {
    discountRow.classList.remove("hidden");
    discountVal.innerHTML = `- Rs. ${totals.discount.toLocaleString()} <button onclick="removeCartPromo()" class="text-xs text-red-500 font-normal underline ml-2 hover:text-red-700">Remove</button>`;
  } else {
    discountRow.classList.add("hidden");
  }

  document.getElementById("cart-total").innerText = `Rs. ${totals.total.toLocaleString()}`;
}

window.removeCartPromo = function() {
  removePromo();
  showToast("Coupon removed");
};

// --- CHECKOUT PAGE LOGIC ---
function initCheckoutPage() {
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  renderCheckoutSummary();

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Validate inputs
      const email = document.getElementById("check-email").value.trim();
      const first = document.getElementById("check-first").value.trim();
      const last = document.getElementById("check-last").value.trim();
      const address = document.getElementById("check-address").value.trim();
      const city = document.getElementById("check-city").value.trim();
      const phone = document.getElementById("check-phone").value.trim();

      if (!email || !first || !last || !address || !city || !phone) {
        showToast("Please fill all shipping fields");
        return;
      }

      // Order generation
      const orderNumber = "DM-" + Math.floor(100000 + Math.random() * 900000);
      const totals = getCartTotals();
      
      const orderSummaryList = document.getElementById("success-summary-list");
      if (orderSummaryList) {
        orderSummaryList.innerHTML = cart.map(item => `
          <div class="flex justify-between text-xs py-1 text-stone-600 border-b border-dashed border-stone-200">
            <span>${item.name} (x${item.quantity})</span>
            <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        `).join("");
      }

      document.getElementById("success-order-num").innerText = orderNumber;
      document.getElementById("success-total").innerText = `Rs. ${totals.total.toLocaleString()}`;
      document.getElementById("success-name").innerText = `${first} ${last}`;
      document.getElementById("success-address").innerText = `${address}, ${city}`;
      document.getElementById("success-phone").innerText = phone;

      // Reveal overlay
      const successModal = document.getElementById("checkout-success-modal");
      if (successModal) {
        successModal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
      }

      // Clear local states
      cart = [];
      currentPromo = null;
      localStorage.removeItem("dimark_cart");
      localStorage.removeItem("dimark_promo");
      updateCartUI();
    });
  }

  window.printReceipt = function() {
    window.print();
  };
  
  window.closeSuccessModal = function() {
    document.body.classList.remove("overflow-hidden");
    window.location.href = "index.html";
  };
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-summary-items");
  const totals = getCartTotals();
  if (!container) return;

  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 py-3 border-b border-stone-200">
      <div class="relative w-12 h-12 flex-shrink-0 bg-stone-50 border border-stone-200 rounded">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded" />
        <span class="absolute -top-2 -right-2 bg-emerald-900 text-white font-semibold text-xs h-5 w-5 rounded-full flex items-center justify-center">${item.quantity}</span>
      </div>
      <div class="flex-1">
        <h4 class="font-serif text-xs font-semibold text-emerald-950 line-clamp-1">${item.name}</h4>
        <p class="text-[10px] text-stone-500">Size: ${item.size}</p>
      </div>
      <span class="text-sm font-semibold text-stone-800">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join("");

  document.getElementById("check-subtotal").innerText = `Rs. ${totals.subtotal.toLocaleString()}`;
  if (totals.discount > 0) {
    document.getElementById("check-discount-row").classList.remove("hidden");
    document.getElementById("check-discount").innerText = `- Rs. ${totals.discount.toLocaleString()}`;
  } else {
    document.getElementById("check-discount-row").classList.add("hidden");
  }
  document.getElementById("check-total").innerText = `Rs. ${totals.total.toLocaleString()}`;
}

// --- CONTACT & SKIN CONSULTATION QUIZ LOGIC ---
const QUIZ_QUESTIONS = [
  {
    question: "What is your main skin concern?",
    answers: [
      { text: "Dark spots, uneven skin tone, or sun marks", score: "spot-cream" },
      { text: "Fine lines, loss of firmness, or texture repair", score: "night-repair" },
      { text: "Dryness, dullness, or constant dehydration", score: "hydra-boost" },
      { text: "Preventing daily UV damage and sun aging", score: "sunscreen" }
    ]
  },
  {
    question: "Describe your skin type:",
    answers: [
      { text: "Normal or combined skin (dry areas & slightly oily T-zone)" },
      { text: "Dry or very flakey skin" },
      { text: "Oily, acne-prone, or large visible pores" },
      { text: "Sensitive, reactive, or easily reddened skin" }
    ]
  },
  {
    question: "How long are you exposed to the sun daily?",
    answers: [
      { text: "Mostly indoors (less than 1 hour outside)" },
      { text: "Moderate (1 to 3 hours outside daily)" },
      { text: "High sun exposure (frequent outdoor sports/activities)", score: "sunscreen" }
    ]
  }
];

let quizCurrentIndex = 0;
let quizScores = {}; // Key: productId, Value: occurrences/weight

function initContactPage() {
  renderQuizStep();

  // Contact form submission mock
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thank you! Your message has been sent successfully.");
      contactForm.reset();
    });
  }
}

function renderQuizStep() {
  const container = document.getElementById("quiz-step-container");
  if (!container) return;

  const currentQ = QUIZ_QUESTIONS[quizCurrentIndex];

  container.innerHTML = `
    <div class="mb-6">
      <div class="flex justify-between items-center text-xs font-semibold text-emerald-800 uppercase tracking-widest mb-2">
        <span>Skin Assessment</span>
        <span>Question ${quizCurrentIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
      </div>
      <div class="w-full h-1 bg-stone-200 rounded">
        <div class="h-full bg-emerald-800 rounded transition-all duration-300" style="width: ${((quizCurrentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%"></div>
      </div>
    </div>
    
    <h3 class="font-serif text-lg md:text-xl font-bold text-emerald-950 mb-6">${currentQ.question}</h3>
    
    <div class="space-y-3 mb-6">
      ${currentQ.answers.map((ans, idx) => `
        <button 
          onclick="answerQuiz(${idx})" 
          class="w-full text-left p-4 rounded-lg border border-stone-300 bg-white hover:border-emerald-800 hover:bg-emerald-50 transition duration-150 flex items-center justify-between text-sm"
        >
          <span>${ans.text}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 group-hover:text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      `).join("")}
    </div>
  `;
}

window.answerQuiz = function(answerIndex) {
  const currentQ = QUIZ_QUESTIONS[quizCurrentIndex];
  const answer = currentQ.answers[answerIndex];

  // If score trigger is attached to answer, add weight
  if (answer.score) {
    quizScores[answer.score] = (quizScores[answer.score] || 0) + 2;
  }

  // Auto general matchings depending on other parameters
  if (quizCurrentIndex === 1) {
    if (answerIndex === 1) { // dry
      quizScores["hydra-boost"] = (quizScores["hydra-boost"] || 0) + 1;
    } else if (answerIndex === 2) { // oily
      quizScores["hydra-boost"] = (quizScores["hydra-boost"] || 0) + 1.5;
    }
  }

  // Advance or calculate results
  if (quizCurrentIndex < QUIZ_QUESTIONS.length - 1) {
    quizCurrentIndex++;
    renderQuizStep();
  } else {
    calculateQuizResult();
  }
};

function calculateQuizResult() {
  const container = document.getElementById("quiz-step-container");
  if (!container) return;

  // Determine top matched product
  let bestId = "spot-cream"; // Fallback default
  let highestScore = -1;

  for (const [prodId, score] of Object.entries(quizScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestId = prodId;
    }
  }

  const recommendation = PRODUCTS.find(p => p.id === bestId);

  container.innerHTML = `
    <div class="text-center py-6">
      <div class="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-800 mb-4 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="font-serif text-2xl font-bold text-emerald-950 mb-2">We Have Found Your Match!</h3>
      <p class="text-xs text-stone-500 uppercase tracking-widest mb-6">Based on your skin profile assessment</p>

      <div class="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-sm p-5 flex flex-col md:flex-row items-center gap-4 text-left mb-6">
        <img src="${recommendation.image}" alt="${recommendation.name}" class="w-24 h-24 object-cover rounded bg-stone-100 border border-stone-200" />
        <div>
          <span class="bg-gold text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">${recommendation.badge}</span>
          <h4 class="font-serif text-base font-bold text-emerald-900 mt-1 leading-snug">${recommendation.name}</h4>
          <p class="text-xs text-stone-600 mt-1 line-clamp-2">${recommendation.tagline}</p>
          <a href="product-detail.html?id=${recommendation.id}" class="inline-block mt-3 text-xs text-emerald-800 font-bold hover:text-emerald-950 underline flex items-center gap-1">
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div class="flex gap-2 justify-center max-w-sm mx-auto">
        <button onclick="resetQuiz()" class="w-1/2 py-3 border border-emerald-800 text-emerald-800 text-sm font-semibold rounded hover:bg-emerald-50 transition">Retake Quiz</button>
        <button onclick="addToCart('${recommendation.id}')" class="w-1/2 py-3 bg-emerald-800 text-white text-sm font-semibold rounded hover:bg-emerald-950 transition shadow">Add To Bag</button>
      </div>
    </div>
  `;
}

window.resetQuiz = function() {
  quizCurrentIndex = 0;
  quizScores = {};
  renderQuizStep();
};
