document.addEventListener('DOMContentLoaded', () => {
    const productControlBtn = document.getElementById('ftch-product-apps');
    if (productControlBtn) {
        productControlBtn.addEventListener('click', loadProducts);
    }
});

// ─── Fetch pending products ───────────────────────────────────
async function loadProducts() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading pending products...</p>`;

    try {
        const response = await fetch('../../backend/users/admin/products-control.php?filter=pending', {
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch products');
        renderProducts(result.data);
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load products: ${err.message}</div>`;
    }
}

// ─── Fetch all products ───────────────────────────────────────
async function loadAllProducts() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading all products...</p>`;

    try {
        const response = await fetch('../../backend/users/admin/products-control.php?filter=all', {
            cache: 'no-store'
        });
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch products');
        renderProducts(result.data, false);
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load products: ${err.message}</div>`;
    }
}

// ─── Render table ─────────────────────────────────────────────
function renderProducts(products, pendingView = true) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No products found.</div>`;
        return;
    }

    const title      = pendingView ? 'Pending Product Approvals' : 'All Products';
    const badgeText  = pendingView ? `${products.length} Pending` : `${products.length} Products`;
    const badgeClass = pendingView ? 'bg-warning text-dark' : 'bg-secondary text-light';

    container.innerHTML = `
        <div class="card shadow-sm" style="border:none; border-radius:12px; overflow:hidden;">
            <div class="card-header d-flex justify-content-between align-items-center"
                 style="background-color:#2c6e49;">
                <h5 class="mb-0 text-white">
                    <i class="fas fa-box me-2"></i>${title}
                </h5>
                <span class="badge ${badgeClass}" id="product-count-badge">${badgeText}</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle mb-0" id="products-table">
                        <thead style="background-color:#1a1a2e; color:#fff;">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Seller</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="products-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>`;

    const tbody = document.getElementById('products-tbody');

    products.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.id = `product-row-${product.product_id}`;
        tr.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f0f7f3';
        tr.dataset.product = JSON.stringify(product);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${product.name}</strong><br>
                <small class="text-muted">
                    ${product.description ? product.description.substring(0, 50) + '…' : ''}
                </small>
            </td>
            <td>
                ${product.seller_name ?? 'N/A'}<br>
                <small class="text-muted">${product.seller_email ?? ''}</small>
            </td>
            <td>NPR ${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <span class="badge" style="background-color:#1a1a2e; color:#fff;">
                    ${product.category ?? 'N/A'}
                </span>
            </td>
            <td>${new Date(product.created_at).toLocaleDateString()}</td>
            <td id="status-badge-${product.product_id}">${getProductStatusBadge(product.status)}</td>
            <td class="text-center" id="actions-${product.product_id}">
                ${getProductActionButtons(product.product_id, product.name, product.status, pendingView)}
            </td>`;

        tbody.appendChild(tr);
    });
}

// ─── Product detail modal ─────────────────────────────────────
function showProductDetail(productId) {
    const row     = document.getElementById(`product-row-${productId}`);
    const product = JSON.parse(row.dataset.product);

    const html = `
        <div class="mb-2"><strong>Name:</strong> ${product.name}</div>
        <div class="mb-2"><strong>Seller:</strong> ${product.seller_name ?? 'N/A'} (${product.seller_email ?? 'N/A'})</div>
        <div class="mb-2"><strong>Category:</strong> ${product.category ?? 'N/A'}</div>
        <div class="mb-2"><strong>Type:</strong> ${product.product_type ?? 'N/A'}</div>
        <div class="mb-2"><strong>Price:</strong> NPR ${parseFloat(product.price).toFixed(2)}</div>
        <div class="mb-2"><strong>Stock:</strong> ${product.stock ?? 0}</div>
        <div class="mb-2"><strong>Status:</strong> ${product.status}</div>
        <div class="mb-2"><strong>Submitted:</strong> ${new Date(product.created_at).toLocaleDateString()}</div>
        <div class="mb-2"><strong>Description:</strong><br>${product.description ?? 'No description provided.'}</div>`;

    showAdminDetailModal(`Product: ${product.name}`, html);
}

// ─── Status badge ─────────────────────────────────────────────
function getProductStatusBadge(status) {
    const map = {
        pending:  'background-color:#ffc107; color:#333;',
        approved: 'background-color:#4c956c; color:#fff;',
        rejected: 'background-color:#c0392b; color:#fff;'
    };
    const style = map[status] ?? 'background-color:#aaa; color:#fff;';
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="badge" style="${style}">${label}</span>`;
}

// ─── Action buttons — NO suspend ─────────────────────────────
// Removed: suspend / activate buttons entirely.
// Remaining actions: Details · Approve · Reject · Delete
function getProductActionButtons(productId, productName, status, pendingView = true) {

    // Details — outline dark, no icon
    const detailBtn = `
        <button class="btn btn-sm btn-outline-dark me-1"
                onclick="showProductDetail(${productId})">
            Details
        </button>`;

    // Approve — shown when pending or rejected
    const approveBtn = (status === 'pending' || status === 'rejected')
        ? `<button class="btn btn-sm btn-outline-success me-1"
                   onclick="handleProductAction(${productId}, '${productName}', 'approve')">
               Approve
           </button>`
        : '';

    // Reject — shown when pending or approved (only in pending view)
    const rejectBtn = pendingView && (status === 'pending' || status === 'approved')
        ? `<button class="btn btn-sm btn-outline-warning me-1"
                   onclick="handleProductAction(${productId}, '${productName}', 'reject')">
               Reject
           </button>`
        : '';

    // Delete — always shown, trash icon only
    const deleteBtn = `
        <button class="btn btn-sm btn-danger"
                onclick="handleProductAction(${productId}, '${productName}', 'delete')"
                title="Delete product">
            <i class="fas fa-trash"></i>
        </button>`;

    return detailBtn + approveBtn + rejectBtn + deleteBtn;
}

// ─── Handle action ────────────────────────────────────────────
async function handleProductAction(productId, productName, action) {
    const confirmMessages = {
        approve: `Approve "${productName}"? It will be visible to buyers.`,
        reject:  `Reject "${productName}"? The seller will be notified.`,
        delete:  `Permanently delete "${productName}"? This cannot be undone.`
    };

    if (!confirm(confirmMessages[action])) return;

    const row     = document.getElementById(`product-row-${productId}`);
    const buttons = row.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    try {
        const response = await fetch('../../backend/users/admin/products-control.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ product_id: productId, action })
        });

        const result = await response.json();

        if (result.success) {
            row.remove();
            const remaining = document.querySelectorAll('#products-tbody tr').length;
            const badge = document.getElementById('product-count-badge');
            if (badge) badge.textContent = `${remaining} Pending`;
        } else {
            alert(result.message || `Failed to ${action} product.`);
            buttons.forEach(b => b.disabled = false);
        }

    } catch (err) {
        console.error(err);
        alert('Error performing action. Check console for details.');
        buttons.forEach(b => b.disabled = false);
    }
}