<!-- =============================================================================
     partials/modal-product-edit.php
     Product edit modal — included in seller-panel.php via:
       <?php include 'partials/modal-product-edit.php'; ?>
     Fields are pre-filled at runtime by showEditProductModal() in view-product.js.
     Submission is handled by submitProductUpdate() — sends multipart/form-data
     so the optional image file travels alongside the text fields.
     ============================================================================= -->

<div class="modal fade" id="vpEditModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header bg-light">
                <h5 class="modal-title">
                    <ion-icon name="create-outline" style="font-size: 1.1rem; margin-right: 6px;"></ion-icon>
                    Edit Product
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
                <!-- novalidate: JS handles all validation before submit -->
                <form id="vp-edit-form" novalidate>
                    <input type="hidden" id="vp-edit-id">

                    <!-- Product Name -->
                    <div class="mb-3">
                        <label class="form-label">Product Name <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="vp-edit-name"
                               minlength="2" maxlength="255"
                               placeholder="e.g. Premium Dog Harness" required>
                    </div>

                    <!-- Description -->
                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" id="vp-edit-desc"
                                  rows="3" maxlength="1000"
                                  placeholder="Briefly describe the product..."></textarea>
                    </div>

                    <!-- Category + Product Type -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Category <span class="text-danger">*</span></label>
                            <select class="form-select" id="vp-edit-category" required>
                                <option value="">Select Category</option>
                                <option value="1">Dog</option>
                                <option value="2">Cat</option>
                                <option value="3">Fish</option>
                                <option value="4">Bird</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Product Type <span class="text-danger">*</span></label>
                            <select class="form-select" id="vp-edit-type" required>
                                <option value="">Select Type</option>
                                <option value="1">Food</option>
                                <option value="2">Toys</option>
                                <option value="3">Grooming</option>
                                <option value="4">Accessories</option>
                                <option value="5">Healthcare</option>
                            </select>
                        </div>
                    </div>

                    <!-- Price + Weight -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Price (Rs) <span class="text-danger">*</span></label>
                            <input type="number" step="0.01" min="0.01"
                                   class="form-control" id="vp-edit-price"
                                   placeholder="0.00" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">
                                Weight (kg)
                                <small class="text-muted fw-normal">(optional)</small>
                            </label>
                            <input type="number" step="0.01" min="0"
                                   class="form-control" id="vp-edit-weight"
                                   placeholder="0.00">
                        </div>
                    </div>

                    <!-- Stock -->
                    <div class="mb-3">
                        <label class="form-label">Stock Quantity <span class="text-danger">*</span></label>
                        <input type="number" min="0"
                               class="form-control" id="vp-edit-stock"
                               placeholder="0" required>
                    </div>

                    <!-- Image Replace -->
                    <div class="mb-3">
                        <label class="form-label">
                            Replace Product Image
                            <small class="text-muted fw-normal">(optional — leave empty to keep current)</small>
                        </label>

                        <!-- Current image thumbnail (shown when product already has an image) -->
                        <div id="vp-edit-current-img-wrap" class="mb-2" style="display: none;">
                            <p class="text-muted small mb-1">Current image:</p>
                            <img id="vp-edit-current-img"
                                 src="" alt="Current product image"
                                 style="height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd;">
                        </div>

                        <input type="file" class="form-control" id="vp-edit-image"
                               accept="image/jpeg, image/png, image/webp">
                        <small class="text-muted">JPG, PNG or WEBP — max 2MB. Old file is deleted from server.</small>

                        <!-- Live preview of the newly selected image -->
                        <div id="vp-edit-new-img-wrap" class="mt-2" style="display: none;">
                            <p class="text-muted small mb-1">New image preview:</p>
                            <img id="vp-edit-new-img"
                                 src="" alt="New image preview"
                                 style="height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #2c6e49;">
                        </div>
                    </div>

                    <!-- Footer actions -->
                    <div class="d-flex justify-content-end gap-2 mt-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success"
                                id="vp-edit-submit-btn"
                                onclick="submitProductUpdate()">
                            <span id="vp-edit-btn-text">Save Changes</span>
                            <span id="vp-edit-spinner"
                                  class="spinner-border spinner-border-sm ms-1 d-none"
                                  role="status"></span>
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>