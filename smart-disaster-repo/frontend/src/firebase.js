import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUsLcpEdY2PNNB5zd5UYW7nWKSIJ3WB_E",
  authDomain: "idealab-96651.firebaseapp.com",
  projectId: "idealab-96651",
  storageBucket: "idealab-96651.firebasestorage.app",
  messagingSenderId: "950123119199",
  appId: "1:950123119199:web:4e05242e49c58beeda51ea",
  measurementId: "G-GJZ0D78D9Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);