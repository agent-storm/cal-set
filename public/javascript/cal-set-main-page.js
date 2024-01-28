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
        "leetcode-btn":0,
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
    DescUpdate();
    
}
function DescUpdate() {
    let time_chosen;
    let platforms_chosen = [];
    for (var id in OptionStatus["timeframe"]){
        if(OptionStatus["timeframe"][id] == 1){
            time_chosen = id.replace("-btn","");
        }
    }
    for (var id in OptionStatus["platform"]){
        if(OptionStatus["platform"][id] == 1){
            platforms_chosen.push(id.replace("-btn",""));
        }
    }
    let desc = `You have chosen the platforms <u>${platforms_chosen}</u> for the timeframe <u>${time_chosen}</u>`;
    let desc_box = document.getElementById("action-discription");
    desc_box.innerHTML = "";
    desc_box.innerHTML = desc;
}
function ScrappingInit() {
    var start_gte, end_lte, resource_id;
    let resource_id_json = {
        "codechef": 2,
        "codeforces": 1,
        "leetcode": 102,
        "gfg": 126,
    }

    let time_frame = "";
    for (let id in OptionStatus["timeframe"]) {
        if (OptionStatus["timeframe"][id] == 1) time_frame = id;
    }

    if (time_frame != "") {
        let days_to_add = (time_frame == "one-week-btn") ? 7 : 30;
        let date_ = new Date();
        start_gte = date_.toISOString();
        date_.setDate(date_.getDate() + days_to_add);
        end_lte = date_.toISOString();
    }

    let platforms_selected = [];
    for (let id in OptionStatus["platform"]) {
        if (OptionStatus["platform"][id] == 1) {
            platforms_selected.push(id);
        }
    }

    let go_button = document.getElementById("go-btn");
    go_button.innerHTML = "<img src=\"../assets/icons8-sand-timer-unscreen.gif\">";

    let fetchPromises = platforms_selected.map((id) => { //`https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`)}
        resource_id = resource_id_json[id.replace("-btn", "")];


        return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`)}`)
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('Network response was not ok.');
            })
            .then(data => JSON.parse(data.contents))
            .then(jsonData => jsonData.objects);
    });


    Promise.all(fetchPromises)
        .then(results => {
            let res = {};
            let count = 0;
            results.forEach(contests => {
                contests.forEach(cont => {
                    res["contest" + count] = cont;
                    count += 1;
                });
            });
            let str = JSON.stringify(res);
            sessionStorage.setItem("response", str);
            go_button.innerHTML = "GO!";
            window.location = "../pages/result-page.html";
        })
        .catch(error => console.error('Error fetching data:', error));
}