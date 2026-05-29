const App = {
  state: {
    products: [],
    cart: [],
    currentView: 'home',
    currentCategory: 'all',
    searchQuery: '',
    darkMode: false,
    detailProductId: null,
  },

  defaultProducts: [
    { id: 'p1', name: 'Wireless Bluetooth Headphones', price: 79, originalPrice: 99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'electronics', description: 'Premium wireless headphones with noise cancellation, 30-hour battery life, and comfortable over-ear design.', featured: true, discount: 20 },
    { id: 'p2', name: 'Smartphone Pro Max', price: 899, originalPrice: 1099, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', category: 'electronics', description: '6.7-inch display, 128GB storage, 48MP camera, 5G connectivity.', featured: true, discount: 18 },
    { id: 'p3', name: 'Running Shoes Ultra', price: 89, originalPrice: 129, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'fashion', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.', featured: true, discount: 31 },
    { id: 'p4', name: 'Classic Denim Jacket', price: 59, originalPrice: 79, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400', category: 'fashion', description: 'Timeless denim jacket with a modern fit. Perfect for layering.', featured: false, discount: 25 },
    { id: 'p5', name: 'Smart Watch Series 5', price: 199, originalPrice: 249, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'electronics', description: 'Fitness tracking, heart rate monitor, GPS, and 7-day battery life.', featured: true, discount: 20 },
    { id: 'p6', name: 'Leather Messenger Bag', price: 69, originalPrice: 89, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'fashion', description: 'Genuine leather messenger bag with padded laptop compartment.', featured: false, discount: 22 },
    { id: 'p7', name: '4K Ultra HD Monitor', price: 399, originalPrice: 499, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', category: 'electronics', description: '27-inch 4K UHD monitor with HDR10, IPS panel, and USB-C connectivity.', featured: false, discount: 20 },
    { id: 'p8', name: 'Aviator Sunglasses', price: 49, originalPrice: 69, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'fashion', description: 'Classic aviator sunglasses with UV400 protection and gold frame.', featured: true, discount: 29 },
    { id: 'p9', name: 'Wireless Gaming Mouse', price: 49, originalPrice: 59, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'electronics', description: 'Ergonomic gaming mouse with 16000 DPI, RGB lighting, and 70-hour battery.', featured: false, discount: 17 },
    { id: 'p10', name: 'Casual Canvas Backpack', price: 39, originalPrice: 49, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'fashion', description: 'Spacious canvas backpack with multiple compartments and padded straps.', featured: false, discount: 20 },
    { id: 'p11', name: 'Portable Bluetooth Speaker', price: 29, originalPrice: 39, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', category: 'electronics', description: 'Waterproof portable speaker with 12-hour battery and deep bass.', featured: false, discount: 26 },
    { id: 'p12', name: 'Premium Cotton T-Shirt', price: 24, originalPrice: 34, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'fashion', description: 'Soft 100% organic cotton t-shirt. Available in multiple colors.', featured: false, discount: 29 },
  ],

  init() {
    this.loadProducts();
    this.loadCart();
    this.loadDarkMode();
    this.render();
    this.bindEvents();
  },

  /* ===== DATA PERSISTENCE ===== */
  loadProducts() {
    const stored = localStorage.getItem('shopProducts');
    if (stored) {
      try {
        this.state.products = JSON.parse(stored);
      } catch {
        this.state.products = [...this.defaultProducts];
        this.saveProducts();
      }
    } else {
      this.state.products = [...this.defaultProducts];
      this.saveProducts();
    }
  },

  saveProducts() {
    localStorage.setItem('shopProducts', JSON.stringify(this.state.products));
  },

  loadCart() {
    const stored = localStorage.getItem('shopCart');
    if (stored) {
      try {
        this.state.cart = JSON.parse(stored);
      } catch {
        this.state.cart = [];
        this.saveCart();
      }
    } else {
      this.state.cart = [];
      this.saveCart();
    }
  },

  saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(this.state.cart));
    this.updateCartCount();
  },

  loadDarkMode() {
    const stored = localStorage.getItem('shopDarkMode');
    this.state.darkMode = stored === 'true';
    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  },

  saveDarkMode() {
    localStorage.setItem('shopDarkMode', this.state.darkMode);
  },

  /* ===== RENDER ===== */
  render() {
    this.renderNavbarCartCount();
    this.renderView();
  },

  renderView() {
    const container = document.getElementById('view-container');
    if (!container) return;

    switch (this.state.currentView) {
      case 'home':
        this.renderHome(container);
        break;
      case 'detail':
        this.renderDetail(container);
        break;
      case 'cart':
        this.renderCart(container);
        break;
      case 'checkout':
        this.renderCheckout(container);
        break;
      case 'success':
        this.renderSuccess(container);
        break;
      default:
        this.renderHome(container);
    }
  },

  getFilteredProducts() {
    let products = [...this.state.products];
    if (this.state.currentCategory !== 'all') {
      products = products.filter(p => p.category === this.state.currentCategory);
    }
    if (this.state.searchQuery.trim()) {
      const q = this.state.searchQuery.trim().toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    // Sort: featured first
    products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return products;
  },

  renderHome(container) {
    const featured = this.state.products.filter(p => p.featured);
    const filtered = this.getFilteredProducts();

    container.innerHTML = `
      <div class="container">
        <section class="hero">
          <h1>🔥 Mega Sale!</h1>
          <p>Up to 40% off on top brands. Limited time offer.</p>
          <a class="shop-now" onclick="App.navigate('cart')">Shop Now</a>
        </section>

        <div class="category-pills" id="category-pills">
          <button class="category-pill ${this.state.currentCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>
          <button class="category-pill ${this.state.currentCategory === 'electronics' ? 'active' : ''}" data-cat="electronics">📱 Electronics</button>
          <button class="category-pill ${this.state.currentCategory === 'fashion' ? 'active' : ''}" data-cat="fashion">👕 Fashion</button>
        </div>

        ${featured.length > 0 ? `
          <div class="section-title">
            <h2>⭐ Featured Products</h2>
          </div>
          <div class="product-grid" id="featured-grid">
            ${this.renderProductCards(featured)}
          </div>
        ` : ''}

        <div class="section-title" style="margin-top:24px">
          <h2>${this.state.searchQuery ? `Results for "${this.state.searchQuery}"` : 'All Products'}</h2>
          <span class="view-all">${filtered.length} items</span>
        </div>
        <div class="product-grid" id="product-grid">
          ${filtered.length > 0 ? this.renderProductCards(filtered) : `
            <div class="no-results" style="grid-column:1/-1">
              <div class="no-icon">🔍</div>
              <p>No products found</p>
            </div>
          `}
        </div>
      </div>
    `;

    this.bindCategoryPills();
    this.bindAddToCartButtons();
  },

  renderProductCards(products) {
    return products.map(p => {
      const inCart = this.state.cart.find(c => c.productId === p.id);
      const discount = p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
      return `
        <div class="product-card" onclick="App.goToDetail('${p.id}')">
          <div class="img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%23f0f0f0%22 width=%22400%22 height=%22400%22/><text fill=%22%23999%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22>No Image</text></svg>'">
            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
            ${p.featured ? `<span class="featured-badge">⭐</span>` : ''}
          </div>
          <div class="info">
            <span class="category-tag">${p.category}</span>
            <div class="name">${p.name}</div>
            <div class="price-row">
              <span class="current-price">$${p.price.toFixed(2)}</span>
              ${p.originalPrice > p.price ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="event.stopPropagation(); App.addToCart('${p.id}')">
              ${inCart ? '✓ Added' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderDetail(container) {
    const product = this.state.products.find(p => p.id === this.state.detailProductId);
    if (!product) {
      this.navigate('home');
      return;
    }

    const discount = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const inCart = this.state.cart.find(c => c.productId === product.id);
    const qtyInCart = inCart ? inCart.quantity : 1;

    container.innerHTML = `
      <div class="container">
        <button class="back-btn" onclick="App.navigate('home')">← Back</button>
        <div class="product-detail">
          <div class="detail-img">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%23f0f0f0%22 width=%22400%22 height=%22400%22/><text fill=%22%23999%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22>No Image</text></svg>'">
          </div>
          <div class="detail-info">
            <div class="detail-category">${product.category}</div>
            <h1 class="detail-name">${product.name}</h1>
            <div class="detail-price-row">
              <span class="detail-current-price">$${product.price.toFixed(2)}</span>
              ${product.originalPrice > product.price ? `<span class="detail-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              ${discount > 0 ? `<span class="detail-discount">Save ${discount}%</span>` : ''}
            </div>
            <p class="detail-description">${product.description}</p>

            <div class="qty-selector">
              <button onclick="App.changeDetailQty(-1)">−</button>
              <span id="detail-qty">${qtyInCart}</span>
              <button onclick="App.changeDetailQty(1)">+</button>
            </div>

            <div class="detail-actions">
              <button class="btn-add-cart" onclick="App.addToCart('${product.id}', parseInt(document.getElementById('detail-qty').textContent))">🛒 Add to Cart</button>
              <button class="btn-buy-now" onclick="App.buyNow('${product.id}')">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Store the qty for detail view
    this._detailQty = qtyInCart;
  },

  renderCart(container) {
    if (this.state.cart.length === 0) {
      container.innerHTML = `
        <div class="container">
          <h1>🛒 Your Cart</h1>
          <div class="cart-empty">
            <div class="empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <a class="continue-shopping" onclick="App.navigate('home')">Continue Shopping</a>
          </div>
        </div>
      `;
      return;
    }

    const productMap = {};
    this.state.products.forEach(p => { productMap[p.id] = p; });

    let subtotal = 0;
    const itemsHtml = this.state.cart.map(item => {
      const product = productMap[item.productId];
      if (!product) return '';
      const total = product.price * item.quantity;
      subtotal += total;
      return `
        <div class="cart-item" data-id="${item.productId}">
          <div class="item-img">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f0f0f0%22 width=%22200%22 height=%22200%22/><text fill=%22%23999%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22>No Image</text></svg>'">
          </div>
          <div class="item-info">
            <div class="item-name">${product.name}</div>
            <div class="item-price">$${product.price.toFixed(2)}</div>
            <div class="item-controls">
              <button class="qty-btn" onclick="App.updateCartQty('${item.productId}', -1)">−</button>
              <span class="item-qty">${item.quantity}</span>
              <button class="qty-btn" onclick="App.updateCartQty('${item.productId}', 1)">+</button>
              <button class="item-remove" onclick="App.removeFromCart('${item.productId}')">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="container">
        <button class="back-btn" onclick="App.navigate('home')">← Continue Shopping</button>
        <h1>🛒 Your Cart (${this.state.cart.length})</h1>
        <div class="cart-items">${itemsHtml}</div>
        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="amount">$${subtotal.toFixed(2)}</span>
          </div>
          <button class="checkout-btn" onclick="App.navigate('checkout')">Proceed to Checkout</button>
        </div>
      </div>
    `;
  },

  renderCheckout(container) {
    if (this.state.cart.length === 0) {
      this.navigate('cart');
      return;
    }

    const productMap = {};
    this.state.products.forEach(p => { productMap[p.id] = p; });
    let total = 0;
    const itemsHtml = this.state.cart.map(item => {
      const product = productMap[item.productId];
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      total += lineTotal;
      return `
        <div class="summary-item">
          <span>${product.name} × ${item.quantity}</span>
          <span>$${lineTotal.toFixed(2)}</span>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="container">
        <button class="back-btn" onclick="App.navigate('cart')">← Back to Cart</button>
        <h1>📋 Checkout</h1>
        <div class="checkout-layout">
          <div class="checkout-form" id="checkout-form">
            <div class="form-group">
              <label for="ch-name">Full Name</label>
              <input type="text" id="ch-name" placeholder="John Doe" required>
              <div class="form-error">Please enter your name</div>
            </div>
            <div class="form-group">
              <label for="ch-phone">Phone Number</label>
              <input type="tel" id="ch-phone" placeholder="+1 234 567 890" required>
              <div class="form-error">Please enter a valid phone number</div>
            </div>
            <div class="form-group">
              <label for="ch-address">Shipping Address</label>
              <textarea id="ch-address" placeholder="Street, City, State, ZIP" required></textarea>
              <div class="form-error">Please enter your address</div>
            </div>
            <div class="checkout-summary-box">
              <h3>Order Summary</h3>
              ${itemsHtml}
              <div class="summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
            <button class="place-order-btn" onclick="App.placeOrder()">📦 Place Order</button>
          </div>
        </div>
      </div>
    `;
  },

  renderSuccess(container) {
    container.innerHTML = `
      <div class="container">
        <div class="order-success">
          <div class="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order will be shipped soon.</p>
          <a class="back-home" onclick="App.navigate('home')">Continue Shopping</a>
        </div>
      </div>
    `;
  },

  /* ===== NAVIGATION ===== */
  navigate(view) {
    this.state.currentView = view;
    this.renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  goToDetail(productId) {
    this.state.detailProductId = productId;
    this.navigate('detail');
  },

  buyNow(productId) {
    const qty = parseInt(document.getElementById('detail-qty')?.textContent || '1');
    this.addToCart(productId, qty);
    this.navigate('checkout');
  },

  /* ===== CART OPERATIONS ===== */
  addToCart(productId, qty) {
    const product = this.state.products.find(p => p.id === productId);
    if (!product) {
      this.showToast('Product not found', 'error');
      return;
    }

    const quantity = qty || 1;
    const existing = this.state.cart.find(c => c.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.cart.push({ productId, quantity });
    }

    this.saveCart();
    this.showToast(`${product.name} added to cart!`, 'success');

    // Refresh current view to update buttons
    this.renderView();
  },

  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter(c => c.productId !== productId);
    this.saveCart();
    this.showToast('Item removed from cart', 'success');
    this.renderView();
  },

  updateCartQty(productId, delta) {
    const item = this.state.cart.find(c => c.productId === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.saveCart();
    this.renderView();
  },

  changeDetailQty(delta) {
    const el = document.getElementById('detail-qty');
    if (!el) return;
    let qty = parseInt(el.textContent) + delta;
    if (qty < 1) qty = 1;
    el.textContent = qty;
    this._detailQty = qty;
  },

  updateCartCount() {
    const count = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
    });
  },

  renderNavbarCartCount() {
    this.updateCartCount();
  },

  getCartTotal() {
    const productMap = {};
    this.state.products.forEach(p => { productMap[p.id] = p; });
    return this.state.cart.reduce((sum, item) => {
      const p = productMap[item.productId];
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  },

  /* ===== CHECKOUT ===== */
  placeOrder() {
    const name = document.getElementById('ch-name');
    const phone = document.getElementById('ch-phone');
    const address = document.getElementById('ch-address');
    let valid = true;

    [name, phone, address].forEach(el => el.classList.remove('invalid'));

    if (!name.value.trim()) { name.classList.add('invalid'); valid = false; }
    if (!phone.value.trim()) { phone.classList.add('invalid'); valid = false; }
    if (!address.value.trim()) { address.classList.add('invalid'); valid = false; }

    if (!valid) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    this.state.cart = [];
    this.saveCart();
    this.showToast('Order placed successfully! 🎉', 'success');
    this.navigate('success');
  },

  /* ===== SEARCH ===== */
  handleSearch(e) {
    e.preventDefault();
    const input = document.getElementById('search-input');
    this.state.searchQuery = input.value.trim();
    this.state.currentCategory = 'all';
    this.navigate('home');
  },

  clearSearch() {
    this.state.searchQuery = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
  },

  /* ===== CATEGORY ===== */
  setCategory(cat) {
    this.state.currentCategory = cat;
    this.state.searchQuery = '';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    this.navigate('home');
    this.closeSidebar();
  },

  bindCategoryPills() {
    document.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.currentCategory = btn.dataset.cat;
        this.state.searchQuery = '';
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        this.navigate('home');
      });
    });
  },

  bindAddToCartButtons() {
    // Buttons use onclick, no additional binding needed
  },

  /* ===== DARK MODE ===== */
  toggleDarkMode() {
    this.state.darkMode = !this.state.darkMode;
    if (this.state.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.saveDarkMode();
    const icon = document.getElementById('dark-icon');
    if (icon) icon.textContent = this.state.darkMode ? '☀️' : '🌙';
  },

  /* ===== SIDEBAR ===== */
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const hamburger = document.getElementById('hamburger');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  },

  /* ===== TOAST ===== */
  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span class="toast-icon">${icon}</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /* ===== SCROLL TO TOP ===== */
  handleScroll() {
    const btn = document.getElementById('scroll-top');
    if (btn) {
      btn.classList.toggle('visible', window.scrollY > 300);
    }
  },

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ===== EVENT BINDING ===== */
  bindEvents() {
    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) searchForm.addEventListener('submit', (e) => this.handleSearch(e));

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    if (hamburger) hamburger.addEventListener('click', () => this.toggleSidebar());

    // Sidebar overlay
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) overlay.addEventListener('click', () => this.closeSidebar());

    // Scroll to top
    window.addEventListener('scroll', () => this.handleScroll());

    // Sidebar category links
    document.querySelectorAll('.category-link').forEach(link => {
      link.addEventListener('click', () => {
        this.setCategory(link.dataset.cat);
      });
    });

    // Dark mode toggle
    const darkToggle = document.getElementById('dark-toggle');
    if (darkToggle) darkToggle.addEventListener('click', () => this.toggleDarkMode());

    // Cart button
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', () => this.navigate('cart'));

    // Logo
    const logo = document.getElementById('logo-link');
    if (logo) logo.addEventListener('click', (e) => {
      e.preventDefault();
      this.clearSearch();
      this.state.currentCategory = 'all';
      this.navigate('home');
    });
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
