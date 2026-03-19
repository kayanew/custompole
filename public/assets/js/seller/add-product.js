document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productUploadForm');
    if (form) {
        form.addEventListener('submit', handleProductUpload);
    }
});

// ─── Submit Handler ───────────────────────────────────────────
async function handleProductUpload(e) {
    e.preventDefault();

    if (!validateProductForm()) return;

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    const formData = new FormData(e.target);
    formData.append//   Override for testing

    try {
        const response = await fetch('../../backend/users/seller/add-product.php', {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response. Check PHP for errors.');
        }

        const result = await response.json();

        if (result.status === 'success') {
            showToast(result.message, 'success');
            e.target.reset();

            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(
                    document.getElementById('exampleModalCenteredScrollable')
                );
                if (modal) modal.hide();
            }, 1500);

        } else {
            const messages = Array.isArray(result.message)
                ? result.message.join('\n')
                : result.message;
            showToast(messages, 'error');
        }

    } catch (err) {
        console.error(err);
        showToast('Something went wrong. Check console for details.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Product';
    }
}

// ─── Validation ───────────────────────────────────────────────
function validateProductForm() {
    const name        = document.getElementById('product_name').value.trim();
    const description = document.getElementById('product_description').value.trim();
    const category    = document.getElementById('product_category').value;
    const price       = parseFloat(document.getElementById('product_price').value);
    const stock       = parseInt(document.getElementById('product_stock').value);
    const image       = document.getElementById('product_image').files[0];

    if (!name)                        return showToast('Product name is required.', 'error'), false;
    if (!description)                 return showToast('Description is required.', 'error'), false;
    if (!category)                    return showToast('Please select a category.', 'error'), false;
    if (isNaN(price) || price <= 0)   return showToast('Enter a valid price.', 'error'), false;
    if (isNaN(stock) || stock < 0)    return showToast('Stock cannot be negative.', 'error'), false;
    if (!image)                       return showToast('Please upload a product image.', 'error'), false;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) return showToast('Only JPG, PNG, WEBP allowed.', 'error'), false;
    if (image.size > 2 * 1024 * 1024)       return showToast('Image must be under 2MB.', 'error'), false;

    return true;
}

// ─── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), duration);
}
