import { auth, db } from "./firebase.js"; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    ref, 
    set 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { ANIMATION_PATHS, showLottieLoader, hideLottieLoader } from "./uiAnimations.js";

// show messages on page
function showStatus(message, isSuccess) {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `auth-message ${isSuccess ? 'auth-success' : 'auth-error'}`;
        messageBox.setAttribute('role', isSuccess ? 'status' : 'alert');
    }
}

function mapAuthError(code, flow) {
    const commonMessages = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/network-request-failed': 'Network issue detected. Check your connection and try again.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.'
    };

    const loginMessages = {
        'auth/invalid-credential': 'Incorrect email or password. Please try again.',
        'auth/user-not-found': 'No account found for this email.',
        'auth/wrong-password': 'Incorrect email or password. Please try again.',
        'auth/missing-password': 'Please enter your password.'
    };

    const registerMessages = {
        'auth/email-already-in-use': 'This email is already registered. Please log in instead.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters and one number.',
        'auth/missing-password': 'Please create a password.'
    };

    if (commonMessages[code]) return commonMessages[code];
    if (flow === 'login' && loginMessages[code]) return loginMessages[code];
    if (flow === 'register' && registerMessages[code]) return registerMessages[code];

    return flow === 'login'
        ? 'Unable to log in right now. Please try again.'
        : 'Unable to create your account right now. Please try again.';
}

// check if email is valid
function validateEmail(email) {
    return email.includes('@') && email.includes('.com');
}

// check password requirements
function validatePassword(password) {
    return password.length >= 6 && /\d/.test(password);
}

// check name starts with capital letter
function validateName(name) {
    const cleanName = name.trim();
    return cleanName.length > 0 && /^[A-Z]/.test(cleanName);
}

// handle user registration
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('username')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const confirmPassword = document.getElementById('confirm-password')?.value || '';

    if (!name || !email || !password || !confirmPassword) {
        showStatus('Please fill in all fields.', false);
        return;
    }

    if (!validateName(name)) {
        showStatus('Name must start with a capital letter.', false);
        return;
    }

    if (!validateEmail(email)) {
        showStatus('Email must contain @ and .com', false);
        return;
    }

    if (!validatePassword(password)) {
        showStatus('Password: min 6 chars and 1 digit.', false);
        return;
    }

    if (password !== confirmPassword) {
        showStatus('Passwords do not match.', false);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, 'players/' + user.uid), {
            name: name,
            email: email,
            rooms: {
                level3: { achievement: "", bestTime: 0 },
                level4: { achievement: "", bestTime: 0 },
                level5: { achievement: "", bestTime: 0 },
                level6: { achievement: "", bestTime: 0 }
            }
        });

        showStatus('Registration successful! Redirecting...', true);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

    } catch (error) {
        console.error("Error:", error.code);
        showStatus(mapAuthError(error.code, 'register'), false);
    }
}

// handle user login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value?.trim() || '';
    const password = document.getElementById('password')?.value || '';

    if (!email || !password) {
        showStatus('Please enter email and password.', false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showStatus('Login successful! Preparing your dashboard...', true);
        showLottieLoader({
            message: 'Entering Lab Breakout...',
            animationPath: ANIMATION_PATHS.login
        });

        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1300);
    } catch (error) {
        hideLottieLoader();
        showStatus(mapAuthError(error.code, 'login'), false);
    }
}

// set up event listeners when page loads
function init() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', handleRegister);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}