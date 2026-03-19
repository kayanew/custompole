<?php
  session_start();
  // if(!isset($_SESSION['user_id'])){
  //   header('Location: ../index.php');
  //   exit();
  // }
  // if($_SESSION['role'] != 'admin'){
  //   header('Location: unauthorized.html');
  //   exit();
  // }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard</title>

  <link rel="stylesheet" href="../assets/css/styles.css" />
  <link rel="stylesheet" href="../assets/css/navbar.css" />
  <link rel="stylesheet" href="../assets/css/mediaqueries.css" />
  <link rel="stylesheet" href="../assets/css/panel.css" />
  <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" />

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  <link rel="icon" href="../assets/favicon/favicon.png" />
</head>

<body style="overflow: auto">
  <header>
    <nav class="header-main">
      <div class="logo-container">
        <a href="index.html"><strong>Admin Panel</strong></a>
      </div>

      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Account
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changePasswordForm">Change
          Password</button></li>
          <li><button class="log-out-btn dropdown-item">Logout</button></li>
        </ul>
      </div>
    </nav>

    <!-- Mobile Bottom Nav -->
    <nav class="mobile-bottom-navigation">
      <button class="action-btn"><ion-icon name="menu-outline"></ion-icon></button>
      <button class="action-btn">
        <ion-icon name="cart-outline"></ion-icon>
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn" onclick="window.location.href='index.html'">
        <ion-icon name="home-outline"></ion-icon>
      </button>
      <button class="action-btn">
        <ion-icon name="heart-outline"></ion-icon>
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn">
        <ion-icon name="person-outline"></ion-icon>
      </button>
    </nav>
  </header>

  <main class="spacing">
    <div class="modal fade" id="changePasswordForm" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title fs-5">Change Password</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="changePasswordForm" novalidate>
              <div class="mb-3">
                <label for="cur-pwd">Current Password</label>
                <input type="password" id="cur-pwd" name="current_password" class="form-control" required placeholder="Your old password">
              </div>

              <div class="mb-3">
                <label for="new-pwd">New Password</label>
                <input type="password" id="new-pwd" name="new_password" class="form-control" required placeholder="Your new password">
              </div>
              <div class="mb-3">
                <label for="confirm-pwd">Confirm New Password</label>
                <input type="password" id="confirm-pwd" name="confirm_password" class="form-control" required placeholder="Confirm new password">
              </div>

              <div id="changePasswordMessage" class="mt-2"></div>

              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-success float-end" id="changeBtn">Change</button>
            </form>

          </div>
        </div>
      </div>
    </div>

    <!--Dashboard Cards-->
    <div class="container-fluid mb-4">
      <div class="row">

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="usersCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <!-- <i class="fas fa-calendar fa-2x text-muted"></i> -->
                  <ion-icon class="fa-2x text-muted" name="people-outline"></ion-icon>
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
                  <div class="text-xs fw-bold text-success text-uppercase mb-1">
                    Total Sellers
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="sellersCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <!-- <i class="fas fa-dollar-sign fa-2x text-muted"></i> -->
                  <ion-icon class="fa-2x text-muted" name="storefront-outline"></ion-icon>
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
                  <div class="text-xs fw-bold text-success text-uppercase mb-1">
                    Total Products
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="productsCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <ion-icon class="fa-2x text-muted" name="albums-outline"></ion-icon>
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
                  <div class="text-xs fw-bold text-warning text-uppercase mb-1">
                    Account Requests
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="pendingRequests"><strong></strong></h5></div>
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

    <!-- ACTION BAR -->
    <!-- <div class="action-bar">
    <button class="action-btn" id="seller-btn">Seller Control</button>
    <ul class="show-actions" id="seller-menu">
      <li><button>Approve / Reject</button></li>
      <li><button>View Details</button></li>
      <li><button>Remove</button></li>
    </ul>

    <button class="action-btn" id="product-btn">Product Control</button>
    <ul class="show-actions" id="product-menu">
      <li><button>Approve / Reject Product</button></li>
      <li><button>View Product Details</button></li>
      <li><button>Remove Product</button></li>
    </ul>

    <button class="action-btn" id="ftch-users">User Control</button>
  </div> -->
    <div class="action-bar d-flex align-items-center gap-2 flex-wrap">
      <!-- Seller Control Dropdown -->
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="sellerDropdown" data-bs-toggle="dropdown"
          aria-expanded="false">
          Seller Control
        </button>
        <ul id="sellerDropdownMenu" class="dropdown-menu" aria-labelledby="sellerDropdown">
          <li><button class="dropdown-item" id="ftch-seller-apps">Applications</button></li>
          <li><button class="dropdown-item" id="ftch-seller-list">All Sellers</button></li>
        </ul>
      </div>

      <!-- Product Control Dropdown -->
      <div class="dropdown">
        <button class="btn btn-success dropdown-toggle" type="button" id="productDropdown" data-bs-toggle="dropdown"
          aria-expanded="false">
          Product Control
        </button>
        <ul id="productDropdownMenu" class="dropdown-menu" aria-labelledby="productDropdown">
          <li><button class="dropdown-item" id="ftch-product-apps">Applications</button></li>
          <li><button class="dropdown-item" id="ftch-product-list">All Products</button></li>
        </ul>
      </div>

      <!-- User Control -->
      <button class="btn btn-info" id="ftch-orders">
        Order Management
      </button>

      <button class="btn btn-warning" id="ftch-users">
        User Control
      </button>

      <form class="d-flex ms-auto" role="search" onsubmit="event.preventDefault();">
        <input class="form-control" type="search" placeholder="Search users / sellers / products"
          aria-label="Search" id="admin-search" />
      </form>
    </div>


    <!-- Content -->
    <!-- <div class="content-box">
      <div class="userData">  
        <table id="userInfo-table"></table>
      </div>
      <div class="" id="s-container"></div>
      <div class="prod-panel" id="seller-apps"></div>
    </div> -->
    <div class="content-box">
    <div class="userData">
        <div class="table-responsive">
            <table id="userInfo-table"></table>
        </div>
    </div>
    <div id="s-container"></div>
    <div class="prod-panel" id="seller-apps"></div>
</div>

    <!-- Shared detail modal -->
    <div class="modal fade" id="adminDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 id="adminDetailModalTitle" class="modal-title">Details</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" id="adminDetailModalBody"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

<!-- <div class="toast" id="toast"></div> -->

  </main>
  <!-- Scripts -->
  <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../assets/js/admin/admin-script.js"></script>
  <script src="../assets/js/change-password.js"></script>
  <script src="../assets/js/view-user.js"></script>
  <script src="../assets/js/signout.js"></script>
  <script src="../assets/js/admin/order-management.js"></script>
  <script src="../assets/js/admin/seller-applications.js"></script>
  <script src="../assets/js/admin/users-control.js"></script>
  <script src="../assets/js/admin/products-control.js"></script>

</body>

</html>