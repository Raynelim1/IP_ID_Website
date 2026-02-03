// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtl_PFn_Bl3Jm02PNQq6POZaj0uSqeen4",
  authDomain: "y2s2-ip-54704.firebaseapp.com",
  databaseURL: "https://y2s2-ip-54704-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "y2s2-ip-54704",
  storageBucket: "y2s2-ip-54704.firebasestorage.app",
  messagingSenderId: "755542372272",
  appId: "1:755542372272:web:6eaf9b71932b53de88b075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export them so other files can use the same "connection"
export const db = getDatabase(app);
export const auth = getAuth(app);