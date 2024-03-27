


function SignOutPressed() {
    console.log(auth.currentUser);
    auth.signOut();
    window.location = '../index.html';
}
const OptionStatus = {
    "timeframe" : {
        "one-week-btn":0,
        "one-month-btn":0,
        "two-week-btn":0

    },
    "platform" : {
        "codechef-btn":0,
        "codeforces-btn":0,
        "leetcode-btn":0,
        "gfg-btn":0
    },
    "preset" : {
        "codeforces-full-preset-btn":0,
        "codechef-1w-preset-btn":0
    }
}

function OptionsDeselector(options_name){

    switch(options_name){
        case "timeframe":
            for (var id in OptionStatus["timeframe"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = "#A9ACA9";
                OptionStatus["timeframe"][id] = 0;
            }
            break;
        case "platform":
            for (var id in OptionStatus["platform"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = "#A9ACA9";
                OptionStatus["platform"][id] = 0;
            }
            break;
        case "preset":
            for (var id in OptionStatus["preset"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = "#A9ACA9";
                OptionStatus["preset"][id] = 0;
            }
            break;
    }
    
    DescUpdate();
}
var preset_options; // For storing Preset options
function OptionChosen(section,btnId) {
    const btn = document.getElementById(btnId);

    if(section == "preset"){
        for (var id in OptionStatus["preset"]){
            if(id!=btnId){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = "#A9ACA9";
                OptionStatus["preset"][id] = 0;
            }
        }
        preset_options = btnId;
        // OptionsDeselector("timeframe");
        OptionsDeselector("platform");
    } else {
        OptionsDeselector("preset");
    }
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
    console.log("Heree: ",OptionStatus);
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
    //TODO:Soo, somehow findout how if a preset is chosen, if preset is chosen, initialize start_gte
    // end_lte, platforms_selected if not continue the below code.
    let go_button = document.getElementById("go-btn");
    go_button.innerHTML = "<img src=\"../assets/icons8-sand-timer-unscreen.gif\">";

    var start_gte, end_lte, resource_id;
    var platforms_selected = [];
    var time_frame = "";


    if(true){
        return;
    } else {
        for (let id in OptionStatus["timeframe"]) {
            if (OptionStatus["timeframe"][id] == 1) time_frame = id;
        }
        console.log("here: ",time_frame);
        if(!time_frame) {
            alert("Please choose a timeframe dude.");
            go_button.innerHTML = "Go!";
        }
        if (time_frame != "") {
            let days_to_add;
            if(time_frame == "one-week-btn") days_to_add = 7;
            else if (time_frame == "one-month-btn") days_to_add = 30;
            else if (time_frame == "two-week-btn") days_to_add = 14;
            let date_ = new Date();
            start_gte = date_.toISOString();
            date_.setDate(date_.getDate() + days_to_add);
            end_lte = date_.toISOString();
        }
    
        
        for (let id in OptionStatus["platform"]) {
            if (OptionStatus["platform"][id] == 1) {
                platforms_selected.push(id);
            }
        }
    }


    
    ClistApiCalls(start_gte, end_lte,platforms_selected,go_button);
}

function ClistApiCalls(start_gte, end_lte,platforms_selected,go_button){

    var resource_id_json = {
        "codechef": 2,
        "codeforces": 1,
        "leetcode": 102,
        "gfg": 126,
    }

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
            console.log(str);
            sessionStorage.setItem("response", str);
            go_button.innerHTML = "GO!";
            window.location = "../pages/result-page.html";
        })
        .catch(error => console.error('Error fetching data:', error));
}

