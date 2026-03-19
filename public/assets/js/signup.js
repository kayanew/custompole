const form = document.getElementById('signupForm');
form.addEventListener('submit', function(e){
    e.preventDefault();
    
    if(!validateForm()){
        return;
    }   

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="btn-loader"><div></div></div>`;
    
    const formData = new FormData(form);
    setTimeout(()=>{
        fetch('../../backend/users/userDetails.php',{
            method: 'POST', 
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Account";
            if(data.status === 'success'){
                showToast(data.message, 'success');
                clearForm();
            } else {
                showToast(data.message, 'error');
            }
        })
        .catch(err => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Account";
            showToast("Oops! Something went wrong", 'error');
            console.error(err);
        });
    }, 2000);
});

// ── Real-time name validation ──────────────────────────────────────────
const nameInput = document.getElementById("fname");
if (nameInput) {

    nameInput.addEventListener('input', () => {
        const nameError = document.getElementById("nameError");
        if (!nameError) return;

        const before = nameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s'\-]/g, '');

        if (cleaned !== before) {
            nameInput.value = cleaned;
            nameError.textContent = "Numbers and symbols are not allowed.";
            nameError.style.display = "block";
            return;
        }

        nameError.style.display = "none";
    });

    nameInput.addEventListener('blur', () => {
        const nameError = document.getElementById("nameError");
        if (!nameError) return;

        const v = nameInput.value.trim();

        if (v.length === 0) {
            nameError.style.display = "none";
        } else if (!/^[a-zA-Z]/.test(v)) {
            nameError.textContent = "Name must start with a letter.";
            nameError.style.display = "block";
        } else if (v.length < 2) {
            nameError.textContent = "Name is too short.";
            nameError.style.display = "block";
        } else {
            nameError.style.display = "none";
        }
    });

    nameInput.addEventListener('focus', () => {
        const nameError = document.getElementById("nameError");
        if (nameError) nameError.style.display = "none";
    });
}
// ──────────────────────────────────────────────────────────────────────

function validateForm(){
    const name        = document.getElementById("fname").value.trim();
    const email       = document.getElementById("reg-email").value.trim();
    const password    = document.getElementById("new-pass").value.trim();
    const confirmPass = document.getElementById("confirm-password").value.trim();

    const nameError        = document.getElementById("nameError");  // fixed: was "fnameError"
    const emailError       = document.getElementById("emailError");
    const passLengthError  = document.getElementById("pass-length");
    const passInvalidError = document.getElementById("invalid-pass");
    const notConfirm       = document.getElementById("not-confirm");

    const emailRegex    = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const nameRegex     = /^[a-zA-Z][a-zA-Z\s'\-]{1,49}$/;

    nameError.style.display        = "none";
    emailError.style.display       = "none";
    passLengthError.style.display  = "none";
    passInvalidError.style.display = "none";
    notConfirm.style.display       = "none";

    if (!nameRegex.test(name)) {
        nameError.textContent = name.length === 0
            ? "Name is required."
            : "Letters only, please.";
        nameError.style.display = "block";
        return false;
    }

    if (!emailRegex.test(email)) {
        emailError.style.display = "block";
        return false;
    }

    if (!passwordRegex.test(password)) {
        passInvalidError.style.display = "block";
        return false;
    }

    if (password !== confirmPass) {
        notConfirm.style.display = "block";
        return false;
    }

    return true;
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('success', 'error');
    toast.classList.add(type, 'show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function clearForm() {
    const userForm = document.getElementById('signupForm');
    if (userForm) {
        userForm.reset();
    }
}

function toggleField(fieldId, iconWrapper) {
    const input = document.getElementById(fieldId);
    const icon  = iconWrapper.querySelector('ion-icon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.name  = 'eye-off-outline';
    } else {
        input.type = 'password';
        icon.name  = 'eye-outline';
    }
}