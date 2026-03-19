<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Checkout</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap" rel="stylesheet">
  <style>
    :root {
      --forest:    #2d5a3d;
      --sage:      #4c956c;
      --sage-lt:   #6aaf86;
      --sage-bg:   #eef5f1;
      --cream:     #faf8f4;
      --warm-gray: #f0ede8;
      --border:    #ddd9d2;
      --text:      #1a1a18;
      --muted:     #7a7568;
      --danger:    #c0392b;
      --white:     #ffffff;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--cream);
      color: var(--text);
      min-height: 100vh;
    }

    /* ── Top Bar ── */
    .topbar {
      background: var(--forest);
      color: var(--white);
      padding: 0.9rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topbar .brand {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      letter-spacing: 0.02em;
    }
    .topbar .steps {
      display: flex;
      gap: 2rem;
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.55);
    }
    .topbar .steps .active { color: var(--white); font-weight: 600; }

    /* ── Layout ── */
    .page {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 0;
      min-height: calc(100vh - 56px);
    }

    /* ── Left Panel ── */
    .form-panel {
      padding: 3rem 3.5rem 3rem 4rem;
      border-right: 1px solid var(--border);
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.35rem;
      color: var(--forest);
      margin-bottom: 1.6rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--sage-bg);
    }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.25rem; }
    .form-grid .full { grid-column: 1 / -1; }

    .field { display: flex; flex-direction: column; gap: 0.35rem; }

    label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    input, textarea {
      border: 1.5px solid var(--border);
      border-radius: 8px;
      padding: 0.65rem 0.9rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.92rem;
      background: var(--white);
      color: var(--text);
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
    }
    input:focus, textarea:focus {
      border-color: var(--sage);
      box-shadow: 0 0 0 3px rgba(76,149,108,0.12);
    }
    input.readonly-field {
      background: var(--warm-gray);
      color: var(--muted);
      cursor: not-allowed;
      border-color: var(--border);
    }
    textarea { resize: vertical; min-height: 90px; }

    .input-note {
      font-size: 0.7rem;
      color: var(--muted);
      margin-top: -0.1rem;
    }

    .err { font-size: 0.72rem; color: var(--danger); display: none; }
    .field.invalid .err { display: block; }
    .field.invalid input,
    .field.invalid textarea { border-color: var(--danger); }

    /* Payment pill */
    .pay-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--sage-bg);
      border: 1.5px solid #b2d4be;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--forest);
    }
    .pay-pill svg { flex-shrink: 0; }

    .submit-btn {
      margin-top: 2rem;
      width: 100%;
      padding: 0.9rem;
      background: var(--sage);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      box-shadow: 0 4px 14px rgba(76,149,108,0.28);
    }
    .submit-btn:hover {
      background: var(--forest);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(45,90,61,0.3);
    }
    .submit-btn:active { transform: translateY(0); }

    /* ── Right Panel (Cart) ── */
    .cart-panel {
      background: var(--warm-gray);
      padding: 3rem 2.25rem;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .cart-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.2rem;
      color: var(--forest);
      margin-bottom: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .cart-badge {
      background: var(--sage);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: 20px;
      padding: 0.2rem 0.65rem;
    }

    .cart-items { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }

    .cart-item {
      background: var(--white);
      border-radius: 10px;
      padding: 0.9rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .item-left { display: flex; align-items: center; gap: 0.75rem; }
    .item-icon {
      width: 38px; height: 38px;
      background: var(--sage-bg);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.1rem;
    }
    .item-name { font-size: 0.88rem; font-weight: 500; color: var(--text); }
    .item-qty  { font-size: 0.75rem; color: var(--muted); margin-top: 1px; }
    .item-price { font-size: 0.92rem; font-weight: 600; color: var(--forest); }

    .cart-divider { border: none; border-top: 1.5px dashed var(--border); margin: 0.5rem 0 1.25rem; }

    .cart-row-line { display: flex; justify-content: space-between; font-size: 0.86rem; color: var(--muted); margin-bottom: 0.5rem; }
    .cart-total-line { display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; color: var(--text); margin-top: 0.75rem; }

    .cart-footer {
      margin-top: auto;
      padding-top: 1.5rem;
      font-size: 0.75rem;
      color: var(--muted);
      text-align: center;
      line-height: 1.6;
    }
    .trust-icons { display: flex; justify-content: center; gap: 1rem; margin-bottom: 0.5rem; font-size: 1.1rem; }

    /* ── Success Toast ── */
    .toast {
      position: fixed; top: 1.5rem; right: 1.5rem;
      background: var(--forest);
      color: var(--white);
      padding: 1rem 1.4rem;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 30px rgba(0,0,0,0.18);
      transform: translateY(-20px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(.4,0,.2,1);
      z-index: 9999;
      pointer-events: none;
    }
    .toast.show { transform: translateY(0); opacity: 1; }

    /* ── Responsive ── */
    @media (max-width: 820px) {
      .page { grid-template-columns: 1fr; }
      .form-panel { padding: 2rem 1.5rem; border-right: none; border-bottom: 1px solid var(--border); }
      .cart-panel { padding: 2rem 1.5rem; }
      .topbar .steps { display: none; }
    }
  </style>
</head>
<body>

<!-- Top bar -->
<header class="topbar">
  <div class="brand">Storefront</div>
  <nav class="steps">
    <span>Cart</span>
    <span class="active">Details</span>
    <span>Confirmation</span>
  </nav>
</header>

<div class="page">

  <!-- ── LEFT: Billing Form ── -->
  <div class="form-panel">
    <h2 class="section-title">Billing Details</h2>

    <form id="checkout-form">
      <div class="form-grid">

        <div class="field" id="field-firstName">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" placeholder="James" required>
          <span class="err">First name is required.</span>
        </div>

        <div class="field" id="field-lastName">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" placeholder="Karki" required>
          <span class="err">Last name is required.</span>
        </div>

        <div class="field full" id="field-email">
          <label for="email">Email <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--muted);">(Optional)</span></label>
          <input type="email" id="email" placeholder="you@example.com">
        </div>

        <div class="field full" id="field-phone">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" placeholder="+1 234 567 890" required>
          <span class="err">Phone number is required.</span>
        </div>

        <div class="field full" id="field-address">
          <label for="address">Delivery Address</label>
          <textarea id="address" placeholder="1234 Main St, Apt 2B, City, State, ZIP" required></textarea>
          <span class="err">Address is required.</span>
        </div>

        <div class="field full">
          <label>Payment Method</label>
          <div class="pay-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Payment on Delivery
          </div>
          <span class="input-note">Pay with cash when your order arrives.</span>
        </div>

      </div>

      <button type="submit" class="submit-btn">Place Order →</button>
    </form>
  </div>

  <!-- ── RIGHT: Cart Summary ── -->
  <div class="cart-panel">
    <div class="cart-title">
      Your Cart
      <span class="cart-badge" id="cart-count">4</span>
    </div>

    <div class="cart-items" id="cart-items"></div>

    <hr class="cart-divider">

    <div class="cart-row-line"><span>Subtotal</span><span id="subtotal">$0</span></div>
    <div class="cart-row-line"><span>Shipping</span><span style="color:var(--sage);font-weight:600;">Free</span></div>
    <div class="cart-total-line"><span>Total</span><span id="cart-total">$0</span></div>

    <div class="cart-footer">
      <div class="trust-icons">🔒 🚚 ✅</div>
      Secure checkout · Free delivery · Easy returns
    </div>
  </div>
</div>

<!-- Success toast -->
<div class="toast" id="toast">✓ Order placed successfully!</div>

<script>
  const ICONS = { 'Headphones':'🎧', 'Mouse':'🖱️', 'Keyboard':'⌨️' };

  let cart = [
    { name:'Headphones', price:50, qty:1 },
    { name:'Mouse',      price:25, qty:2 },
    { name:'Keyboard',   price:70, qty:1 },
  ];

  function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl   = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('subtotal');
    const countEl   = document.getElementById('cart-count');

    container.innerHTML = '';
    let total = 0, count = 0;

    cart.forEach(item => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      count += item.qty;

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="item-left">
          <div class="item-icon">${ICONS[item.name] || '📦'}</div>
          <div>
            <div class="item-name">${item.name}</div>
            <div class="item-qty">Qty: ${item.qty}</div>
          </div>
        </div>
        <div class="item-price">$${lineTotal}</div>`;
      container.appendChild(el);
    });

    subtotalEl.textContent = '$' + total;
    totalEl.textContent    = '$' + total;
    countEl.textContent    = count;
  }

  // Validation
  function validate(id, required) {
    const field = document.getElementById('field-' + id);
    if (!field) return true;
    const input = document.getElementById(id);
    if (!required) return true;
    const ok = input.value.trim() !== '';
    field.classList.toggle('invalid', !ok);
    return ok;
  }

  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const v1 = validate('firstName', true);
    const v2 = validate('lastName',  true);
    const v3 = validate('phone',     true);
    const v4 = validate('address',   true);

    if (!v1 || !v2 || !v3 || !v4) return;
    if (cart.length === 0) { alert('Your cart is empty.'); return; }

    // Clear errors
    ['firstName','lastName','phone','address'].forEach(id => {
      document.getElementById('field-' + id)?.classList.remove('invalid');
    });

    // Show toast
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);

    cart = [];
    renderCart();
    this.reset();
  });

  // Live validation clearing
  ['firstName','lastName','phone','address'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      document.getElementById('field-' + id)?.classList.remove('invalid');
    });
  });

  renderCart();
</script>
</body>
</html>