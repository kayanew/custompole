document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartAPI = '/mvp/backend/products/cartActions.php';

    // Function to update cart badge count
    function updateCartCount(count) {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            cartBadge.textContent = count;  
        }
    }

    function fetchCart() {
        fetch(cartAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=fetch'
        })
            .then(res => res.text())
            .then(text => {
                console.log("RAW:", text);
                return JSON.parse(text);
            })
            .then(data => {
                cartItems.innerHTML = '';

                if (!data.cart || Object.keys(data.cart).length === 0) {
                    cartItems.innerHTML = '<tr><td style="padding: 80px 0 0 0; font-size: 20px;" colspan="5" >Your cart is empty</td></tr>';
                    cartTotal.textContent = '0';
                    updateCartCount(0);
                    return;
                }

                let totalItems = 0; 

                for (const id in data.cart) {
                    const item = data.cart[id];
                    totalItems = Object.keys(data.cart).length;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${item.image}" width="50"></td>
                        <td>${item.name}</td>
                        <td>
                            <input type="number" 
                                   class="qty-input" 
                                   data-id="${id}" 
                                   value="${item.quantity}" min="1">
                        </td>
                        <td>Rs ${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                            <button type="button" class="delete-btn" data-id="${id}">X</button>
                        </td>
                    `;

                    cartItems.appendChild(row);
                }
                cartTotal.textContent = data.total.toFixed(2);
                updateCartCount(totalItems); // FIXED: Uncommented
            })
            .catch(err => {
                console.error('Error fetching cart:', err);
            });
    }

    // Initial cart fetch
    fetchCart();

    // Update cart quantities
    const updateBtn = document.getElementById('btn-update');
    if (updateBtn) {
        updateBtn.addEventListener('click', function () {
            const quantities = {};

            document.querySelectorAll('.qty-input').forEach(input => {
                quantities[input.dataset.id] = input.value;
            });

            const formData = new URLSearchParams();
            formData.append('action', 'update');

            for (const id in quantities) {
                formData.append(`quantities[${id}]`, quantities[id]);
            }

            fetch(cartAPI, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    fetchCart();
                    showToast(data.message, 'success');
                })
                .catch(err => {
                    console.error('Error updating cart:', err);
                    showToast('Failed to update cart', 'error');
                });
        });
    }

    // Delete item from cart
    cartItems.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            const formData = new URLSearchParams();
            formData.append('action', 'delete');
            formData.append('id', id);

            fetch(cartAPI, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(() => {
                    fetchCart();
                    showToast('Item removed from cart', 'success');
                })
                .catch(err => {
                    console.error('Error deleting item:', err);
                    showToast('Failed to remove item', 'error');
                });
        }
    });

    // Add to cart from product details page
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            if (!productId) {
                showToast('Product Id not found', 'error');
                return;
            }

            // Get quantity from input
            const quantityInput = document.getElementById('productQuantity');
            const quantity = quantityInput ? quantityInput.value : 1;

            // Prepare form data
            const formData = new URLSearchParams();
            formData.append('action', 'add');
            formData.append('id', productId);
            formData.append('quantity', quantity);

            // Send to server
            fetch(cartAPI, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Added to cart:', data);
                    if(data.task === "login"){
                        openLoginModal();
                        showToast(data.message, 'error');
                    }
                    if (data.success) {
                        showToast(data.message, 'success');
                        // Refresh cart if modal is open
                        fetchCart();
                    }else{
                        showToast(data.message, 'error');
                    }
                })
                .catch(err => {
                    console.error('Error adding to cart:', err);
                    showToast('Something went wrong', 'error');
                });
        });
    }
    const checkOutBtn = document.getElementById('btn-checkout');

checkOutBtn.addEventListener('click', () => {
    window.location.href = '/mvp/public/pages/checkout-page.php';
});

    // Make fetchCart available globally if needed
    window.fetchCart = fetchCart;
});

// function openLoginModal(){
//     const userLogin = document.querySelectorAll(".user-login");
//     const overlays = document.querySelectorAll(".modal-overlay");
//     const loginModal = document.getElementById('login-modal');
//     loginModal.style.display = 'block';
//     overlays.forEach(overlay=>{
//       overlay.classList.add('show');
//     })
// }