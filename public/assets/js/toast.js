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