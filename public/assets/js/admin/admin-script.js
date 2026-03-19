function setupDropdown(buttonId, menuId) {
    const dropdownBtn = document.getElementById(buttonId);
    const items = document.querySelectorAll(`#${menuId} .dropdown-item`);

    items.forEach(item => {
        item.addEventListener("click", function () {
            dropdownBtn.textContent = this.textContent;
        });
    });
}

setupDropdown("sellerDropdown", "sellerDropdownMenu");
setupDropdown("productDropdown", "productDropdownMenu");

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../backend/auth/admin-analytics.php")
        .then(res => {
            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                window.location.href = "unauthorized.html";
                return null;
            }
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response. Check PHP for errors.");
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById("usersCount").textContent    = data.total_users     ?? 0;
            document.getElementById("sellersCount").textContent  = data.total_sellers   ?? 0;
            document.getElementById("productsCount").textContent = data.total_products  ?? 0;
            document.getElementById("pendingRequests").textContent = data.pending_requests ?? 0;
        })
        .catch(err => {
            console.error("Failed to load analytics:", err);
        });

    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            if (!query) {
                document.querySelectorAll('#s-container table tbody tr').forEach(r => r.style.display = '');
                return;
            }

            document.querySelectorAll('#s-container table tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    document.getElementById('ftch-seller-list')?.addEventListener('click', () => {
        if (typeof loadSellers === 'function') loadSellers();
    });

    document.getElementById('ftch-product-list')?.addEventListener('click', () => {
        if (typeof loadAllProducts === 'function') loadAllProducts();
    });

    document.getElementById('ftch-seller-apps')?.addEventListener('click', () => {
        if (typeof loadPendingSellers === 'function') loadPendingSellers();
    });

    document.getElementById('ftch-product-apps')?.addEventListener('click', () => {
        if (typeof loadProducts === 'function') loadProducts();
    });

    document.getElementById('ftch-orders')?.addEventListener('click', () => {
        if (typeof loadOrderManagement === 'function') loadOrderManagement();
    });
});

function showAdminDetailModal(title, htmlContent) {
    const modalTitle = document.getElementById('adminDetailModalTitle');
    const modalBody  = document.getElementById('adminDetailModalBody');
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody)  modalBody.innerHTML = htmlContent;
    const modal = new bootstrap.Modal(document.getElementById('adminDetailModal'));
    modal.show();
}

window.showAdminDetailModal = showAdminDetailModal;