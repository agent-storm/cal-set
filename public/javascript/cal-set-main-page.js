const auth = firebase.auth();
function SignOutPressed() {
    console.log(auth.currentUser);
    auth.signOut();
    window.location = '../index.html';
}
const OptionStatus = {
    "timeframe" : {
        "one-week-btn":0,
        "one-month-btn":0
    },
    "platform" : {
        "codechef-btn":0,
        "codeforces-btn":0,
        "hackerrank-btn":0,
        "gfg-btn":0
    },
    "preset" : {
        "codeforces-preset-btn":0,
        "codechef1w-preset-btn":0,
        "codechef-full-preset-btn":0
    }
}
function OptionChosen(section,btnId) {
    const btn = document.getElementById(btnId);
    if(section == "timeframe"){
        for (var id in OptionStatus["timeframe"]){
            if(id!=btnId){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = "#A9ACA9";
                OptionStatus["timeframe"][id] = 0;
            }
        }
    }
    if(OptionStatus[section][btnId] == 0){
        OptionStatus[section][btnId] = 1;
        btn.style.backgroundColor = "#DD1155";
    }
    else {
        OptionStatus[section][btnId] = 0;
        btn.style.backgroundColor = "#A9ACA9";
    }
}