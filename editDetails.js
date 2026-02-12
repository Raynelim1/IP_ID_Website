import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

let currentUser = null;

// Check authentication and load current user data
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = user;

    // Load current user data
    try {
        const playerRef = ref(db, 'players/' + user.uid);
        const snapshot = await get(playerRef);
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById('edit-name').value = data.name || '';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
});

// Helper function to show error messages
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Helper function to show success messages
function showSuccess(message) {
    const successDiv = document.getElementById('name-success-message');
    successDiv.innerHTML = '<span class="checkmark-inline">✓</span> ' + message;
    successDiv.style.display = 'block';
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 3 seconds
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

function clearSuccess() {
    const successDiv = document.getElementById('name-success-message');
    successDiv.textContent = '';
    successDiv.style.display = 'none';
}

// Handle form submission
document.querySelector('.edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    clearSuccess();

    if (!currentUser) {
        showError('You must be logged in to update your profile.');
        return;
    }

    const newName = document.getElementById('edit-name').value.trim();

    try {
        let changesMade = false;

        // Update name in database
        if (newName && newName !== '') {
            const playerRef = ref(db, 'players/' + currentUser.uid);
            await update(playerRef, { name: newName });
            changesMade = true;
        }

        if (changesMade) {
            showSuccess('Name changed successfully!');
        } else {
            showError('No changes were made.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showError('Error updating profile: ' + error.message);
    }
});
