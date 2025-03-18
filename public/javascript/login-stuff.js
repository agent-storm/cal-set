import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { 
    doc,
    setDoc,
    getDoc,
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
function GoogleLoginPopup(){
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
      });
    signInWithPopup(auth,provider);
}
function GithubLoginPopup(){
    const provider = new GithubAuthProvider();
    signInWithPopup(auth,provider);
}
document.getElementById("google-login-btn").addEventListener("click",()=>{
    GoogleLoginPopup();
})
document.getElementById("github-login-btn").addEventListener("click",()=>{
    GithubLoginPopup();
})
// function TwitterLoginPopup(){
//     const provider = new firebase.auth.TwitterAuthProvider();
//     auth.signInWithPopup(provider);
// }
// function FacebookLoginPopup(){
//     const provider = new firebase.auth.FacebookAuthProvider();
//     auth.signInWithPopup(provider);
// }

auth.onAuthStateChanged(user => {
    if (user) {
        addUserToFirestore(user).then(() => {
            console.log(window.location.pathname);
            window.location = "../pages/calset.html"; // Redirect after Firestore update
        }).catch(error => {
            console.error("Error adding user:", error);
        });
    }
});

async function addUserToFirestore(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid); // Reference to the user's document
    const userSnap = await getDoc(userRef); // Check if user exists

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || "Unknown",
            email: user.email
        });
        console.log(`User ${user.email} added to Firestore.`);
    } else {
        console.log(`User ${user.email} already exists in Firestore.`);
    }
}
