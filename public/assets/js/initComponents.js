let hideTimeout;
export function initModals() {
  // Query all required DOM elements inside the component
  const userLogin = document.querySelectorAll(".user-login");
  const closeBtns = document.querySelectorAll(".close-btn");
  const wishlistBtn = document.querySelector(".show-wishlist");
  const wishlistModal = document.querySelector(".wishlist-modal");
  const cartBtn = document.querySelector(".show-cart");
  const cartModal = document.querySelector(".cart-modal");
  const accountModal = document.querySelector(".account-modal");
  const loginBtn = document.querySelector('.log-modal');
  const loginModal = document.getElementById('login-modal');

  if (!accountModal) return; // safety check if component not loaded

  // Internal helper functions
  function showAccountModal() {
    accountModal.style.display = "block";
    wishlistModal.style.display = "none";
    cartModal.style.display = "none";
  }

  function hideAccountModal() {
    hideTimeout = setTimeout(() => {
      accountModal.style.display = "none";
    }, 200);
  }

  // Login modal
  loginBtn?.addEventListener('click', () => {
    if (loginModal) loginModal.style.display = 'block';
  });

  // Account hover/click behavior
  userLogin.forEach((btn) => {
    btn.addEventListener("click", showAccountModal);
    btn.addEventListener("mouseleave", () => {
      if (!accountModal.matches(":hover")) {
        hideAccountModal();
      }
    });
  });

  accountModal.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    showAccountModal();
  });

  accountModal.addEventListener("mouseleave", hideAccountModal);

  // Wishlist button
  wishlistBtn?.addEventListener('click', () => {
    wishlistModal.style.display = "block";
    cartModal.style.display = "none";
  });

  // Cart button
  cartBtn?.addEventListener('click', () => {
    cartModal.style.display = "block";
    wishlistModal.style.display = "none";
  });

  // Close buttons for modals
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "none";
      accountModal.style.display = "none";
      wishlistModal.style.display = "none";
      cartModal.style.display = "none";
    });
  });
}

// Optional helper for toggling guest/user menu
export function showMenu() {
  const guestAccount = document.querySelector('.guest-account');
  const userAccount = document.querySelector('.user-account');
  if (!guestAccount || !userAccount) return;
  guestAccount.style.display = "none";
  userAccount.style.display = "block";
}
