// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB45kGZZWF8vAgGxVwFglH_yd9BtKeRqmo",
  authDomain: "fir-crud-8cba2.firebaseapp.com",
  projectId: "fir-crud-8cba2",
  storageBucket: "fir-crud-8cba2.firebasestorage.app",
  messagingSenderId: "738564968179",
  appId: "1:738564968179:web:2606c4f0232b5a2d967186",
  measurementId: "G-NW8CKNVFD1"
};

// Initialize Firebase
const firebaseConfigApp = initializeApp(firebaseConfig);
export default firebaseConfigApp