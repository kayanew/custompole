// =============================================================================
// view-product.js
// Seller product panel — fetch, render, CRUD, image replace, mobile cards.
//
// Depends on (loaded in seller-panel.php before this file):
//   - bootstrap.bundle.min.js
//   - view-products.css          (all component + responsive styles)
//   - modal-product-detail.php   (detail modal HTML, PHP-included)
//   - modal-product-edit.php     (edit modal HTML, PHP-included)
// =============================================================================

const PRODUCTS_API = '../../backend/products/view-products.php';


// ─────────────────────────────────────────────────────────────────────────────
// 1. INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btn-view-products')?.addEventListener('click',  () => loadProducts());
    document.getElementById('btn-update-product')?.addEventListener('click', () => loadProducts('update'));
    document.getElementById('btn-remove-product')?.addEventListener('click', () => loadProducts('delete'));

    // Edit modal image picker — element exists at page load (static HTML now)
    document.getElementById('vp-edit-image')?.addEventListener('change', handleEditImagePreview);
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. LOAD PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
function loadProducts(mode = 'view') {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        bootstrap.Dropdown.getOrCreateInstance(menu.previousElementSibling).hide();
    });

    const box = document.getElementById('content-box');
    box.innerHTML = renderSkeleton();

    fetch(PRODUCTS_API, { cache: 'no-store' })
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
            return r.text();
        })
        .then(text => {
            let data;
            try { data = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON from view-products.php:\n${text.substring(0, 300)}`); }
            if (!data.success) throw new Error(data.message);
            renderProducts(data.data, mode);
        })
        .catch(err => {
            console.error('[loadProducts]', err);
            box.innerHTML = `
                <div class="orders-error text-center p-5">
                    <ion-icon name="warning-outline" class="text-danger d-block mb-3" style="font-size:2rem;"></ion-icon>
                    <p class="fw-semibold text-danger mb-1">Failed to load products</p>
                    <pre class="orders-error-pre">${escHtml(err.message)}</pre>
                    <button class="btn btn-sm btn-outline-secondary mt-3" onclick="loadProducts()">
                        <ion-icon name="refresh-outline"></ion-icon> Retry
                    </button>
                </div>`;
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. RENDER PRODUCTS — desktop table + mobile card grid
// ─────────────────────────────────────────────────────────────────────────────
function renderProducts(products, mode = 'view') {
    const box = document.getElementById('content-box');

    const modeConfig = {
        view:   { title: 'My Products',     icon: 'cube-outline'   },
        update: { title: 'Update Stock',    icon: 'create-outline' },
        delete: { title: 'Remove Products', icon: 'trash-outline'  },
    };
    const cfg = modeConfig[mode] ?? modeConfig.view;

    if (!products || products.length === 0) {
        box.innerHTML = `
            <div class="orders-empty text-center p-5">
                <ion-icon name="folder-open-outline" class="text-muted d-block mb-3" style="font-size:2rem;"></ion-icon>
                <p class="fw-semibold text-muted">No products found</p>
                <p class="text-muted small">You have not uploaded any products yet.</p>
            </div>`;
        return;
    }

    const cards = products.map(p       => buildCard(p, mode)).join('');
    const rows  = products.map((p, i)  => buildRow(p, i, mode)).join('');

    box.innerHTML = `
        <div class="orders-header">
            <ion-icon name="${cfg.icon}" class="text-success me-2" style="font-size:1.2rem;vertical-align:middle;"></ion-icon>
            <h5 class="orders-title">${cfg.title}</h5>
            <span class="orders-count-badge">${products.length}</span>
        </div>

        <!-- Mobile card grid (visible <768px via view-products.css) -->
        <div class="vp-card-grid">${cards}</div>

        <!-- Desktop table (visible >=768px via view-products.css) -->
        <div class="table-responsive orders-table-wrap vp-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category / Type</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Added</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. BUILD MOBILE CARD
// ─────────────────────────────────────────────────────────────────────────────
function buildCard(p, mode) {
    const statusCfg  = getStatusConfig(p.status);
    const stockClass = stockColorClass(p.stock);

    return `
        <div class="vp-card" id="product-card-${p.product_id}" data-product='${serialize(p)}'>
            <div class="vp-card-inner">
                <div class="vp-card-img-wrap">${thumbHtml(p, 'card')}</div>
                <div class="vp-card-body">
                    <div class="vp-card-name">${escHtml(p.name)}</div>
                    <div class="vp-card-meta">
                        <span class="vp-category-badge">${escHtml(p.category ?? 'N/A')}</span>
                        <small class="text-muted ms-1">${escHtml(p.product_type ?? '')}</small>
                    </div>
                    <div class="vp-card-row">
                        <span class="text-success fw-bold">${formatPrice(p.price)}</span>
                        <span class="${stockClass}">Qty: ${p.stock}</span>
                    </div>
                    <div class="vp-card-row">
                        <span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span>
                        <small class="text-muted">${formatDate(p.created_at)}</small>
                    </div>
                    <div class="vp-card-actions">${buildActions(p, mode)}</div>
                </div>
            </div>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. BUILD DESKTOP TABLE ROW
// ─────────────────────────────────────────────────────────────────────────────
function buildRow(p, index, mode) {
    const statusCfg  = getStatusConfig(p.status);
    const stockClass = stockColorClass(p.stock);

    return `
        <tr id="product-row-${p.product_id}" data-product='${serialize(p)}'>
            <td class="text-muted" style="font-size:0.8rem">${index + 1}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    ${thumbHtml(p, 'table')}
                    <div>
                        <div class="product-name">${escHtml(p.name)}</div>
                        <small class="text-muted">
                            ${p.description ? escHtml(p.description.substring(0, 45)) + '…' : '—'}
                        </small>
                    </div>
                </div>
            </td>
            <td>
                <span class="vp-category-badge">${escHtml(p.category ?? 'N/A')}</span><br>
                <small class="text-muted">${escHtml(p.product_type ?? '')}</small>
            </td>
            <td><strong class="text-success">${formatPrice(p.price)}</strong></td>
            <td>
                <span class="${stockClass}">${p.stock}</span>
                ${p.stock > 0 && p.stock <= 5 ? '<br><small class="text-warning">Low stock</small>'  : ''}
                ${p.stock <= 0               ? '<br><small class="text-danger">Out of stock</small>' : ''}
            </td>
            <td><span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span></td>
            <td class="text-muted" style="font-size:0.78rem">${formatDate(p.created_at)}</td>
            <td class="text-center" id="action-cell-${p.product_id}">${buildActions(p, mode)}</td>
        </tr>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. BUILD ACTION BUTTONS
// ─────────────────────────────────────────────────────────────────────────────
function buildActions(product, mode) {
    const id   = product.product_id;
    const name = escHtml(product.name);

    if (mode === 'view') return `
        <button class="btn btn-sm btn-success text-white me-1"
                onclick="showProductDetail(${id})" title="View Details">
            Details
        </button>
        <button class="btn btn-sm btn-secondary me-1"
                onclick="showEditProductModal(${id})" title="Edit Product">
            Edit
        </button>
        <button class="btn btn-sm text-dark btn-outline-danger"
                onclick="handleDeleteProduct(${id}, '${name}')" title="Delete Product">
            <ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon>
        </button>`;

    if (mode === 'update') return `
        <div class="d-flex align-items-center gap-1 justify-content-center">
            <input type="number" id="stock-input-${id}"
                   class="form-control form-control-sm vp-stock-input"
                   value="${product.stock}" min="0" style="width:72px">
            <button class="btn btn-sm vp-btn-save"
                    onclick="handleUpdateStock(${id}, '${name}')">
                <ion-icon name="checkmark-outline"></ion-icon>
            </button>
        </div>`;

    if (mode === 'delete') return `
        <button class="btn btn-sm vp-btn-delete"
                onclick="handleDeleteProduct(${id}, '${name}')">
            <ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon> Delete
        </button>`;

    return '';
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. PRODUCT DETAIL MODAL — populate and show
// ─────────────────────────────────────────────────────────────────────────────
function showProductDetail(productId) {
    const el = document.getElementById(`product-row-${productId}`)
            ?? document.getElementById(`product-card-${productId}`);
    if (!el) return console.error('[showProductDetail] not found:', productId);

    const p         = JSON.parse(el.dataset.product);
    const statusCfg = getStatusConfig(p.status);

    document.getElementById('vp-modal-name').textContent        = p.name;
    document.getElementById('vp-modal-category').textContent    = p.category     ?? 'N/A';
    document.getElementById('vp-modal-type').textContent        = p.product_type ?? 'N/A';
    document.getElementById('vp-modal-price').textContent       = formatPrice(p.price);
    document.getElementById('vp-modal-stock').textContent       = p.stock;
    document.getElementById('vp-modal-weight').textContent      = p.weight ? `${p.weight} kg` : '—';
    document.getElementById('vp-modal-status').innerHTML        = `<span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span>`;
    document.getElementById('vp-modal-date').textContent        = formatDate(p.created_at);
    document.getElementById('vp-modal-description').textContent = p.description ?? 'No description provided.';

    const imgEl   = document.getElementById('vp-modal-image');
    const noImgEl = document.getElementById('vp-modal-no-image');
    // if (p.image) {
    //     imgEl.src             = `../../uploads/products/${escHtml(p.image)}`;
    //     imgEl.style.display   = 'block';
    //     noImgEl.style.display = 'none';
    // } else {
    //     imgEl.style.display   = 'none';
    //     noImgEl.style.display = 'block';
    // }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('vpDetailModal')).show();
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. EDIT PRODUCT MODAL — populate and show
// ─────────────────────────────────────────────────────────────────────────────
function showEditProductModal(productId) {
    const el = document.getElementById(`product-row-${productId}`)
            ?? document.getElementById(`product-card-${productId}`);
    if (!el) return;

    const p = JSON.parse(el.dataset.product);

    document.getElementById('vp-edit-id').value       = p.product_id;
    document.getElementById('vp-edit-name').value     = p.name        ?? '';
    document.getElementById('vp-edit-desc').value     = p.description ?? '';
    document.getElementById('vp-edit-category').value = p.category_id ?? '';
    document.getElementById('vp-edit-type').value     = p.type_id     ?? '';
    document.getElementById('vp-edit-price').value    = p.price       ?? '';
    document.getElementById('vp-edit-weight').value   = p.weight      ?? '';
    document.getElementById('vp-edit-stock').value    = p.stock       ?? 0;

    // Current image thumbnail
    const currentWrap = document.getElementById('vp-edit-current-img-wrap');
    const currentImg  = document.getElementById('vp-edit-current-img');
    // if (p.image) {
    //     currentImg.src            = `../../uploads/products/${escHtml(p.image)}`;
    //     currentWrap.style.display = 'block';
    // } else {
    //     currentWrap.style.display = 'none';
    // }

    // Reset file picker + preview
    document.getElementById('vp-edit-image').value             = '';
    document.getElementById('vp-edit-new-img-wrap').style.display = 'none';
    document.getElementById('vp-edit-new-img').src             = '';

    bootstrap.Modal.getOrCreateInstance(document.getElementById('vpEditModal')).show();
}

// Live preview when a new image is selected in the edit form
function handleEditImagePreview() {
    const file = this.files[0];
    const wrap = document.getElementById('vp-edit-new-img-wrap');
    const prev = document.getElementById('vp-edit-new-img');
    if (!file) { wrap.style.display = 'none'; prev.src = ''; return; }
    const reader = new FileReader();
    reader.onload = e => { prev.src = e.target.result; wrap.style.display = 'block'; };
    reader.readAsDataURL(file);
}

// Submit edit form — uses FormData (multipart) so image file travels with text fields
function submitProductUpdate() {
    const submitBtn  = document.getElementById('vp-edit-submit-btn');
    const btnText    = document.getElementById('vp-edit-btn-text');
    const spinner    = document.getElementById('vp-edit-spinner');
    const imageInput = document.getElementById('vp-edit-image');

    const name  = document.getElementById('vp-edit-name').value.trim();
    const price = parseFloat(document.getElementById('vp-edit-price').value);
    const stock = parseInt(document.getElementById('vp-edit-stock').value);

    if (!name || name.length < 2)   return showToast('Product name must be at least 2 characters.', 'error');
    if (isNaN(price) || price <= 0) return showToast('Please enter a valid price.', 'error');
    if (isNaN(stock) || stock < 0)  return showToast('Please enter a valid stock quantity.', 'error');

    if (imageInput.files[0]) {
        const file    = imageInput.files[0];
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type))  return showToast('Image must be JPG, PNG, or WEBP.', 'error');
        if (file.size > 2 * 1024 * 1024)  return showToast('Image must be smaller than 2MB.', 'error');
    }

    submitBtn.disabled  = true;
    btnText.textContent = 'Saving…';
    spinner.classList.remove('d-none');

    const fd = new FormData();
    fd.append('action',      'update_product');
    fd.append('product_id',  document.getElementById('vp-edit-id').value);
    fd.append('name',        name);
    fd.append('description', document.getElementById('vp-edit-desc').value.trim());
    fd.append('category_id', document.getElementById('vp-edit-category').value);
    fd.append('type_id',     document.getElementById('vp-edit-type').value);
    fd.append('price',       price);
    fd.append('stock',       stock);

    const w = document.getElementById('vp-edit-weight').value;
    if (w !== '') fd.append('weight', w);
    if (imageInput.files[0]) fd.append('image', imageInput.files[0]);

    // No Content-Type header — browser sets multipart boundary automatically
    fetch(PRODUCTS_API, { method: 'POST', body: fd })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
        .then(text => {
            let res;
            try { res = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
            if (res.success) {
                showToast('Product updated successfully.', 'success');
                bootstrap.Modal.getInstance(document.getElementById('vpEditModal')).hide();
                loadProducts();
            } else {
                showToast(res.message || 'Update failed.', 'error');
            }
        })
        .catch(e => showToast(e.message, 'error'))
        .finally(() => {
            submitBtn.disabled  = false;
            btnText.textContent = 'Save Changes';
            spinner.classList.add('d-none');
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 9. DELETE PRODUCT
// ─────────────────────────────────────────────────────────────────────────────
function handleDeleteProduct(productId, productName) {
    if (!confirm(`Permanently delete "${productName}"? This cannot be undone.`)) return;

    const btn = document.querySelector(`#action-cell-${productId} button`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'delete', product_id: productId }),
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
        if (!data.success) throw new Error(data.message);

        [`product-row-${productId}`, `product-card-${productId}`].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.transition = 'opacity 0.3s';
            el.style.opacity    = '0';
            setTimeout(() => el.remove(), 300);
        });

        setTimeout(() => {
            const badge = document.querySelector('.orders-count-badge');
            if (badge) badge.textContent = document.querySelectorAll('[id^="product-row-"]').length;
        }, 350);

        showToast('Product deleted successfully.', 'success');
    })
    .catch(err => {
        console.error('[handleDeleteProduct]', err);
        showToast('Delete failed: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon> Delete'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 10. UPDATE STOCK (inline)
// ─────────────────────────────────────────────────────────────────────────────
function handleUpdateStock(productId, productName) {
    const input    = document.getElementById(`stock-input-${productId}`);
    const newStock = parseInt(input.value);

    if (isNaN(newStock) || newStock < 0) {
        showToast('Please enter a valid stock quantity.', 'error');
        return input.focus();
    }

    const btn = document.querySelector(`#action-cell-${productId} .vp-btn-save`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'update_stock', product_id: productId, stock: newStock }),
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
        if (!data.success) throw new Error(data.message);

        const row       = document.getElementById(`product-row-${productId}`);
        const stockCell = row?.querySelectorAll('td')[4];
        if (stockCell) {
            stockCell.innerHTML = `
                <span class="${stockColorClass(newStock)}">${newStock}</span>
                ${newStock > 0 && newStock <= 5 ? '<br><small class="text-warning">Low stock</small>'  : ''}
                ${newStock <= 0                 ? '<br><small class="text-danger">Out of stock</small>' : ''}`;
        }
        if (row) {
            const product = JSON.parse(row.dataset.product);
            product.stock       = newStock;
            row.dataset.product = JSON.stringify(product);
        }
        showToast(`Stock for "${productName}" updated to ${newStock}.`, 'success');
    })
    .catch(err => {
        console.error('[handleUpdateStock]', err);
        showToast('Stock update failed: ' + err.message, 'error');
    })
    .finally(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 11. SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────
function renderSkeleton() {
    const row = `
        <tr>
            <td><div class="skel skel-line w-20"></div></td>
            <td>
                <div class="d-flex gap-2 align-items-center">
                    <div class="skel" style="width:44px;height:44px;border-radius:8px;flex-shrink:0;"></div>
                    <div style="flex:1">
                        <div class="skel skel-line w-60 mb-1"></div>
                        <div class="skel skel-line w-40"></div>
                    </div>
                </div>
            </td>
            <td><div class="skel skel-pill"></div></td>
            <td><div class="skel skel-line w-40"></div></td>
            <td><div class="skel skel-line w-30"></div></td>
            <td><div class="skel skel-pill"></div></td>
            <td><div class="skel skel-line w-50"></div></td>
            <td><div class="skel skel-line w-40"></div></td>
        </tr>`;

    return `
        <div class="orders-header"><div class="skel skel-line w-20"></div></div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th><th>Product</th><th>Category / Type</th><th>Price</th>
                        <th>Stock</th><th>Status</th><th>Added</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>${row.repeat(6)}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 12. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

/** Escape HTML special characters */
function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#039;');
}

/** Serialize product object safely for data-product attribute */
function serialize(p) {
    return JSON.stringify(p).replace(/'/g, '&#39;');
}

/** Format a number as NPR currency */
function formatPrice(value) {
    return 'NPR ' + parseFloat(value).toLocaleString('en-NP', { minimumFractionDigits: 2 });
}

/** Format ISO date string to "DD Mon YYYY" */
function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

/** Bootstrap text class based on stock level */
function stockColorClass(stock) {
    if (stock <= 0) return 'text-danger fw-bold';
    if (stock <= 5) return 'text-warning fw-bold';
    return 'text-success fw-semibold';
}

/** Status label + badge class for a product status string */
function getStatusConfig(status) {
    const map = {
        pending:  { label: 'Pending',  badge: 'badge-pending'   },
        approved: { label: 'Approved', badge: 'badge-delivered' },
        rejected: { label: 'Rejected', badge: 'badge-cancelled' },
    };
    return map[status] ?? { label: status ?? 'Unknown', badge: 'badge-mixed' };
}

/** Product image thumbnail or ion-icon placeholder */
function thumbHtml(p, context) {
    if (p.image) {
        const cls = context === 'card' ? 'vp-card-img' : 'product-thumb';
        return `<img src="../../uploads/products/${escHtml(p.image)}"
                     alt="${escHtml(p.name)}" class="${cls}"
                     onerror="this.style.display='none'">`;
    }
    const cls  = context === 'card' ? 'vp-card-img-placeholder' : 'product-thumb-placeholder';
    const size = context === 'card' ? '1.5rem' : '1rem';
    return `<div class="${cls}"><ion-icon name="image-outline" style="font-size:${size};color:#ccc;"></ion-icon></div>`;
}

/** Toast — shares the one in order-control.js; defined here as fallback */
if (typeof showToast === 'undefined') {
    window.showToast = function (message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className   = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3500);
    };
}