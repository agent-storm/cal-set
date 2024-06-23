import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const auth = getAuth();
function GoogleLoginPopup(){
    const provider = new GoogleAuthProvider();
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
    if(user){
        console.log("LOGGED IN");
        console.log(window.location.pathname);
        window.location = "../pages/calset.html";
    }
});