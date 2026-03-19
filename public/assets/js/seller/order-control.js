// ─── order-control.js ─────────────────────────────────────────────────────────
// Handles: orders list fetch, detail modal, status updates, dashboard counts
// Renders into: .content-box (existing seller panel element)
// ─────────────────────────────────────────────────────────────────────────────

const ORDER_API = '../../backend/orders/order-actions.php';

// ── Status config — labels, colors, next allowed transitions ─────────────────
const STATUS_CONFIG = {
    pending:    { label: 'Pending',    badge: 'badge-pending',    next: ['processing', 'cancelled'] },
    processing: { label: 'Processing', badge: 'badge-processing', next: ['shipped',    'cancelled'] },
    shipped:    { label: 'Shipped',    badge: 'badge-shipped',    next: ['delivered',  'cancelled'] },
    delivered:  { label: 'Delivered',  badge: 'badge-delivered',  next: [] },
    cancelled:  { label: 'Cancelled',  badge: 'badge-cancelled',  next: [] },
    mixed:      { label: 'Mixed',      badge: 'badge-mixed',      next: [] },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. INIT — wire up the order dropdown buttons
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Load dashboard counts on page load
    fetchDashboardCounts();

    // Wire order filter buttons
    document.getElementById('btn-all-orders')?.addEventListener('click',       () => loadOrders('all'));
    document.getElementById('btn-pending-orders')?.addEventListener('click',   () => loadOrders('pending'));
    document.getElementById('btn-completed-orders')?.addEventListener('click', () => loadOrders('delivered'));

    // Detail modal — status update button
    document.getElementById('orderDetailModal')
        ?.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-update-status');
            if (btn) handleStatusUpdate(btn);
        });
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. LOAD ORDERS LIST
// ─────────────────────────────────────────────────────────────────────────────
function loadOrders(status = 'all') {
    // const box = document.querySelector('.content-box');
    // box.innerHTML = renderSkeleton();
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        bootstrap.Dropdown.getOrCreateInstance(menu.previousElementSibling).hide();
    });

    const box = document.getElementById('content-box');
    box.innerHTML = renderSkeleton();

    fetch(`${ORDER_API}?action=fetch_orders&status=${encodeURIComponent(status)}`)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
            return r.text();
        })
        .then(text => {
            let data;
            try { data = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON from order-actions.php:\n${text.substring(0, 300)}`); }

            if (!data.success) throw new Error(data.message);

            box.innerHTML = renderOrdersTable(data.orders, status);

            // Wire row clicks → open detail modal
            box.querySelectorAll('tr[data-order-id]').forEach(row => {
                row.addEventListener('click', () => {
                    loadOrderDetail(row.dataset.orderId);
                });
            });
        })
        .catch(err => {
            console.error('[loadOrders]', err);
            box.innerHTML = renderError(err.message);
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. RENDER ORDERS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function renderOrdersTable(orders, status) {
    const titleMap = {
        all:       'All Orders',
        pending:   'Pending Orders',
        delivered: 'Completed Orders',
    };

    if (orders.length === 0) {
        return `
            <div class="orders-empty">
                <div class="orders-empty-icon">
                    <i class="fa-regular fa-folder-open"></i>
                </div>
                <p class="orders-empty-title">No orders found</p>
                <p class="orders-empty-sub">
                    ${status === 'all' ? 'You have not received any orders yet.' : `No <strong>${status}</strong> orders at the moment.`}
                </p>
            </div>`;
    }

    const rows = orders.map(o => {
        const cfg     = STATUS_CONFIG[o.fulfillment_status] || STATUS_CONFIG.pending;
        const date    = formatDate(o.placed_at);
        const total   = formatNPR(o.seller_subtotal);
        const itemTxt = o.item_count == 1 ? '1 item' : `${o.item_count} items`;

        return `
            <tr data-order-id="${o.order_id}" title="Click to view details">
                <td>
                    <span class="order-number">${escHtml(o.order_number)}</span>
                    <span class="order-date">${date}</span>
                </td>
                <td>
                    <span class="customer-name">${escHtml(o.shipping_name)}</span>
                    <span class="customer-city">${escHtml(o.shipping_city)}</span>
                </td>
                <td><span class="item-count-pill">${itemTxt}</span></td>
                <td><strong class="order-total">${total}</strong></td>
                <td><span class="status-badge ${cfg.badge}">${cfg.label}</span></td>
                <td class="text-end">
                    <i class="fa-solid fa-chevron-right text-muted" style="font-size:0.75rem"></i>
                </td>
            </tr>`;
    }).join('');

    return `
        <div class="orders-header">
            <h5 class="orders-title">${titleMap[status] || 'Orders'}</h5>
            <span class="orders-count-badge">${orders.length}</span>
        </div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Your Earnings</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. LOAD & RENDER ORDER DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function loadOrderDetail(orderId) {
    // Show modal in loading state immediately
    const modalEl = document.getElementById('orderDetailModal');
    const body    = document.getElementById('orderDetailBody');
    body.innerHTML = renderModalSkeleton();

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    fetch(`${ORDER_API}?action=fetch_detail&order_id=${encodeURIComponent(orderId)}`)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
            return r.text();
        })
        .then(text => {
            let data;
            try { data = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }

            if (!data.success) throw new Error(data.message);

            body.innerHTML = renderDetailBody(data.order, data.items);
        })
        .catch(err => {
            console.error('[loadOrderDetail]', err);
            body.innerHTML = `<div class="alert alert-danger m-3"><strong>Error:</strong> ${escHtml(err.message)}</div>`;
        });
}

function renderDetailBody(order, items) {
    const statusCfg = STATUS_CONFIG[order.order_status?.toLowerCase()] || STATUS_CONFIG.pending;

    const itemRows = items.map(item => {
        const cfg      = STATUS_CONFIG[item.fulfillment_status] || STATUS_CONFIG.pending;
        const nextOpts = cfg.next.map(s =>
            `<option value="${s}">${STATUS_CONFIG[s].label}</option>`
        ).join('');

        const hasNext = cfg.next.length > 0;

        return `
            <tr>
                <td>
                    <div class="detail-product-name">${escHtml(item.product_name)}</div>
                    ${item.product_weight ? `<small class="text-muted">${escHtml(item.product_weight)}</small>` : ''}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td>${formatNPR(item.unit_price)}</td>
                <td><strong>${formatNPR(item.line_total)}</strong></td>
                <td>
                    <div class="detail-payout">
                        <span>${formatNPR(item.seller_payout_amount)}</span>
                        <small class="text-muted">(${item.commission_rate}% fee)</small>
                    </div>
                </td>
                <td>
                    ${hasNext ? `
                        <div class="status-update-wrap">
                            <span class="status-badge ${cfg.badge} me-2">${cfg.label}</span>
                            <select class="form-select form-select-sm status-select" style="width:auto;display:inline-block">
                                <option value="">Update...</option>
                                ${nextOpts}
                            </select>
                            <button
                                class="btn btn-sm btn-update-status ms-1"
                                data-item-id="${item.order_item_id}"
                                data-current="${item.fulfillment_status}">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        </div>
                    ` : `<span class="status-badge ${cfg.badge}">${cfg.label}</span>`}
                </td>
            </tr>`;
    }).join('');

    // Totals
    const sellerTotal    = items.reduce((s, i) => s + parseFloat(i.line_total),           0);
    const sellerPayout   = items.reduce((s, i) => s + parseFloat(i.seller_payout_amount), 0);
    const sellerCommission = items.reduce((s, i) => s + parseFloat(i.commission_amount),  0);

    return `
        <!-- Order meta -->
        <div class="detail-meta-bar">
            <div class="detail-meta-item">
                <span class="detail-meta-label">Order Number</span>
                <span class="detail-meta-value order-number">${escHtml(order.order_number)}</span>
            </div>
            <div class="detail-meta-item">
                <span class="detail-meta-label">Placed</span>
                <span class="detail-meta-value">${formatDate(order.placed_at)}</span>
            </div>
            <div class="detail-meta-item">
                <span class="detail-meta-label">Payment</span>
                <span class="detail-meta-value">${escHtml(order.payment_method)}</span>
            </div>
            <div class="detail-meta-item">
                <span class="detail-meta-label">Order Status</span>
                <span class="status-badge ${statusCfg.badge}">${escHtml(order.order_status)}</span>
            </div>
        </div>

        <!-- Shipping -->
        <div class="detail-section">
            <div class="detail-section-title">
                <i class="fa-solid fa-location-dot me-2"></i>Shipping Address
            </div>
            <div class="detail-shipping-card">
                <div class="detail-shipping-name">${escHtml(order.shipping_name)}</div>
                <div class="detail-shipping-info">
                    <i class="fa-solid fa-phone fa-xs me-1"></i>${escHtml(order.shipping_phone)}
                </div>
                <div class="detail-shipping-info">
                    <i class="fa-solid fa-map-pin fa-xs me-1"></i>
                    ${escHtml(order.shipping_address)}, ${escHtml(order.shipping_city)},
                    ${escHtml(order.shipping_state)}, ${escHtml(order.shipping_country)}
                </div>
                ${order.notes ? `<div class="detail-shipping-notes"><i class="fa-regular fa-note-sticky fa-xs me-1"></i>${escHtml(order.notes)}</div>` : ''}
            </div>
        </div>

        <!-- Items table -->
        <div class="detail-section">
            <div class="detail-section-title">
                <i class="fa-solid fa-box me-2"></i>Your Items in This Order
            </div>
            <div class="table-responsive">
                <table class="table detail-items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th class="text-center">Qty</th>
                            <th>Unit Price</th>
                            <th>Line Total</th>
                            <th>Your Payout</th>
                            <th>Fulfillment</th>
                        </tr>
                    </thead>
                    <tbody>${itemRows}</tbody>
                </table>
            </div>
        </div>

        <!-- Earnings summary -->
        <div class="detail-earnings-summary">
            <div class="detail-earnings-row">
                <span>Items subtotal</span>
                <span>${formatNPR(sellerTotal)}</span>
            </div>
            <div class="detail-earnings-row text-danger">
                <span>Platform commission</span>
                <span>− ${formatNPR(sellerCommission)}</span>
            </div>
            <div class="detail-earnings-row detail-earnings-total">
                <span>Your payout</span>
                <strong>${formatNPR(sellerPayout)}</strong>
            </div>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. HANDLE STATUS UPDATE
// ─────────────────────────────────────────────────────────────────────────────
function handleStatusUpdate(btn) {
    const wrap      = btn.closest('.status-update-wrap');
    const select    = wrap.querySelector('.status-select');
    const newStatus = select.value;
    const itemId    = btn.dataset.itemId;

    if (!newStatus) {
        showToast('Please select a status to update to.', 'error');
        return;
    }

    // Optimistic UI — disable while in flight
    btn.disabled    = true;
    btn.innerHTML   = '<span class="spinner-border spinner-border-sm"></span>';

    fetch(ORDER_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'update_status', order_item_id: parseInt(itemId), new_status: newStatus })
    })
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
        return r.text();
    })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }

        if (!data.success) throw new Error(data.message);

        showToast(data.message, 'success');

        // Update the badge + remove the update controls
        const cfg = STATUS_CONFIG[newStatus];
        const td  = btn.closest('td');
        td.innerHTML = `<span class="status-badge ${cfg.badge}">${cfg.label}</span>`;

        // If no more transitions available, hide controls entirely
        if (cfg.next.length === 0) {
            wrap?.remove();
        }

        // Refresh dashboard counts
        fetchDashboardCounts();

    })
    .catch(err => {
        console.error('[handleStatusUpdate]', err);
        showToast('Update failed: ' + err.message, 'error');
        btn.disabled  = false;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. FETCH DASHBOARD COUNTS
// ─────────────────────────────────────────────────────────────────────────────
function fetchDashboardCounts() {
    fetch(`${ORDER_API}?action=fetch_counts`)
        .then(r => r.text())
        .then(text => {
            let data;
            try { data = JSON.parse(text); } catch (e) { return; }
            if (!data.success) return;

            const c = data.counts;
            const el = id => document.getElementById(id);

            if (el('dash-total-orders'))   el('dash-total-orders').textContent   = c.total_orders   ?? '—';
            if (el('dash-pending-orders')) el('dash-pending-orders').textContent = c.pending         ?? '—';
            if (el('dash-earnings'))       el('dash-earnings').textContent       = formatNPR(c.total_earnings ?? 0);
        })
        .catch(() => {}); // Silent — dashboard cards are non-critical
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. SKELETON LOADERS
// ─────────────────────────────────────────────────────────────────────────────
function renderSkeleton() {
    const rows = Array(5).fill(`
        <tr class="skeleton-row">
            <td><div class="skel skel-line w-60"></div><div class="skel skel-line w-40 mt-1"></div></td>
            <td><div class="skel skel-line w-50"></div></td>
            <td><div class="skel skel-line w-30"></div></td>
            <td><div class="skel skel-line w-40"></div></td>
            <td><div class="skel skel-pill"></div></td>
            <td></td>
        </tr>`).join('');

    return `
        <div class="orders-header">
            <div class="skel skel-line w-20"></div>
        </div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table">
                <thead>
                    <tr>
                        <th>Order</th><th>Customer</th><th>Items</th>
                        <th>Your Earnings</th><th>Status</th><th></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}

function renderModalSkeleton() {
    return `
        <div class="p-4">
            <div class="skel skel-line w-40 mb-3"></div>
            <div class="skel skel-block mb-4" style="height:80px"></div>
            <div class="skel skel-line w-30 mb-3"></div>
            <div class="skel skel-block" style="height:160px"></div>
        </div>`;
}

function renderError(message) {
    return `
        <div class="orders-error">
            <i class="fa-solid fa-triangle-exclamation fa-2x mb-3 text-danger"></i>
            <p class="fw-semibold text-danger mb-1">Failed to load orders</p>
            <pre class="orders-error-pre">${escHtml(message)}</pre>
            <button class="btn btn-sm btn-outline-secondary mt-3" onclick="loadOrders('all')">
                <i class="fa-solid fa-rotate-right me-1"></i>Retry
            </button>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function formatNPR(amount) {
    return 'NPR ' + parseFloat(amount || 0).toLocaleString('en-NP', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className   = `toast ${type} show`;
    setTimeout(() => { toast.classList.remove('show'); }, 3500);
}