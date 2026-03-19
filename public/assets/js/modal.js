const userLogin = document.querySelectorAll(".user-login");
const closeBtns = document.querySelectorAll(".close-btn");
const wishlistBtn = document.querySelector(".show-wishlist");
const wishlistModal = document.querySelector(".wishlist-modal");
const cartBtns = document.querySelectorAll(".show-cart");
const overlays = document.querySelectorAll(".modal-overlay");
const cartModal = document.querySelector(".cart-modal");
const accountModal = document.querySelector(".account-modal");
const loginBtns = document.querySelectorAll('.log-modal');
const loginModal = document.getElementById('login-modal');

let hideTimeout;

function showAccountModal() {
  accountModal.style.display = "block";
  wishlistModal.style.display = "none";
  cartModal.classList.remove('show');
}

function hideAccountModal() {
  hideTimeout = setTimeout(() => {
    accountModal.style.display = "none";
  }, 200);
}

function openLoginModal(){
  loginModal.style.display = 'block';
    overlays.forEach(overlay=>{
      overlay.classList.add('show');
    })
}

loginBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    openLoginModal();
    // document.body.classList.add('modal-open');
  });
});

userLogin.forEach(btn => {
  btn.addEventListener("click", showAccountModal);
  btn.addEventListener("mouseleave", () => {
    if (!accountModal.matches(":hover")) hideAccountModal();
  });
});

if(accountModal){
  accountModal.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
    showAccountModal();
  });
  accountModal.addEventListener("mouseleave", hideAccountModal);
}

if (wishlistBtn) {
  wishlistBtn.addEventListener('click', ()=>{
    // wishlistModal.style.display = "block";
    alert("Feature will be available soon.");
    cartModal.classList.remove('show');
  });
}

cartBtns.forEach(cartBtn=>{
  cartBtn.addEventListener('click', ()=>{
    cartModal.classList.add('show');
    document.body.classList.add('modal-open');
    overlays.forEach(overlay=>{
      overlay.classList.add('show');
    })
    wishlistModal.style.display = "none";
  });
});

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    loginModal.style.display = "none";
    accountModal.style.display = "none";
    wishlistModal.style.display = "none";
    cartModal.classList.remove('show');
    overlays.forEach(overlay=>{
      overlay.classList.remove('show');
    })
    document.body.classList.remove('modal-open');
  });
});
