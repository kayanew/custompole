const logOutBtns = document.querySelectorAll('.log-out-btn');
const logOutAPI = '/mvp/backend/auth/logout.php';

logOutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Optional: Add confirmation
        if (!confirm('Are you sure you want to log out?')) {
            return;
        }
        
        btn.disabled = true;
        
        fetch(logOutAPI, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success'){
                showToast('Logged Out Successfully', "success");
                setTimeout(() => {
                    window.location.href = '/mvp/public/index.php';
                }, 2000);
            } else {
                btn.disabled = false;
                alert('Logout failed. Please try again.');
                console.error('Logout failed:', data.message);
            }
        })
        .catch(err => {
            btn.disabled = false;
            alert('An error occurred. Please try again.');
            console.error('Fetch error:', err);
        });
    });
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