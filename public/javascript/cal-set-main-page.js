const auth = firebase.auth();

function SignOutPressed() {
    console.log(auth.currentUser);
    auth.signOut();
    window.location = '../index.html';
}

function OptionChosen(btnId) {
    console.log("HERE");
    const Btn = document.getElementById(btnId);
    if (Btn.style.backgroundColor != "#DD1155"){
        Btn.style.backgroundColor = "#DD1155";
    }
    // console.log(Btn.style.backgroundColor);
    
}