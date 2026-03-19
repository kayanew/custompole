const closeBtns = document.querySelectorAll('.close-btn');
const iconModal = document.querySelectorAll('.icon-modal');
const registerModal = document.querySelector('.register-modal');
const userLogin = document.querySelectorAll('.user-login');
const createNew = document.querySelector('.create-btn');

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  };
});

userLogin.forEach((btn) => {
  btn.onclick = () => {
    iconModal.style.display = 'flex';
  };
});

createNew.onclick = () => {
  loginModal.style.display = 'none';
  registerModal.style.display = 'block';
};

//Form Validation
function handleLogin(){
const logForm = document.forms['login-form'];
}

function openUserModal() {
    document.getElementById("userModal").style.display = "block";
}

function closeUserModal() {
    document.getElementById("userModal").style.display = "none";
}

function openTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));

    document.getElementById(tabName).classList.add("active");
    event.target.classList.add("active");
}