// firebase.js
// Replace the placeholders with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAufKcmDz4o5KNSkabAFSbqTIzuqxvjpT8",
    authDomain: "excalibur-d27dc.firebaseapp.com",
    projectId: "excalibur-d27dc",
    storageBucket: "excalibur-d27dc.firebasestorage.app",
    messagingSenderId: "378295014715",
    appId: "1:378295014715:web:e17462fa6f0ad8fab8531e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
