const auth = firebase.auth();

function GoogleLoginPopup(){
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
}
function GithubLoginPopup(){
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider);
}
function TwitterLoginPopup(){
    const provider = new firebase.auth.TwitterAuthProvider();
    auth.signInWithPopup(provider);
}
function FacebookLoginPopup(){
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(user => {
    if(user){
        console.log("LOGGED IN");
        console.log(window.location.pathname);
        window.location = "pages/cal-set-main-page.html";
    }
});