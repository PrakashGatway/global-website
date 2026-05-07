import { initializeApp } from "firebase/app";
import {
    getMessaging,
    getToken,
    onMessage,
} from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

const firebaseConfig = {
    apiKey: "AIzaSyCVaKpBqJXlD9m8es3dPbKgkykeEyV_xFQ",
    authDomain: "gatwayglobal-7fd94.firebaseapp.com",
    projectId: "gatwayglobal-7fd94",
    storageBucket: "gatwayglobal-7fd94.firebasestorage.app",
    messagingSenderId: "877693755962",
    appId: "1:877693755962:web:ad97ec25d63d512a6c0b03",
    measurementId: "G-PYT3VB69Q8"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

if (typeof window !== "undefined") {
    messaging = getMessaging(app);
}

export { messaging, getToken, onMessage };