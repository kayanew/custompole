<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: /login.php');
    exit;
}
$customer_id = $_SESSION['user_id'];
$customer_name = $_SESSION['fname'] ?? 'there';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Orders</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #f8f9fa; }

    .page-title { font-size: 1.4rem; font-weight: 600; }

    /* Status pills */
    .status-pill {
      display: inline-block;
      padding: 3px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .status-pending    { background: #f3f4f6; color: #6b7280; }
    .status-confirmed  { background: #dbeafe; color: #1d4ed8; }
    .status-processing { background: #ede9fe; color: #6d28d9; }
    .status-shipped    { background: #fef3c7; color: #92400e; }
    .status-delivered  { background: #d1fae5; color: #065f46; }
    .status-cancelled  { background: #fee2e2; color: #991b1b; }

    /* Order card */
    .order-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      margin-bottom: 16px;
      transition: box-shadow 0.15s;
    }
    .order-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.07); }

    .order-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      border-bottom: 1px solid #f3f4f6;
      flex-wrap: wrap;
      gap: 8px;
      cursor: pointer;
    }
    .order-meta { font-size: 0.82rem; color: #6b7280; }
    .order-meta strong { color: #111827; font-size: 0.9rem; }

    .order-card-body {
      padding: 16px 20px;
    }

    /* Items list inside card */
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.88rem;
    }
    .item-row:last-child { border-bottom: none; }
    .item-name  { font-weight: 500; color: #111827; }
    .item-meta  { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }
    .item-price { font-weight: 600; color: #111827; white-space: nowrap; }

    /* Footer row */
    .order-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-top: 1px solid #f3f4f6;
      flex-wrap: wrap;
      gap: 8px;
    }
    .order-total { font-size: 0.95rem; }
    .order-total strong { color: #4c956c; }

    /* Cancel button */
    .btn-cancel {
      font-size: 0.8rem;
      padding: 5px 14px;
      border: 1px solid #ef4444;
      color: #ef4444;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .btn-cancel:hover { background: #ef4444; color: #fff; }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #9ca3af;
    }
    .empty-state h5 { font-size: 1rem; color: #6b7280; margin-bottom: 6px; }

    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite;
      border-radius: 6px;
      height: 16px;
      margin-bottom: 8px;
    }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* Detail panel (slide-in feel via collapse) */
    .detail-toggle { font-size: 0.8rem; color: #4c956c; cursor: pointer; text-decoration: none; }
    .detail-toggle:hover { text-decoration: underline; }

    /* Delivery area badge */
    .area-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: #6b7280;
    }

    /* Alert toast */
    .toast-wrap {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }
  </style>
</head>
<body>

<!-- Toast notification -->
<div class="toast-wrap">
  <div id="toast" class="toast align-items-center text-white border-0" role="alert" aria-live="assertive">
    <div class="d-flex">
      <div class="toast-body" id="toast-msg"></div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  </div>
</div>

<div class="container py-5" style="max-width: 760px;">

  <div class="d-flex justify-content-between align-items-center mb-4">
    <div>
      <div class="page-title">My Orders</div>
      <div class="text-muted" style="font-size:0.83rem">Hi <?= htmlspecialchars($customer_name) ?>, here are your orders</div>
    </div>
    <a href="/mvp/public/index.php" class="btn btn-sm btn-outline-secondary">Continue Shopping</a>
  </div>

  <!-- Orders will be injected here -->
  <div id="orders-wrap">
    <!-- Skeleton loader -->
    <div class="order-card p-3" id="skeleton">
      <div class="skeleton" style="width:40%"></div>
      <div class="skeleton" style="width:70%"></div>
      <div class="skeleton" style="width:55%"></div>
    </div>
  </div>

</div>

<!-- Cancel confirmation modal -->
<div class="modal fade" id="cancelModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header border-0 pb-0">
        <h6 class="modal-title fw-600">Cancel Order</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body pt-2">
        <p style="font-size:0.9rem">Are you sure you want to cancel order <strong id="cancel-order-num"></strong>?
        This cannot be undone.</p>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Keep Order</button>
        <button class="btn btn-sm btn-danger" id="confirm-cancel-btn">Yes, Cancel</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
  let cancelOrderId   = null;
  let cancelOrderNum  = null;
  const cancelModal   = new bootstrap.Modal(document.getElementById('cancelModal'));
  const toastEl       = document.getElementById('toast');
  const bsToast       = new bootstrap.Toast(toastEl, { delay: 3500 });

  function showToast(msg, type = 'success') {
    toastEl.className = `toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : 'danger'}`;
    document.getElementById('toast-msg').textContent = msg;
    bsToast.show();
  }

  function statusPill(status) {
    return `<span class="status-pill status-${status}">${status}</span>`;
  }

  function canCancel(status) {
    return status && status.toLowerCase() === 'pending';
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function renderOrders(orders) {
    const wrap = document.getElementById('orders-wrap');
    wrap.innerHTML = '';

    if (!orders || orders.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div style="font-size:2.5rem;margin-bottom:12px">📦</div>
          <h5>No orders yet</h5>
          <p style="font-size:0.85rem">You haven't placed any orders. Start shopping!</p>
          <a href="/index.php" class="btn btn-sm mt-2" style="background:#4c956c;color:#fff">Browse Products</a>
        </div>`;
      return;
    }

    orders.forEach(order => {
      const itemsHtml = order.items.map(item => `
        <div class="item-row">
          <div>
            <div class="item-name">${item.product_name}</div>
            <div class="item-meta">Qty: ${item.quantity} · NPR ${parseFloat(item.unit_price).toLocaleString()} each ${item.current_stock != null ? `· Stock: ${item.current_stock}` : ''}</div>
          </div>
          <div class="item-price">NPR ${parseFloat(item.line_total).toLocaleString()}</div>
        </div>`).join('');

      const cancelBtn = canCancel(order.order_status)
        ? `<button class="btn-cancel" onclick="promptCancel(${order.order_id}, '${order.order_number}')">Cancel Order</button>`
        : '';

      const collapseId = `items-${order.order_id}`;

      const card = document.createElement('div');
      card.className = 'order-card';
      card.id = `order-card-${order.order_id}`;
      card.innerHTML = `
        <div class="order-card-header" onclick="toggleItems('${collapseId}', this)">
          <div>
            <div class="order-meta"><strong>#${order.order_number}</strong></div>
            <div class="order-meta mt-1">
              ${formatDate(order.placed_at)} &nbsp;·&nbsp;
              <span class="area-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${order.shipping_city}
              </span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            ${statusPill(order.order_status)}
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition:transform .2s"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div id="${collapseId}" style="display:none">
          <div class="order-card-body">
            <div style="font-size:0.78rem;color:#9ca3af;margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em">Items</div>
            ${itemsHtml}
          </div>
          <div class="order-card-footer">
            <div class="order-total">
              <span class="text-muted" style="font-size:0.83rem">
                Subtotal NPR ${parseFloat(order.subtotal).toLocaleString()} 
                + Delivery NPR ${parseFloat(order.shipping_total).toLocaleString()}
              </span><br>
              Grand Total: <strong>NPR ${parseFloat(order.grand_total).toLocaleString()}</strong>
            </div>
            ${cancelBtn}
          </div>
        </div>`;

      wrap.appendChild(card);
    });
  }

  function toggleItems(collapseId, header) {
    const el      = document.getElementById(collapseId);
    const chevron = header.querySelector('.chevron');
    const isOpen  = el.style.display !== 'none';
    el.style.display   = isOpen ? 'none' : 'block';
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
  }

  function promptCancel(orderId, orderNumber) {
    cancelOrderId  = orderId;
    cancelOrderNum = orderNumber;
    document.getElementById('cancel-order-num').textContent = '#' + orderNumber;
    cancelModal.show();
  }

  document.getElementById('confirm-cancel-btn').addEventListener('click', function () {
    if (!cancelOrderId) return;

    this.disabled    = true;
    this.textContent = 'Cancelling...';

    fetch('../../backend/orders/cancel_order.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'order_id=' + cancelOrderId
    })
    .then(r => r.json())
    .then(res => {
      cancelModal.hide();
      this.disabled    = false;
      this.textContent = 'Yes, Cancel';
      if (res.success) {
        showToast('Order #' + cancelOrderNum + ' cancelled successfully.');
        // Update status pill without full reload
        const card = document.getElementById('order-card-' + cancelOrderId);
        if (card) {
          const pill = card.querySelector('.status-pill');
          if (pill) {
            pill.className  = 'status-pill status-cancelled';
            pill.textContent = 'cancelled';
          }
          // Remove cancel button
          const btn = card.querySelector('.btn-cancel');
          if (btn) btn.remove();
        }
      } else {
        showToast(res.message || 'Could not cancel order.', 'danger');
      }
    })
    .catch(() => {
      cancelModal.hide();
      this.disabled    = false;
      this.textContent = 'Yes, Cancel';
      showToast('Could not connect to server.', 'danger');
    });
  });

  // Fetch orders on load
  fetch('../../backend/orders/get-orders.php')
    .then(r => r.json())
    .then(data => {
      document.getElementById('skeleton').remove();
      if (data.success) {
        renderOrders(data.orders);
      } else {
        document.getElementById('orders-wrap').innerHTML =
          `<div class="empty-state"><h5>${data.message || 'Could not load orders.'}</h5></div>`;
      }
    })
    .catch(() => {
      document.getElementById('skeleton').remove();
      document.getElementById('orders-wrap').innerHTML =
        `<div class="empty-state"><h5>Could not connect to server.</h5></div>`;
    });
</script>

</body>
</html>