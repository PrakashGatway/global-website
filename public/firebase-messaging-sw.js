importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyCVaKpBqJXlD9m8es3dPbKgkykeEyV_xFQ",
    authDomain: "gatwayglobal-7fd94.firebaseapp.com",
    projectId: "gatwayglobal-7fd94",
    storageBucket: "gatwayglobal-7fd94.firebasestorage.app",
    messagingSenderId: "877693755962",
    appId: "1:877693755962:web:ad97ec25d63d512a6c0b03",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    //console.log("Background Message:", payload);

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/images/logo.png",
        }
    );
});