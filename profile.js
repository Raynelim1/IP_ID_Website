import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

/**
 * Helper: Formats raw seconds into (x)min (x)s.
 * Always shows 0min if the time is under 60 seconds.
 */
function formatTime(seconds) {
    if (!seconds || seconds === 0) return "0min 0.0s";
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}min ${secs}s`;
}

/**
 * Monitors the Authentication state.
 * Triggers every time the page loads or the user logs in/out.
 */
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 1. Initial Email display from the Auth object
        const userEmail = user.email;
        const emailField = document.getElementById('info-email');
        if (emailField) emailField.textContent = userEmail;

        try {
            // 2. Fetch data from Realtime Database path: players/[UID]
            const playerRef = ref(db, 'players/' + user.uid);
            const snapshot = await get(playerRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                
                // Update Name fields
                const playerName = data.name || "Student";
                document.getElementById('display-name').textContent = playerName;
                document.getElementById('info-name').textContent = playerName;

                // 3. Map Room Data (Best Times and Grades)
                // Array matches your HTML IDs: best-time-level3, grade-level3, etc.
                const levels = ['level3', 'level4', 'level5', 'level6'];
                
                levels.forEach(lvl => {
                    const roomData = data.rooms ? data.rooms[lvl] : null;
                    
                    if (roomData) {
                        // Display the formatted time
                        const timeEl = document.getElementById(`best-time-${lvl}`);
                        if (timeEl) timeEl.textContent = formatTime(roomData.bestTime);
                        
                        // Display the Grade/Achievement
                        const gradeEl = document.getElementById(`grade-${lvl}`);
                        if (gradeEl) gradeEl.textContent = `Grade: ${roomData.achievement || "-"}`;
                    }
                });
            } else {
                console.warn("No database record found for this user UID.");
            }
        } catch (error) {
            console.error("Firebase Data Fetch Error:", error);
        }
    } else {
        // 4. Redirect to login if user is not authenticated
        window.location.href = 'index.html';
    }
});

/**
 * Sign Out logic
 */
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error("Sign Out Error:", error);
            });
    });
}