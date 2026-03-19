document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('ftch-seller-apps'); 
    loadBtn.addEventListener('click', loadPendingSellers);
});

// ─── Fetch & Render ───────────────────────────────────────────

async function loadPendingSellers() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading seller applications...</p>`;
    try {
        const response = await fetch('../../backend/users/admin/seller-applications.php', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch applications');
        }

        renderApplications(result.data);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load seller applications: ${err.message}</div>`;
    }
}

function renderApplications(applications) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!applications || applications.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No pending applications found.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0"><i class="fas fa-store me-2"></i>Pending Seller Applications</h5>
                <span class="badge bg-warning text-dark">${applications.length} Pending</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle mb-0" id="sellers-table">
                        <thead class="table-dark">
                            <tr>
                                <th class="always-visible">#</th>
                                <th class="always-visible">Owner Name</th>
                                <th>Email</th>
                                <th>Shop Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Status</th>
                                <th>Applied Date</th>
                                <th class="actions-col text-center always-visible">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="sellers-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const tbody = document.getElementById('sellers-tbody');

    applications.forEach((seller, index) => {
        const tr = document.createElement('tr');
        tr.id = `seller-row-${seller.seller_id}`;

        tr.innerHTML = `
            <td class="always-visible">${index + 1}</td>
            <td class="always-visible"><strong>${seller.user_name}</strong></td>
            <td>${seller.user_email}</td>
            <td>${seller.shop_name}</td>
            <td>${seller.address ?? '—'}</td>
            <td>${seller.city ?? '—'}</td>
            <td>
                <span class="badge bg-warning text-dark">${seller.status}</span>
            </td>
            <td>${new Date(seller.created_at).toLocaleDateString()}</td>
            <td class="actions-col text-center always-visible">
                <button class="btn btn-success btn-sm me-1" onclick="updateStatus(${seller.seller_id}, 'approved', this)">
                    <i class="fas fa-check me-1"></i>Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="handleReject(${seller.seller_id}, '${seller.user_name}', this)">
                    <i class="fas fa-times me-1"></i>Reject
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ─── Update Status ────────────────────────────────────────────

function handleReject(sellerId, sellerName, btn) {
    if (confirm(`Are you sure you want to reject ${sellerName}?`)) {
        updateStatus(sellerId, 'rejected', btn);
    }
}

async function updateStatus(sellerId, status, btn) {
    const row = document.getElementById(`seller-row-${sellerId}`);
    const buttons = row.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    try {
        const response = await fetch('../../backend/users/admin/update-status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seller_id: sellerId, status })
        });

        const result = await response.json();

        if (result.success) {
            // Update badge in row instead of removing it
            const statusBadge = row.querySelector('.badge');
            if (status === 'approved') {
                statusBadge.className = 'badge bg-success';
                statusBadge.textContent = 'approved';
            } else {
                statusBadge.className = 'badge bg-danger';
                statusBadge.textContent = 'rejected';
            }

            // Remove action buttons after decision
            row.querySelector('td:last-child').innerHTML = `
                <span class="text-muted fst-italic">Updated</span>
            `;

            // Update pending count badge in header
            const remaining = document.querySelectorAll('#sellers-tbody button').length;
            const headerBadge = document.querySelector('.card-header .badge');
            if (headerBadge) {
                const pendingRows = [...document.querySelectorAll('#sellers-tbody tr')]
                    .filter(r => r.querySelector('.badge.bg-warning'));
                headerBadge.textContent = `${pendingRows.length} Pending`;
            }

        } else {
            alert(result.message || `Failed to ${status} seller.`);
            buttons.forEach(b => b.disabled = false);
        }

    } catch (err) {
        console.error(err);
        alert('Error updating seller status. Check console for details.');
        buttons.forEach(b => b.disabled = false);
    }
}