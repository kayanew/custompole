// ─── checkout.js ─────────────────────────────────────────────────────────────
// Handles: cart loading, form validation, place order fetch, success modal
// ─────────────────────────────────────────────────────────────────────────────

const DELIVERY_FEE = 70;
let cartData       = {};
let grandTotalCalc = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetchCart();

    // Form submit
    document.getElementById('checkout-form').addEventListener('submit', function (e) {
        e.preventDefault();

        if (!this.checkValidity()) {
            this.classList.add('was-validated');
            return;
        }
        if (Object.keys(cartData).length === 0) {
            alert('Your cart is empty.');
            return;
        }

        placeOrder(this);
    });

    // Continue Shopping button in modal
    document.getElementById('modal-continue-btn').addEventListener('click', () => {
        window.location.href = '../../public/pages/product-catalog.php';
    });

    // Bootstrap inline validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});


// ─── 1. Fetch cart from PHP session ──────────────────────────────────────────
function fetchCart() {
    fetch('../../backend/products/cartActions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=fetch'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText} — cartActions.php`);
        }
        return res.text(); // Read raw text first to catch PHP warnings/errors
    })
    .then(text => {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // PHP likely printed a warning/error before the JSON output
            throw new Error(
                `cartActions.php returned invalid JSON.\n\nRaw response:\n${text.substring(0, 500)}`
            );
        }

        if (data.cart !== undefined) {
            renderCart(data);
        } else {
            showCartError(
                `Unexpected response structure from cartActions.php: ${JSON.stringify(data)}`
            );
        }
    })
    .catch(err => {
        console.error('[fetchCart] Error:', err);
        showCartError(`Failed to load cart — ${err.message}`);
    });
}

// Helper: display an error message inside the cart list
function showCartError(message) {
    const itemsDiv = document.getElementById('cart-items');
    if (itemsDiv) {
        itemsDiv.innerHTML = `
            <li class="list-group-item text-danger">
                <strong>Cart error:</strong><br>
                <small style="white-space:pre-wrap">${escapeHtml(message)}</small>
            </li>`;
    }
}


// ─── 2. Render cart summary panel ────────────────────────────────────────────
function renderCart(data) {
    const itemsDiv   = document.getElementById('cart-items');
    const totalEl    = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const countSpan  = document.getElementById('cart-count');
    const placeBtn   = document.getElementById('place-btn');

    itemsDiv.innerHTML = '';
    let count = 0;

    const items = Object.values(data.cart || {});

    if (items.length === 0) {
        itemsDiv.innerHTML   = '<li class="list-group-item text-muted text-center">Your cart is empty.</li>';
        totalEl.innerText    = 'NPR 0';
        subtotalEl.innerText = 'NPR 0';
        shippingEl.innerText = 'NPR 0';
        countSpan.innerText  = '0';
        if (placeBtn) placeBtn.disabled = true;
        grandTotalCalc = 0;
        return;
    }

    let subtotal = 0;
    const sellerIds     = [...new Set(items.map(i => i.seller_id).filter(Boolean))];
    const sellerCount   = sellerIds.length || 1;
    const shippingTotal = DELIVERY_FEE * sellerCount;

    items.forEach(item => {
        count    += item.quantity;
        subtotal += item.price * item.quantity;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between lh-sm';
        li.innerHTML = `
            <div>
                <h6 class="my-0">${escapeHtml(item.name)}</h6>
                <small class="text-muted">Qty: ${item.quantity}${item.weight ? ' · ' + escapeHtml(item.weight) : ''}</small>
            </div>
            <span>NPR ${(item.price * item.quantity).toLocaleString()}</span>`;
        itemsDiv.appendChild(li);
    });

    grandTotalCalc = subtotal + shippingTotal;

    countSpan.innerText  = count;
    subtotalEl.innerText = 'NPR ' + subtotal.toLocaleString();
    shippingEl.innerText = 'NPR ' + shippingTotal.toLocaleString()
        + (sellerCount > 1 ? ' (' + sellerCount + ' sellers)' : '');
    totalEl.innerText    = 'NPR ' + grandTotalCalc.toLocaleString();

    cartData = data.cart;
}


// ─── 3. Place Order via fetch API ─────────────────────────────────────────────
function placeOrder(form) {
    const btn       = document.getElementById('place-btn');
    btn.disabled    = true;
    btn.textContent = 'Placing order...';

    const payload = JSON.stringify({
        shipping_name:    document.getElementById('fullName').value.trim(),
        shipping_phone:   document.getElementById('phone').value.trim(),
        shipping_city:    document.getElementById('city').value,
        shipping_address: document.getElementById('address').value.trim(),
        notes:            ''
    });

    fetch('../../backend/orders/place-order.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    payload
    })
    .then(r => {
        if (!r.ok) {
            throw new Error(`HTTP ${r.status} ${r.statusText} — place-order.php`);
        }
        return r.text(); // Read raw text first to catch PHP warnings/errors
    })
    .then(text => {
        let res;
        try {
            res = JSON.parse(text);
        } catch (e) {
            // PHP likely printed a warning/notice before the JSON output
            throw new Error(
                `place-order.php returned invalid JSON.\n\nRaw response:\n${text.substring(0, 500)}`
            );
        }

        if (res.success) {
            // Populate and show success modal
            document.getElementById('modal-order-number').textContent = res.order_number;
            document.getElementById('modal-grand-total').textContent  =
                'NPR ' + parseFloat(res.grand_total).toLocaleString();
            document.getElementById('order-success-modal').style.display = 'flex';

            // Reset form and cart panel
            cartData = {};
            renderCart({ cart: {} });
            form.reset();
            form.classList.remove('was-validated');
            btn.textContent = 'Order Placed';

        } else {
            // Server returned success:false — show the exact message from PHP
            const msg = res.message || 'Something went wrong. Please try again.';
            console.warn('[placeOrder] Server error:', res);
            alert('Order failed: ' + msg);
            btn.disabled    = false;
            btn.textContent = 'Place Order';
        }
    })
    .catch(err => {
        console.error('[placeOrder] Error:', err);
        alert('Could not place order.\n\n' + err.message);
        btn.disabled    = false;
        btn.textContent = 'Place Order';
    });
}


// ─── Utility: escape HTML to prevent XSS in dynamically inserted content ─────
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}