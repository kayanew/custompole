const nextStepBtn    = document.getElementById('nextBtn');
const prevStepBtn    = document.getElementById('prevBtn');

const formSteps = document.querySelectorAll(".form-step");
const circles   = document.querySelectorAll(".circle");
const progress  = document.getElementById("progress");
const form      = document.getElementById('regForm');

nextStepBtn && (nextStepBtn.addEventListener('click', nextStep));
prevStepBtn && (prevStepBtn.addEventListener('click', prevStep));

function nextStep() {
    if (!firstStepValidation()) return;
    formSteps[0].classList.remove("active");
    formSteps[1].classList.add("active");
    updateProgress(1);
}

function prevStep() {
    formSteps[1].classList.remove("active");
    formSteps[0].classList.add("active");
    updateProgress(0);
}

function updateProgress(stepIndex) {
    circles.forEach((circle, idx) => {
        if (idx <= stepIndex) circle.classList.add("active");
        else circle.classList.remove("active");
    });
    progress.style.width = stepIndex === 1 ? "100%" : "0%";
}

// ─── Toggle individual password field ────────────────────────
function toggleField(fieldId, iconWrapper) {
    const input = document.getElementById(fieldId);
    const icon  = iconWrapper.querySelector('ion-icon');

    if (input.type === 'password') {
        input.type  = 'text';
        icon.name   = 'eye-off-outline';
    } else {
        input.type  = 'password';
        icon.name   = 'eye-outline';
    }
}

// ── Real-time shop name validation ──────────────────────────────────────────
const shopNameInput  = document.getElementById("shop_name");
const ownerNameInput = document.getElementById("owner_name");

if (shopNameInput) {
    shopNameInput.addEventListener('input', () => {
        const storeNameError = document.getElementById("storeNameError");
        if (!storeNameError) return;

        const before  = shopNameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s]/g, '');

        if (cleaned !== before) {
            shopNameInput.value        = cleaned;
            storeNameError.textContent = "Numbers and symbols are not allowed.";
            show(storeNameError);
            return;
        }

        hide(storeNameError);
    });

    shopNameInput.addEventListener('blur', () => {
        const storeNameError = document.getElementById("storeNameError");
        if (!storeNameError) return;

        const v = shopNameInput.value.trim();

        if (v.length === 0) {
            hide(storeNameError);
        } else if (v.length < 2) {
            storeNameError.textContent = "Store name is too short.";
            show(storeNameError);
        } else {
            hide(storeNameError);
        }
    });

    shopNameInput.addEventListener('focus', () => hide(document.getElementById("storeNameError")));
}

// ── Real-time owner name validation ──────────────────────────────────────────
if (ownerNameInput) {
    ownerNameInput.addEventListener('input', () => {
        const ownerNameError = document.getElementById("ownerNameError");
        if (!ownerNameError) return;

        const before  = ownerNameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s'\-]/g, '');

        if (cleaned !== before) {
            ownerNameInput.value         = cleaned;
            ownerNameError.textContent   = "Numbers and symbols are not allowed.";
            show(ownerNameError);
            return;
        }

        hide(ownerNameError);
    });

    ownerNameInput.addEventListener('blur', () => {
        const ownerNameError = document.getElementById("ownerNameError");
        if (!ownerNameError) return;

        const v = ownerNameInput.value.trim();

        if (v.length === 0) {
            hide(ownerNameError);
        } else if (!/^[a-zA-Z]/.test(v)) {
            ownerNameError.textContent = "Name must start with a letter.";
            show(ownerNameError);
        } else if (v.length < 2) {
            ownerNameError.textContent = "Name is too short.";
            show(ownerNameError);
        } else {
            hide(ownerNameError);
        }
    });

    ownerNameInput.addEventListener('focus', () => hide(document.getElementById("ownerNameError")));
}

