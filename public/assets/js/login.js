const loginForm = document.getElementById('login-form');
const invalidPass = document.querySelector('.pass-error');
const loginAPI = '/mvp/backend/auth/login.php';

invalidPass.style.display = "none";

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="btn-loader"><div></div></div>`;

    const formData = new FormData(loginForm);

    setTimeout(() => {

        fetch(loginAPI, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            if (data.status === 'redirect_admin') {
                window.location.href = "/mvp/public/pages/admin-panel.php";
            }

            else if (data.status === 'redirect_seller') {
                window.location.href = "/mvp/public/pages/seller-panel.php";
            }

            else if (data.status === 'redirect_user') {
                showToast("Login Successful!", "success");
                showMenu();

                setTimeout(() => {
                    window.location.href = "/mvp/public/index.php";
                }, 1200);
            }

            else if (data.status === 'incorrect_password') {
                invalidPass.style.display = "inline";
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Login";
            }

            else if (data.status === 'error') {
                invalidPass.style.display = "inline";
                invalidPass.textContent = data.message || "Login failed";
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Login";
            }
        })

        .catch(err => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Login";

            console.error(err);
            showToast("Something went wrong", "error");
        });

    }, 2000);
});


function showToast(message, type = 'success', duration = 2000) {
    const toast = document.getElementById('toast');

    if (!toast) {
        console.error("Toast element not found!");
        return;
    }

    toast.textContent = message;
    toast.classList.remove('success', 'error');
    toast.classList.add(type, 'show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}


function showMenu() {
    const guestMenu = document.querySelectorAll('.guest-account');
    const userMenu = document.querySelectorAll('.user-account');

    userMenu.forEach(el => el.style.display = 'block');
    guestMenu.forEach(el => el.style.display = 'none');
}


function showLoader(task){
    const loader = document.querySelectorAll('.loader');

    if(task){
        loader.forEach(el => el.style.display = 'block');
    } else {
        loader.forEach(el => el.style.display = 'none');
    }
}