<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pet Shop Nepal</title>

  <link rel="stylesheet" href="public/assets/css/styles.css"/>
  <link rel="stylesheet" href="public/assets/css/navbar.css" />
  <link rel="stylesheet" href="public/assets/css/mediaqueries.css" />
  <link rel="stylesheet" href="public/assets/css/wish-modal.css" />
  <link rel="stylesheet" href="public/assets/css/cart-modal.css" />
  <link rel="stylesheet" href="public/assets/css/toast.css" />
  <link rel="stylesheet" href="public/assets/css/account-modal.css" />
  <link rel="stylesheet" href="public/assets/css/overlay-effect.css" />
  <link rel="stylesheet" href="public/assets/css/loader.css" />
  <link rel="stylesheet" href="public/assets/css/footer.css" />

  <link rel="icon" href="assets/favicon/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>

<body>

  <?php require("public/components/navbar.php"); ?>
  <?php require("public/components/body.php"); ?>
  <?php require("public/components/footer.php"); ?>

  <?php require("public/components/cart-modal.php"); ?>
  <?php require("public/components/login-modal.php"); ?>
  <?php require("public/components/account-modal.php"); ?>
  <?php require("public/components/wish-modal.php"); ?>

  <div class="modal-overlay"></div>
  <div class="toast" id="toast"></div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const guestAccount = document.querySelector('.guest-account');
      const userAccount  = document.querySelector('.user-account');

      fetch("../backend/auth/checkSession.php")
        .then(res => res.json())
        .then(data => {
          if (data.loggedIn) {
            if (guestAccount) guestAccount.style.display = "none";
            if (userAccount)  userAccount.style.display  = "block";
          } else {
            if (guestAccount) guestAccount.style.display = "block";
            if (userAccount)  userAccount.style.display  = "none";
          }
        })
        .catch(err => console.error("Failed to check session:", err));
    });

    window.addEventListener('scroll', () => {
      document.querySelector('header').classList.toggle('scrolled', window.scrollY > 10);
    });
  </script>

  <script src="public/assets/js/modal.js"></script>
  <script src="public/assets/js/login.js"></script>
  <script src="public/assets/js/signout.js"></script>
  <script src="public/assets/js/view-product.js"></script>
  <script src="public/assets/js/render-products.js"></script>
  <script src="public/assets/js/cart-modal.js"></script>
  <script src="public/assets/js/accordion-effect.js"></script>

</body>
</html>