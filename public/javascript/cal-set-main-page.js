const auth = firebase.auth();

function SignOutPressed() {
    
    console.log(auth.currentUser);
    auth.signOut();
    window.location = '../index.html';

}