document.addEventListener("DOMContentLoaded", () => {
    const guestAccount = document.querySelector('.guest-account');
    const userAccount = document.querySelector('.user-account');

    fetch("Backend/checkSession.php")
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                if (guestAccount) guestAccount.style.display = "none";
                if (userAccount) userAccount.style.display = "block";
            } else {
                if (guestAccount) guestAccount.style.display = "block";
                if (userAccount) userAccount.style.display = "none";
            }
        })
        .catch(err => console.error("Failed to check session:", err));
});

function checkSession(){
    const guestAccount = document.querySelector('.guest-account');
    const userAccount = document.querySelector('.user-account');

    fetch("Backend/checkSession.php")
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                if (guestAccount) guestAccount.style.display = "none";
                if (userAccount) userAccount.style.display = "block";
            } else {
                if (guestAccount) guestAccount.style.display = "block";
                if (userAccount) userAccount.style.display = "none";
            }
        })
        .catch(err => console.error("Failed to check session:", err));
}