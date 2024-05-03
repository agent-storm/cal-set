// firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
    getFirestore,
    collection,
    addDoc

 } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAVu__PBcgl0Wn2UmUBI6vbjsVQJG1FY_0",
    authDomain: "cal-set.firebaseapp.com",
    projectId: "cal-set",
    storageBucket: "cal-set.appspot.com",
    messagingSenderId: "482704809296",
    appId: "1:482704809296:web:5b249b4efa878d53dfe055",
    measurementId: "G-V0G9LK9J12"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
// console.log(app,db);
export {getFirestore,collection}




