<?php
session_start();

if (!isset($_SESSION['seller_id'])) {
    header('Location: ../index.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seller Dashboard</title>

  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/css/navbar.css">
  <link rel="stylesheet" href="../assets/css/mediaqueries.css">
  <link rel="stylesheet" href="../assets/css/panel.css">
  <link rel="icon" href="../assets/favicon/favicon.png">

  <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

  <style>
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.88rem;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 9999;
      min-width: 250px;
    }
    .toast.show { opacity: 1; }
    .toast.success { background-color: #2c6e49; color: #fff; }
    .toast.error   { background-color: #c0392b; color: #fff; }
    #product_sku {
      background-color: #f8f9fa;
      color: #6c757d;
      font-family: monospace;
      font-size: 0.85rem;
      cursor: not-allowed;
    }
  </style>
</head>

<body style="overflow: hidden">

<header>
  <nav class="header-main">
    <div class="logo-container">
      <a href="index.html"><strong>Seller Panel</strong></a>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Account
      </button>
      <ul class="dropdown-menu">
        <li><button class="dropdown-item">Profile</button></li>
        <li><button class="dropdown-item">Update Profile</button></li>
        <li><button class="dropdown-item log-out-btn">Logout</button></li>
      </ul>
    </div>
  </nav>
</header>

<main class="spacing">

  <div class="container-fluid mb-4">
    <div class="row">

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="text-xs fw-bold text-primary text-uppercase mb-1">Total Products</div>
                <div class="h5 mb-0 fw-bold text-dark">24</div>
              </div>
              <div class="col-auto">
                <ion-icon class="fa-2x text-muted" name="albums-outline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-success shadow h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="text-xs fw-bold text-success text-uppercase mb-1">Orders</div>
                <div class="h5 mb-0 fw-bold text-dark">112</div>
              </div>
              <div class="col-auto">
                <ion-icon class="fa-2x text-muted" name="cart-outline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="text-xs fw-bold text-info text-uppercase mb-1">Earnings</div>
                <div class="h5 mb-0 fw-bold text-dark">$8,450</div>
              </div>
              <div class="col-auto">
                <ion-icon class="fa-2x text-muted" name="wallet-outline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3 col-md-6 mb-4">
        <div class="card border-left-warning shadow h-100 py-2">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col">
                <div class="text-xs fw-bold text-warning text-uppercase mb-1">Pending Orders</div>
                <div class="h5 mb-0 fw-bold text-dark">7</div>
              </div>
              <div class="col-auto">
                <ion-icon class="fa-2x text-muted" name="hourglass-outline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="action-bar d-flex align-items-center gap-2 flex-wrap mb-3">

    <button class="btn btn-outline-primary">Analytics</button>

    <div class="dropdown">
      <button class="btn btn-outline-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Manage Products
      </button>
      <ul class="dropdown-menu">
        <li><button class="dropdown-item">View Products</button></li>
        <li><button class="dropdown-item">Update Product</button></li>
        <li><button class="dropdown-item">Remove Product</button></li>
      </ul>
    </div>

    <div class="dropdown">
      <button class="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Orders
      </button>
      <ul class="dropdown-menu">
        <li><button class="dropdown-item">All Orders</button></li>
        <li><button class="dropdown-item">Pending Orders</button></li>
        <li><button class="dropdown-item">Completed Orders</button></li>
      </ul>
    </div>

    <button class="btn btn-warning ms-auto" data-bs-toggle="modal" data-bs-target="#addProductModal">Add Product</button>

  </div>

  <div class="content-box">
    <h3>Data</h3>
  </div>

  <div class="modal fade" id="addProductModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Add New Product</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body p-4">
          <form id="productUploadForm" enctype="multipart/form-data" novalidate>
            <input type="hidden" name="seller_id" value="<?= htmlspecialchars($_SESSION['seller_id'] ?? '') ?>">

            <div class="mb-3">
              <label class="form-label">SKU <span class="badge bg-secondary ms-1" style="font-size:0.7rem;">Auto-generated</span></label>
              <input type="text" class="form-control" id="product_sku" name="sku" readonly tabindex="-1">
            </div>

            <div class="mb-3">
              <label class="form-label">Product Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" name="name" id="product_name" minlength="2" maxlength="255" placeholder="e.g. Premium Dog Harness" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" name="description" id="product_description" rows="3" maxlength="1000" placeholder="Briefly describe the product..."></textarea>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Category <span class="text-danger">*</span></label>
                <select class="form-select" name="category_id" id="product_category" required>
                  <option value="">-- Select Category --</option>
                  <option value="1">Dog</option>
                  <option value="2">Cat</option>
                  <option value="3">Fish</option>
                  <option value="4">Bird</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Product Type <span class="text-danger">*</span></label>
                <select class="form-select" name="type_id" id="product_type" required>
                  <option value="">-- Select Type --</option>
                  <option value="1">Food</option>
                  <option value="2">Toys</option>
                  <option value="3">Grooming</option>
                  <option value="4">Accessories</option>
                  <option value="5">Healthcare</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Price (₱) <span class="text-danger">*</span></label>
                <input type="number" step="0.01" min="0.01" class="form-control" name="price" id="product_price" placeholder="0.00" required>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Weight (kg) <small class="text-muted">(optional)</small></label>
                <input type="number" step="0.01" min="0" class="form-control" name="weight" id="product_weight" placeholder="0.00">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Stock Quantity <span class="text-danger">*</span></label>
              <input type="number" min="0" class="form-control" name="stock" id="product_stock" placeholder="0" required>
            </div>

            <div class="mb-3">
              <label class="form-label">Product Image <span class="text-danger">*</span></label>
              <input type="file" class="form-control" name="image" id="product_image" accept="image/jpeg, image/png, image/webp" required>
              <small class="text-muted">JPG, PNG or WEBP — max 2MB</small>
            </div>

            <div class="modal-footer px-0 pb-0">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-success">
                <span id="submitBtnText">Save Product</span>
                <span id="submitBtnSpinner" class="spinner-border spinner-border-sm ms-1 d-none" role="status"></span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>

  <div id="toast" class="toast"></div>

</main>

<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/signout.js"></script>
<script src="../assets/js/bootstrap-alert.js"></script>
<script src="../assets/js/seller/add-product.js"></script>
<script src="../assets/js/seller/seller-script.js"></script>

<script>
  const addProductModal = document.getElementById('addProductModal');

  addProductModal.addEventListener('show.bs.modal', () => {
    const skuInput  = document.getElementById('product_sku');
    const catSelect = document.getElementById('product_category');

    const generateSKU = () => {
      const catText = catSelect.options[catSelect.selectedIndex]?.text || 'GEN';
      const prefix  = catText.toUpperCase().slice(0, 3);
      const ts      = Date.now().toString(36).toUpperCase();
      const rand    = Math.random().toString(36).slice(2, 6).toUpperCase();
      return `SKU-${prefix}-${ts}-${rand}`;
    };

    skuInput.value = generateSKU();

    catSelect.addEventListener('change', () => {
      skuInput.value = generateSKU();
    }, { once: false });
  });

  addProductModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('productUploadForm').reset();
    document.getElementById('product_sku').value = '';
  });
</script>

</body>
</html>