document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('changePasswordForm');
    const message = document.getElementById('changePasswordMessage');

    if (!form) return;

    form.addEventListener('submit', async function(event){
        event.preventDefault();
        message.textContent = '';
        message.className = '';

        const currentPassword = document.getElementById('cur-pwd').value.trim();
        const newPassword = document.getElementById('new-pwd').value.trim();
        const confirmPassword = document.getElementById('confirm-pwd').value.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            message.textContent = 'Please fill all fields.';
            message.className = 'text-danger';
            return;
        }
        if (newPassword !== confirmPassword) {
            message.textContent = 'New password and confirmation do not match.';
            message.className = 'text-danger';
            return;
        }
        if (newPassword.length < 8) {
            message.textContent = 'Password must be at least 8 characters.';
            message.className = 'text-danger';
            return;
        }

        const submitButton = document.getElementById('changeBtn');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        try {
            const response = await fetch('../../backend/auth/change_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            });
            const result = await response.json();
            if (result.success) {
                message.textContent = result.message || 'Password updated successfully.';
                message.className = 'text-success';
                form.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordForm'));
                if (modal) modal.hide();
            } else {
                message.textContent = result.message || 'Failed to update password.';
                message.className = 'text-danger';
            }
        } catch (error) {
            console.error(error);
            message.textContent = 'Server error while changing password.';
            message.className = 'text-danger';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Change';
        }
    });
});