// ── Real-time phone validation ──────────────────────────────────────────
const phoneInput = document.getElementById("phone");
if (phoneInput) {

    phoneInput.addEventListener('input', () => {
        const phoneError = document.getElementById("phoneError");
        if (!phoneError) return;

        const before  = phoneInput.value;
        const cleaned = before.replace(/[^0-9]/g, '');

        if (cleaned !== before) {
            phoneInput.value       = cleaned;
            phoneError.textContent = "Only numbers are allowed.";
            show(phoneError);
            return;
        }

        hide(phoneError);
    });

    phoneInput.addEventListener('blur', () => {
        const phoneError = document.getElementById("phoneError");
        if (!phoneError) return;

        const v = phoneInput.value.trim();

        if (v.length === 0) {
            hide(phoneError);
        } else if (v.length !== 10) {
            phoneError.textContent = "Phone number must be 10 digits.";
            show(phoneError);
        } else {
            hide(phoneError);
        }
    });

    phoneInput.addEventListener('focus', () => hide(document.getElementById("phoneError")));
}
// ──────────────────────────────────────────────────────────────────────

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!secondStepValidation()) {
        console.log("Validation failed");
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = "Submitting..";

    const formData = new FormData(form);

    fetch('../../backend/users/seller/registerSeller.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned non-JSON response. Check PHP for errors.");
        }
        return response.json();
    })
    .then(data => {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Register";

        if (data.status === 'success') {
            showToast(data.message, data.status);
            clearForm();
        } else {
            showToast(data.message, data.status);
        }
    })
    .catch(err => {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Register Seller";
        showToast("Oops! Something went wrong. Check console for details.", "error");
        console.error("Registration error:", err);
    });
});

function show(e1) { if (e1) e1.style.display = 'block'; }
function hide(e1) { if (e1) e1.style.display = 'none';  }

function firstStepValidation() {
    const storeName = document.getElementById('shop_name').value.trim();
    const ownerName = document.getElementById('owner_name').value.trim();

    const storeNameError = document.getElementById("storeNameError");
    const ownerNameError = document.getElementById("ownerNameError");

    hide(storeNameError);
    hide(ownerNameError);

    const textRegex = /^[A-Za-z\s]+$/;

    if (!storeName) {
        show(storeNameError);
        storeNameError.textContent = "Store name required";
        return false;
    }
    if (!textRegex.test(storeName)) {
        show(storeNameError);
        storeNameError.textContent = "Only letters allowed";
        return false;
    }
    if (!ownerName) {
        show(ownerNameError);
        ownerNameError.textContent = "Owner name required";
        return false;
    }
    if (!textRegex.test(ownerName)) {
        show(ownerNameError);
        ownerNameError.textContent = "Only letters allowed";
        return false;
    }

    return true;
}

function secondStepValidation() {
    const email       = document.querySelector('input[name="email"]').value.trim();
    const password    = document.querySelector('input[name="password"]').value.trim();
    const confirmPass = document.querySelector('input[name="confirm_password"]').value.trim();
    const phone       = document.querySelector('input[name="phone"]').value.trim();

    const emailError = document.getElementById("emailError");
    const notConfirm = document.getElementById("not-confirm");
    const passError  = document.getElementById("passError");
    const phoneError = document.getElementById("phoneError");

    hide(emailError);
    hide(notConfirm);
    hide(passError);
    hide(phoneError);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!email) {
        show(emailError);
        emailError.textContent = "Email cannot be empty";
        return false;
    }
    if (!emailRegex.test(email)) {
        show(emailError);
        emailError.textContent = "Invalid email format";
        return false;
    }
    if (password.length < 8) {
        show(passError);
        passError.textContent = "At least 8 characters required";
        return false;
    }
    if (password !== confirmPass) {
        show(notConfirm);
        notConfirm.textContent = "Passwords do not match";
        return false;
    }
    if (!phoneRegex.test(phone)) {
        show(phoneError);
        phoneError.textContent = "Enter a valid 10-digit phone number";
        return false;
    }

    return true;
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function clearForm() {
    document.getElementById('regForm').reset();
    document.querySelectorAll('.toggle-icon ion-icon').forEach(icon => {
        icon.name = 'eye-outline';
    });
}