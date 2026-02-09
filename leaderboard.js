import { db } from "./firebase.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const roomSelect = document.getElementById('room-select');
const leaderboardBody = document.getElementById('leaderboard-body');
const searchInput = document.getElementById('search-input');

// Room names mapping for the table display
const roomNames = {
    level3: "Ice Melting",
    level4: "Acid Neutralization",
    level5: "Lock Corrosion",
    level6: "Light Production"
};

/**
 * Formats seconds into (x)min (x)s.
 * Always shows 0min if less than a minute.
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}min ${secs}s`;
}

async function updateLeaderboard() {
    const selectedRoom = roomSelect.value;
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, `players`));
        
        if (snapshot.exists()) {
            let roomScores = [];

            snapshot.forEach((childSnapshot) => {
                const playerData = childSnapshot.val();
                const roomData = playerData.rooms ? playerData.rooms[selectedRoom] : null;

                // Ensure data exists and player has a recorded time
                if (roomData && roomData.bestTime > 0) {
                    roomScores.push({
                        name: playerData.name || "Unknown Player",
                        level: roomNames[selectedRoom],
                        rawTime: parseFloat(roomData.bestTime),
                        grade: roomData.achievement || "N/A"
                    });
                }
            });

            // Sort by numerical time (fastest/lowest first)
            roomScores.sort((a, b) => a.rawTime - b.rawTime);

            renderTable(roomScores);
        } else {
            leaderboardBody.innerHTML = "<tr><td colspan='5'>No player data found in database.</td></tr>";
        }
    } catch (error) {
        console.error("Firebase Fetch Error:", error);
        leaderboardBody.innerHTML = "<tr><td colspan='5'>Error loading data. Check console for details.</td></tr>";
    }
}

function renderTable(data) {
    leaderboardBody.innerHTML = "";
    
    if (data.length === 0) {
        leaderboardBody.innerHTML = "<tr><td colspan='5'>No records for this room yet.</td></tr>";
        return;
    }

    data.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td class="player-name">${player.name}</td>
            <td>${player.level}</td>
            <td>${formatTime(player.rawTime)}</td>
            <td>${player.grade}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

// Re-render when room selection changes
roomSelect.addEventListener('change', updateLeaderboard);

// Search functionality for player names
searchInput.addEventListener('input', function() {
    const term = this.value.toLowerCase();
    const rows = leaderboardBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const name = row.querySelector('.player-name')?.textContent.toLowerCase() || "";
        row.style.display = name.includes(term) ? "" : "none";
    });
});

// Initial data fetch
updateLeaderboard();