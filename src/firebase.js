// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5tXPAjFF3ypGqMBij2qRrJbsG-GnOzUQ",
  authDomain: "happy-grant.firebaseapp.com",
  projectId: "happy-grant",
  storageBucket: "happy-grant.firebasestorage.app",
  messagingSenderId: "772528770244",
  appId: "1:772528770244:web:259106a207399f90150d91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (process.env.REACT_APP_FIREBASE_AUTH_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export { app, auth };
