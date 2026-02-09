// Import the connections from your firebase.js
import { auth, db } from "./firebase.js"; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    ref, 
    set 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// --- UI Helper Function ---
function showStatus(message, isSuccess) {
    const messageBox = document.getElementById('message-box');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.style.display = 'block';
        // Green for success (#28a745), Red for error (#dc3545)
        messageBox.style.color = isSuccess ? "#28a745" : "#dc3545";
    }
}

// --- Validation Functions ---
function validateEmail(email) {
    return email.includes('@') && email.includes('.com');
}

function validatePassword(password) {
    return password.length >= 6 && /\d/.test(password);
}

function validateName(name) {
    // Trim spaces and check if first character is A-Z
    const cleanName = name.trim();
    return cleanName.length > 0 && /^[A-Z]/.test(cleanName);
}

// --- Registration Handler ---
async function handleRegister(e) {
    e.preventDefault();
    
    // Get values and trim them immediately
    const name = document.getElementById('username')?.value?.trim() || '';
    const email = document.getElementById('email')?.value?.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const confirmPassword = document.getElementById('confirm-password')?.value || '';

    // 1. Validation Checks
    if (!name || !email || !password || !confirmPassword) {
        showStatus('Please fill in all fields.', false);
        return;
    }

    if (!validateName(name)) {
        showStatus('Name must start with a capital letter (e.g., Raynelim).', false);
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

    // 2. Firebase Cloud Execution
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save data to match your structure: players -> UID -> name & rooms
        // 'createdAt' has been removed per your request.
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
        console.error("Firebase Auth Error:", error.code);
        showStatus('Error: ' + error.message, false);
    }
}

// --- Login Handler ---
async function handleLogin(e) {
    e.preventDefault();
    
    // Ensure index.html inputs use id="email" and id="password"
    const email = document.getElementById('email')?.value?.trim() || '';
    const password = document.getElementById('password')?.value || '';

    if (!email || !password) {
        showStatus('Please enter email and password.', false);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showStatus('Login successful! Welcome back.', true);
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);
    } catch (error) {
        showStatus('Login failed: ' + error.message, false);
    }
}

// --- Initialization ---
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

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}