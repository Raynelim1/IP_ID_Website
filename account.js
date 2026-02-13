import { auth, db } from "./firebase.js";
import {
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let currentUser = null;
let currentUserEmail = null;

function formatTime(seconds) {
    if (!seconds || seconds === 0) return "0min 0.0s";
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}min ${secs}s`;
}

function setTextIfExists(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    if (successDiv) {
        successDiv.style.display = 'none';
    }
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function showSuccess(message) {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

function clearMessages() {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');

    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
    if (successDiv) {
        successDiv.textContent = '';
        successDiv.style.display = 'none';
    }
}

function showEditError(message) {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearEditError() {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) return;

    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

function showEditSuccess(message) {
    const successDiv = document.getElementById('name-success-message');
    if (!successDiv) return;

    successDiv.innerHTML = '<span class="checkmark-inline">✓</span> ' + message;
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

function clearEditSuccess() {
    const successDiv = document.getElementById('name-success-message');
    if (!successDiv) return;

    successDiv.textContent = '';
    successDiv.style.display = 'none';
}

async function loadProfileData(user) {
    setTextIfExists('info-email', user.email || '');

    try {
        const playerRef = ref(db, 'players/' + user.uid);
        const snapshot = await get(playerRef);

        if (!snapshot.exists()) {
            return;
        }

        const data = snapshot.val();
        const playerName = data.name || 'Student';

        setTextIfExists('display-name', playerName);
        setTextIfExists('info-name', playerName);

        const levels = ['level3', 'level4', 'level5', 'level6'];
        levels.forEach((lvl) => {
            const roomData = data.rooms ? data.rooms[lvl] : null;
            if (!roomData) return;

            setTextIfExists(`best-time-${lvl}`, formatTime(roomData.bestTime));
            setTextIfExists(`grade-${lvl}`, `Grade: ${roomData.achievement || '-'}`);
        });
    } catch (error) {
        console.error('Firebase Data Fetch Error:', error);
    }
}

async function loadEditDetailsData(user) {
    try {
        const playerRef = ref(db, 'players/' + user.uid);
        const snapshot = await get(playerRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const nameInput = document.getElementById('edit-name');
            if (nameInput) {
                nameInput.value = data.name || '';
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function sendResetEmailOnce() {
    if (!currentUserEmail) {
        showError('No user email found. Please log in again.');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, currentUserEmail);
    } catch (error) {
        console.error('Error sending reset email:', error);
        showError('Error sending reset email: ' + error.message);
    }
}

function isPasswordResetPage() {
    const title = document.querySelector('.email-change-card h1')?.textContent?.toLowerCase() || '';
    return title.includes('password');
}

function initProfilePage() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Sign Out Error:', error);
            });
    });
}

function initEditDetailsPage() {
    const form = document.querySelector('.edit-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearEditError();
        clearEditSuccess();

        if (!currentUser) {
            showEditError('You must be logged in to update your profile.');
            return;
        }

        const nameInput = document.getElementById('edit-name');
        const newName = nameInput ? nameInput.value.trim() : '';

        try {
            if (!newName) {
                showEditError('No changes were made.');
                return;
            }

            const playerRef = ref(db, 'players/' + currentUser.uid);
            await update(playerRef, { name: newName });
            showEditSuccess('Name changed successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showEditError('Error updating profile: ' + error.message);
        }
    });
}

function initResetRequestPage() {
    const resendBtn = document.getElementById('resend-email-btn');
    if (!resendBtn) return;

    const passwordPage = isPasswordResetPage();

    resendBtn.addEventListener('click', async () => {
        clearMessages();

        if (!currentUserEmail) {
            showError('No user email found. Please log in again.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, currentUserEmail);
            showSuccess(passwordPage ? 'Password reset email resent successfully!' : 'Email resent successfully!');
        } catch (error) {
            console.error('Error resending reset email:', error);
            showError('Error resending reset email: ' + error.message);
        }
    });
}

function setupAuthStateFlow() {
    const isProfilePage = !!document.getElementById('display-name');
    const isEditPage = !!document.getElementById('edit-name');
    const isResetPage = !!document.getElementById('resend-email-btn');

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;
        currentUserEmail = user.email || null;

        if (isProfilePage) {
            await loadProfileData(user);
        }

        if (isEditPage) {
            await loadEditDetailsData(user);
        }

        if (isResetPage) {
            await sendResetEmailOnce();
        }
    });
}

function init() {
    initProfilePage();
    initEditDetailsPage();
    initResetRequestPage();
    setupAuthStateFlow();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
