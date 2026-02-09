// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtl_PFn_Bl3Jm02PNQq6POZaj0uSqeen4",
  authDomain: "y2s2-ip-54704.firebaseapp.com",
  databaseURL: "https://y2s2-ip-54704-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "y2s2-ip-54704",
  storageBucket: "y2s2-ip-54704.firebasestorage.app",
  messagingSenderId: "755542372272",
  appId: "1:755542372272:web:6eaf9b71932b53de88b075"
};

// app initialisation
export const app = initializeApp(firebaseConfig);