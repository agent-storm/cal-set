const auth = firebase.auth();

function SignOutPressed() {
    console.log(auth.currentUser);
    auth.signOut();
    window.location = '../index.html';
}

function OptionChosen(btnId) {
    console.log("HERE");
    const Btn = document.getElementById(btnId);
    var style = getComputedStyle(Btn);
    JsonReader();
    // const obj = JSON.parse(JsonReader());
    // console.log(obj);
}
function JsonReader() { 
    fetch("../json/options.json") 
        .then((res) => { 
        console.log(res.json());
        // return res.json(); 
    });
}