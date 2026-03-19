<?php
session_start();
require '../../backend/auth/config/db.php';

$searchid = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if (!$searchid) {
    header("Location: catalog.php");
    exit;
}

try {
    $query = "SELECT p.*, c.category_name, pt.type_name
              FROM products p
              LEFT JOIN categories    c  ON p.category_id = c.category_id
              LEFT JOIN product_types pt ON p.type_id     = pt.type_id
              WHERE p.product_id = ?
              LIMIT 1";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $searchid);
    $stmt->execute();
    $result  = $stmt->get_result();
    $product = $result->fetch_assoc();

    if (!$product) {
        header("Location: not-found.php");
        exit;
    }
} catch (Exception $e) {
    die("Database error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<meta name="description" content="<?= htmlspecialchars($product['description']) ?>" />
<title><?= htmlspecialchars($product['name']) ?> — pupkit</title>

<link rel="icon" href="../assets/favicon/favicon.png">


<link rel="stylesheet" href="../assets/css/navbar.css">
<link rel="stylesheet" href="../assets/css/styles.css">
<link rel="stylesheet" href="../assets/css/mediaqueries.css">
<link rel="stylesheet" href="../assets/css/cart-modal.css">
<link rel="stylesheet" href="../assets/css/account-modal.css" />
<link rel="stylesheet" href="../assets/css/wish-modal.css" />
<link rel="stylesheet" href="../assets/css/product-details.css" />
<link rel="stylesheet" href="../assets/css/overlay-effect.css" />
<link rel="stylesheet" href="../assets/css/toast.css" />
<link rel="stylesheet" href="../assets/css/loader.css" />
<link rel="stylesheet" href="../assets/css/footer.css" />

<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">

<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
crossorigin="anonymous"
referrerpolicy="no-referrer" />

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

<style>

body {
  background-color: #fafafa;
}

@keyframes detailFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.main-container {
  animation: detailFadeIn 0.4s ease both;
}

body.page-leaving {
  opacity: 0;
  transition: opacity 0.25s ease;
}

.product-image {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.product-image.img-loaded {
  opacity: 1;
}

</style>
</head>

<body>

<?php require("../components/navbar.php"); ?>

<section class="product-showcase">
<div class="main-container">

<div class="product-grid">

<div class="image-column">
<img class="product-image"
src="<?= htmlspecialchars($product['image']) ?>"
alt="<?= htmlspecialchars($product['name']) ?>">
</div>

<div class="details-column">

<div class="category-info">
<b>Category:</b>
<span><?= htmlspecialchars($product['category_name']) ?></span>
<?php if (!empty($product['type_name'])): ?>
&nbsp;·&nbsp;<span><?= htmlspecialchars($product['type_name']) ?></span>
<?php endif; ?>
</div>

<h1 class="product-title"><?= htmlspecialchars($product['name']) ?></h1>

<div class="product-price">
Rs <?= number_format($product['price'], 2) ?>
</div>

<p class="product-description">
<?= htmlspecialchars($product['description']) ?>
</p>

<div class="quantity-section">
<label for="productQuantity" class="quantity-label">Quantity&nbsp;</label>
<input type="number" class="quantity-input" id="productQuantity" value="1" min="1">
</div>

<div class="action-buttons">
<button class="cart-btn btn-add-to-cart" data-id="<?= (int)$product['product_id'] ?>">
Add to Cart
</button>

<button class="wish-btn btn-wishlist" data-id="<?= (int)$product['product_id'] ?>">
Wish
</button>
</div>

</div>
</div>
</div>
</section>

<?php require("../components/cart-modal.php"); ?>
<?php require("../components/login-modal.php"); ?>
<?php require("../components/account-modal.php"); ?>
<?php require("../components/wish-modal.php"); ?>

<div class="modal-overlay"></div>
<div class="toast" id="toast"></div>

<?php require("../components/footer.php"); ?>

<script src="../assets/js/main.js"></script>
<script src="../assets/js/modal.js"></script>
<script src="../assets/js/login.js"></script>
<script src="../assets/js/signout.js"></script>
<script src="../assets/js/view-product.js"></script>
<script src="../assets/js/cart-modal.js"></script>
<script src="../assets/js/toast.js"></script>

<script>

const productImg = document.querySelector('.product-image');

if (productImg) {

if (productImg.complete) {
productImg.classList.add('img-loaded');
} else {

productImg.addEventListener('load', () => productImg.classList.add('img-loaded'));
productImg.addEventListener('error', () => productImg.classList.add('img-loaded'));

}

}

document.querySelectorAll('a[href]').forEach(link => {

link.addEventListener('click', function (e) {

const href = this.getAttribute('href');

if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;

e.preventDefault();

document.body.classList.add('page-leaving');

setTimeout(() => {
window.location.href = href;
}, 250);

});

});

window.addEventListener('pageshow', (e) => {

if (e.persisted) {
document.body.classList.remove('page-leaving');
}

});

</script>

</body>
</html>