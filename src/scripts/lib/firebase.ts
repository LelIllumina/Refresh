import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAq2cG0yPrsWo9sDojrXZE4n_K1GLdHPpI",
  authDomain: "leldotnekowebdotorg.firebaseapp.com",
  projectId: "leldotnekowebdotorg",
  storageBucket: "leldotnekowebdotorg.firebasestorage.app",
  messagingSenderId: "582384767686",
  appId: "1:582384767686:web:452904f17c2b5d9ae53dc7",
  measurementId: "G-RF2CSPB9NL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
