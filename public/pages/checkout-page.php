<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Checkout Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/checkout.css">
  <link rel="icon" href="../assets/favicon/favicon.png">
</head>
<body class="bg-light">

<div class="container py-5">
  <div class="text-center mb-5">
    <h2>Checkout Form</h2>
    <p class="text-muted">Please fill in your details to complete the order.</p>
  </div>

  <div class="row g-5">

  <div class="col-md-4 order-md-2">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-muted">Your cart</span>
        <span class="badge bg-secondary rounded-pill" id="cart-count">0</span>
      </h4>
      <ul class="list-group mb-3" id="cart-items">
        <li class="list-group-item text-muted text-center">Loading cart...</li>
      </ul>
      <div class="d-flex justify-content-between mb-1">
        <span class="text-muted">Subtotal</span>
        <span id="cart-subtotal">NPR 0</span>
      </div>
      <div class="d-flex justify-content-between mb-1">
        <span class="text-muted">Delivery fee</span>
        <span id="cart-shipping">NPR 0</span>
      </div>
      <hr class="my-2">
      <div class="d-flex justify-content-between mb-3">
        <span><strong>Total</strong></span>
        <strong id="cart-total">NPR 0</strong>
      </div>
    </div>

  <div class="col-md-8 order-md-1">
    <h4 class="mb-3">Billing Details</h4>
    <form id="checkout-form" class="needs-validation" novalidate>

    <div class="mb-3">
      <label for="fullName" class="form-label">Full Name</label>
      <input type="text" class="form-control" id="fullName" name="full_name" placeholder="James Karki" required>
          <div class="invalid-feedback">Full name is required.</div>
      </div>

      <div class="mb-3">
        <label for="phone" class="form-label">Phone</label>
        <input type="tel" class="form-control" id="phone" name="phone"
            placeholder="98XXXXXXXX" required
            pattern="^(97|98)\d{8}$">
        <div class="invalid-feedback">Enter a valid Nepal number (starts with 97 or 98).</div>
      </div>

      <div class="mb-3">
        <label for="city" class="form-label">Area</label>
        <select class="form-select" id="city" name="city" required>
          <option value="">Select your area</option>
          <optgroup label="Kathmandu">
            <option value="Thamel">Thamel</option>
            <option value="Baneshwor">Baneshwor</option>
            <option value="Koteshwor">Koteshwor</option>
            <option value="Balaju">Balaju</option>
            <option value="Budhanilkantha">Budhanilkantha</option>
            <option value="Chabahil">Chabahil</option>
            <option value="Gongabu">Gongabu</option>
            <option value="Kalanki">Kalanki</option>
            <option value="Thankot">Thankot</option>
            <option value="Maharajgunj">Maharajgunj</option>
            <option value="Lazimpat">Lazimpat</option>
            <option value="Boudha">Boudha</option>
            <option value="Jorpati">Jorpati</option>
            <option value="Pepsicola">Pepsicola</option>
            <option value="Sitapaila">Sitapaila</option>
            <option value="Kirtipur">Kirtipur</option>
          </optgroup>
          <optgroup label="Lalitpur">
            <option value="Patan">Patan</option>
            <option value="Imadol">Imadol</option>
            <option value="Ekantakuna">Ekantakuna</option>
            <option value="Jawalakhel">Jawalakhel</option>
            <option value="Kupondol">Kupondol</option>
            <option value="Pulchowk">Pulchowk</option>
          </optgroup>
          <optgroup label="Bhaktapur">
            <option value="Bhaktapur">Bhaktapur</option>
            <option value="Suryabinayak">Suryabinayak</option>
            <option value="Madhyapur Thimi">Madhyapur Thimi</option>
          </optgroup>
          </select>
        <div class="invalid-feedback">Please select your area.</div>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">Address</label>
        <textarea class="form-control" id="address" name="address"
                  rows="3" placeholder="Street, House no., Landmark..." required></textarea>
        <div class="invalid-feedback">Address is required.</div>
      </div>

      <div class="mb-3">
        <label class="form-label">Payment Method</label>
        <input type="text" class="form-control" value="Cash on Delivery" readonly
                style="background-color:#e3e4e4;">
      </div>
      <button class="w-100 btn btn-lg" type="submit" id="place-btn"
                style="background-color: #4c956c; color: white;">Place Order</button>
      </form>
    </div>
  </div>
</div>
<div id="order-success-modal" class="modal-overlay" style="display:none;">
  <div class="modal-box">

    <div class="modal-icon">&#10003;</div>

    <h2 class="modal-title">Thank You for Your Order!</h2>
    <p class="modal-subtitle">Your order has been placed successfully and is now pending confirmation from the seller.</p>

    <div class="modal-details">
      <div class="modal-detail-row">
        <span class="modal-label">Order Number</span>
        <span class="modal-value" id="modal-order-number">—</span>
      </div>
      <div class="modal-detail-row">
        <span class="modal-label">Grand Total</span>
        <span class="modal-value" id="modal-grand-total">—</span>
      </div>
      <div class="modal-detail-row">
        <span class="modal-label">Payment Method</span>
        <span class="modal-value">Cash on Delivery</span>
      </div>
    </div>
    <button class="modal-btn" id="modal-continue-btn">Continue Shopping</button>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/checkout.js"></script>
</body>
</html>