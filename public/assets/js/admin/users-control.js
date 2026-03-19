document.addEventListener('DOMContentLoaded', () => {
    const userControlBtn = document.getElementById('ftch-users');
    if (userControlBtn) {
        userControlBtn.addEventListener('click', loadUsers);
    }

    // Load user control by default when page reloads
    loadUsers();

    // ─── Inject Confirmation Modal ────────────────────────
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 12px; overflow: hidden;">
                    <div class="modal-header" style="background-color: #1a1a2e; color: #fff;">
                        <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2 text-warning"></i>Confirm Deletion</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" style="background-color: #f9f9f9;">
                        <p class="mb-3">You are about to permanently delete <strong id="delete-user-name"></strong>. This will also remove all their related data including products, shop, and seller records.</p>
                        <p class="text-danger fw-bold mb-3"><i class="fas fa-warning me-1"></i>This action cannot be undone.</p>
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Enter your admin password to confirm:</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="admin-password-input" placeholder="Enter your password..." />
                                <button class="btn btn-outline-secondary" type="button" id="toggle-password-btn">
                                    <i class="fas fa-eye" id="toggle-password-icon"></i>
                                </button>
                            </div>
                            <div id="password-error" class="text-danger mt-1 small" style="display:none;">
                                <i class="fas fa-times-circle me-1"></i>Incorrect password. Please try again.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="background-color: #f0f0f0;">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirm-delete-btn" disabled>
                            <i class="fas fa-trash me-1"></i>Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Enable delete button only when password is typed
    document.getElementById('admin-password-input').addEventListener('input', function () {
        const btn = document.getElementById('confirm-delete-btn');
        btn.disabled = this.value.trim() === '';
    });

    // Toggle password visibility
    document.getElementById('toggle-password-btn').addEventListener('click', function () {
        const input = document.getElementById('admin-password-input');
        const icon  = document.getElementById('toggle-password-icon');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});
// ─── Helper: show details modal for records ──────────────────────
function getUserDetailHtml(user) {
    return `
      <div class="mb-2"><strong>Name:</strong> ${user.fname}</div>
      <div class="mb-2"><strong>Email:</strong> ${user.email}</div>
      <div class="mb-2"><strong>Role:</strong> ${user.role}</div>
      <div class="mb-2"><strong>User Status:</strong> ${user.status}</div>
      ${user.seller_id ? `<div class="mb-2"><strong>Seller ID:</strong> ${user.seller_id}</div>` : ''}
      ${user.seller_status ? `<div class="mb-2"><strong>Seller Status:</strong> ${user.seller_status}</div>` : ''}
      ${user.store_name ? `<div class="mb-2"><strong>Shop:</strong> ${user.store_name}</div>` : ''}
      ${user.shop_city ? `<div class="mb-2"><strong>Shop City:</strong> ${user.shop_city}</div>` : ''}
      <div class="mb-2"><strong>Joined:</strong> ${new Date(user.created_at).toLocaleDateString()}</div>
    `;
}

function loadSellers() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading sellers...</p>`;

    fetch('../../backend/users/admin/users-control.php', { cache: 'no-store' })
        .then(res => res.json())
        .then(result => {
            if (!result.success) throw new Error(result.message || 'Failed to fetch sellers');
            const sellers = result.data.filter(u => u.role === 'seller');
            renderSellers(sellers);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = `<div class="alert alert-danger">Failed to load sellers: ${err.message}</div>`;
        });
}

function renderSellers(sellers) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!sellers || sellers.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No sellers found.</div>`;
        return;
    }

    container.innerHTML = `
      <div class="card shadow-sm" style="border: none; border-radius: 12px; overflow: hidden;">
        <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #2c6e49;">
          <h5 class="mb-0 text-white"><i class="fas fa-store me-2"></i>All Sellers</h5>
          <span class="badge bg-warning text-dark">${sellers.length} Sellers</span>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle mb-0" id="seller-list-table">
              <thead style="background-color: #1a1a2e; color: #fff;"><tr>
                <th class="always-visible">#</th><th class="always-visible">Name</th><th>Email</th><th>Status</th><th>Shop</th><th>Joined</th><th class="actions-col text-center always-visible">View</th>
              </tr></thead>
              <tbody id="seller-list-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const tbody = document.getElementById('seller-list-tbody');
    sellers.forEach((seller, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="always-visible">${index + 1}</td>
            <td class="always-visible">${seller.fname}</td>
            <td>${seller.email}</td>
            <td>${seller.seller_status ?? seller.status}</td>
            <td>${seller.store_name ?? '—'}</td>
            <td>${new Date(seller.created_at).toLocaleDateString()}</td>
            <td class="actions-col text-center always-visible"><button class="btn btn-sm btn-outline-primary seller-detail-btn" data-id="${seller.user_id}">View Details</button></td>
        `;
        tbody.appendChild(tr);

        const btn = tr.querySelector('.seller-detail-btn');
        btn?.addEventListener('click', () => {
            showAdminDetailModal('Seller Details', getUserDetailHtml(seller));
        });
    });
}

async function loadUsers() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading users...</p>`;

    try {
        const response = await fetch('../../backend/users/admin/users-control.php', {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch users');

        renderUsers(result.data);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load users: ${err.message}</div>`;
    }
}

