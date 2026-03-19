<!-- =============================================================================
     partials/modal-product-detail.php
     Product detail (view) modal — included in seller-panel.php via:
       <?php include 'partials/modal-product-detail.php'; ?>
     Data is populated at runtime by showProductDetail() in view-product.js.
     ============================================================================= -->

<div class="modal fade" id="vpDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content" style="border-radius: 12px; overflow: hidden;">

            <div class="modal-header" style="background: #1a1a2e; color: #fff;">
                <h5 class="modal-title">
                    <ion-icon name="cube-outline" style="font-size: 1.2rem; margin-right: 6px;"></ion-icon>
                    <span id="vp-modal-name"></span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body" style="background: #f9f9f9;">
                <div class="row g-4">

                    <!-- Image column -->
                    <!-- <div class="col-md-5 text-center">
                        <img id="vp-modal-image"
                             src=""
                             alt="Product image"
                             style="max-width: 100%; max-height: 220px; border-radius: 10px; object-fit: cover; display: none;">
                        <div id="vp-modal-no-image" class="text-muted small mt-2" style="display: none;">No image</div>
                    </div> -->

                    <!-- Details column -->
                    <div class="col-md-7">
                        <table class="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td class="text-muted fw-semibold" style="width: 40%">Category</td>
                                    <td id="vp-modal-category"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Type</td>
                                    <td id="vp-modal-type"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Price</td>
                                    <td id="vp-modal-price" class="text-success fw-bold"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Stock</td>
                                    <td id="vp-modal-stock"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Weight</td>
                                    <td id="vp-modal-weight"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Status</td>
                                    <td id="vp-modal-status"></td>
                                </tr>
                                <tr>
                                    <td class="text-muted fw-semibold">Added</td>
                                    <td id="vp-modal-date"></td>
                                </tr>
                            </tbody>
                        </table>

                        <hr>
                        <p class="text-muted fw-semibold mb-1">Description</p>
                        <p id="vp-modal-description" style="white-space: pre-wrap; font-size: 0.875rem;"></p>
                    </div>

                </div>
            </div>

            <div class="modal-footer" style="background: #f0f0f0;">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>