import { auth } from "./firebase.js";
import { onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let currentUserEmail = null;

// Helper function to show error messages
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    successDiv.style.display = 'none';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    errorDiv.style.display = 'none';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function clearMessages() {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
    successDiv.textContent = '';
    successDiv.style.display = 'none';
}

// Check authentication and send password reset email
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    currentUserEmail = user.email;

    // Automatically send the password reset email when page loads
    try {
        await sendPasswordResetEmail(auth, currentUserEmail);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        showError('Error sending password reset email: ' + error.message);
    }
});

// Resend email button handler
document.getElementById('resend-email-btn').addEventListener('click', async () => {
    clearMessages();
    
    if (!currentUserEmail) {
        showError('No user email found. Please log in again.');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, currentUserEmail);
        showSuccess('Password reset email resent successfully!');
    } catch (error) {
        console.error('Error resending password reset email:', error);
        showError('Error resending password reset email: ' + error.message);
    }
});