function renderUsers(users) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!users || users.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No users found.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm" style="border: none; border-radius: 12px; overflow: hidden;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #2c6e49;">
                <h5 class="mb-0 text-white"><i class="fas fa-users me-2"></i>System Users</h5>
                <span class="badge" style="background-color: #ffc107; color: #333;" id="user-count-badge">${users.length} Users</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle mb-0" id="users-table">
                        <thead style="background-color: #1a1a2e; color: #fff;">
                            <tr>
                                <th class="always-visible">#</th>
                                <th class="always-visible">Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th class="actions-col text-center always-visible">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const tbody = document.getElementById('users-tbody');

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.id = `user-row-${user.user_id}`;
        tr.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f0f7f3';

        const statusBadge   = getUserStatusBadge(user.status);
        const actionButtons = getUserActionButtons(user.user_id, user.fname, user.status);

        tr.innerHTML = `
            <td class="always-visible">${index + 1}</td>
            <td class="always-visible"><strong>${user.fname}</strong></td>
            <td>${user.email}</td>
            <td><span class="badge" style="background-color: #1a1a2e; color: #fff;">${user.role}</span></td>
            <td id="status-badge-${user.user_id}">${statusBadge}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td class="actions-col text-center always-visible" id="actions-${user.user_id}">${actionButtons}</td>
        `;

        tbody.appendChild(tr);
    });
}

// ─── RENAMED: getUserStatusBadge (was getStatusBadge — conflicted with products-control.js) ──
function getUserStatusBadge(status) {
    if (status === 'active') {
        return `<span class="badge" style="background-color: #4c956c; color: #fff;">Active</span>`;
    } else if (status === 'suspended') {
        return `<span class="badge" style="background-color: #c0392b; color: #fff;">Suspended</span>`;
    }
    return `<span class="badge" style="background-color: #aaa; color: #fff;">${status}</span>`;
}

// ─── RENAMED: getUserActionButtons (was getActionButtons — conflicted with products-control.js) ──
function getUserActionButtons(userId, userName, status) {
    const suspendBtn = status !== 'suspended'
        ? `<button class="btn btn-sm btn-outline-warning me-1"
                onclick="handleUserAction(${userId}, '${userName}', 'suspend')">
                <i class="fas fa-ban me-1"></i>Suspend
           </button>`
        : '';

    const activateBtn = status === 'suspended'
        ? `<button class="btn btn-sm btn-outline-success me-1"
                onclick="handleUserAction(${userId}, '${userName}', 'activate')">
                <i class="fas fa-check me-1"></i>Activate
           </button>`
        : '';

    const deleteBtn = `<button class="btn btn-sm btn-danger"
            onclick="confirmDeleteUser(${userId}, '${userName}')"
            title="Delete user">
            <i class="fas fa-trash"></i>
       </button>`;

    return suspendBtn + activateBtn + deleteBtn;
}

// ─── Show Delete Confirmation Modal ──────────────────────────
function confirmDeleteUser(userId, userName) {
    document.getElementById('delete-user-name').textContent   = userName;
    document.getElementById('admin-password-input').value     = '';
    document.getElementById('admin-password-input').type      = 'password';
    document.getElementById('toggle-password-icon').className = 'fas fa-eye';
    document.getElementById('confirm-delete-btn').disabled    = true;
    document.getElementById('password-error').style.display   = 'none';

    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.onclick = () => executeDelete(userId, userName);

    new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
}

// ─── Execute Delete with Password Verification ────────────────
async function executeDelete(userId, userName) {
    const password   = document.getElementById('admin-password-input').value.trim();
    const errorDiv   = document.getElementById('password-error');
    const confirmBtn = document.getElementById('confirm-delete-btn');

    if (!password) return;

    confirmBtn.disabled  = true;
    confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Deleting...`;
    errorDiv.style.display = 'none';

    try {
        const response = await fetch('../../backend/users/admin/users-control.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ user_id: userId, action: 'delete', password })
        });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();

        if (result.success) {
            bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
            document.getElementById(`user-row-${userId}`)?.remove();
            const remaining = document.querySelectorAll('#users-tbody tr').length;
            const badge = document.getElementById('user-count-badge');
            if (badge) badge.textContent = `${remaining} Users`;

        } else if (result.reason === 'wrong_password') {
            errorDiv.style.display   = 'block';
            confirmBtn.disabled      = false;
            confirmBtn.innerHTML     = `<i class="fas fa-trash me-1"></i>Delete User`;

        } else {
            alert(result.message || 'Failed to delete user.');
            confirmBtn.disabled  = false;
            confirmBtn.innerHTML = `<i class="fas fa-trash me-1"></i>Delete User`;
        }

    } catch (err) {
        console.error('Delete error:', err);
        alert('Error: ' + err.message);
        confirmBtn.disabled  = false;
        confirmBtn.innerHTML = `<i class="fas fa-trash me-1"></i>Delete User`;
    }
}

// ─── Handle Suspend / Activate ────────────────────────────────
async function handleUserAction(userId, userName, action) {
    const confirmMessages = {
        suspend:  `Suspend ${userName}? They will lose access temporarily.`,
        activate: `Activate ${userName}? They will regain full access.`
    };

    if (!confirm(confirmMessages[action])) return;

    const row     = document.getElementById(`user-row-${userId}`);
    const buttons = row.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    try {
        const response = await fetch('../../backend/users/admin/users-control.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ user_id: userId, action })
        });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();

        if (result.success) {
            const newStatus = action === 'suspend' ? 'suspended' : 'active';
            document.getElementById(`status-badge-${userId}`).innerHTML = getUserStatusBadge(newStatus);
            document.getElementById(`actions-${userId}`).innerHTML      = getUserActionButtons(userId, userName, newStatus);

        } else {
            alert(result.message || `Failed to ${action} user.`);
            buttons.forEach(b => b.disabled = false);
        }

    } catch (err) {
        console.error('Action error:', err);
        alert('Error: ' + err.message);
        buttons.forEach(b => b.disabled = false);
    }
}