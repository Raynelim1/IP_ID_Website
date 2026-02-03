import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Registration functionality
document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegistration);
    }

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
});

async function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Reset messages
    hideMessages();

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password should be at least 6 characters');
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // You can store additional user data in Firestore or Realtime Database here
        // For now, just redirect to home
        showSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
    } catch (error) {
        console.error('Registration error:', error);
        showError(getErrorMessage(error.code));
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Hide previous error
    hideMessages();

    // For now, using email as username since we don't have username auth
    // In a real app, you'd need to implement username-based auth or store username separately
    const email = username; // Assuming username is email for simplicity

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Redirect to home page
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Login error:', error);
        showError(getErrorMessage(error.code));
    }
}

function showError(message) {
    const errorDiv = document.querySelector('.error-message') || createMessageDiv('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function showSuccess(message) {
    const successDiv = document.querySelector('.success-message') || createMessageDiv('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

function hideMessages() {
    const errorDiv = document.querySelector('.error-message');
    const successDiv = document.querySelector('.success-message');
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

function createMessageDiv(className) {
    const div = document.createElement('div');
    div.className = className;
    document.querySelector('.register-form').appendChild(div);
    return div;
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/weak-password':
            return 'Password is too weak';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        default:
            return 'An error occurred. Please try again.';
    }
}</content>
<parameter name="filePath">c:\Users\limwr\OneDrive\Desktop\NP\IP\ID\IP_ID_Website\auth.js