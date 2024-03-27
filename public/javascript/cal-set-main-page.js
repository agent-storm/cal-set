

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
            preset_options = "";
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
        OptionsDeselector("timeframe");
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
    console.log("Heree: ",OptionStatus, preset_options);
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

    var start_gte, end_lte,days_to_add;
    var platforms_selected = [];
    var time_frame = "";


    if(preset_options != ""){ // If some preset has been chosen, execute if part
        // Break down the preset chosen and initialize start,end,platforms_selected manually.
        // NOTE: the preset_options will contain the btnId of the preset btn that will
        // follow the "platform_name-timeframe-preset-btn" format so we can jsut split and 
        // choose the values.
        platforms_selected = [preset_options.split("-")[0]]; // name of the platform like chodechef or codeforces.
        let timeframe = preset_options.split("-")[1];        //Timeframe like 1w, full, etc;
        console.log("CHUPAPI: ",platforms_selected,timeframe);
        //TODO:timefram == "full" you can only pass the start_gte and not give the end_lte value 
        // to get all the available future contests, but it has to have a modified 
        // GET req URL.
        if(timeframe == "1w") days_to_add = 7;
        else if (timeframe == "2w") days_to_add = 14;
        else if (timeframe == "1m") days_to_add = 30;
        else if (timeframe == "full") days_to_add = 1000; //Temporary fix for "full" request.

    } else { // Id no Preset option in chosen, proceed with the usual procedure.
        for (let id in OptionStatus["timeframe"]) {
            if (OptionStatus["timeframe"][id] == 1) time_frame = id;
        }
        if(!time_frame) {
            alert("Please choose a timeframe dude.");
            go_button.innerHTML = "Go!";
        }

        if (time_frame != "") {
            
            if(time_frame == "one-week-btn") days_to_add = 7;
            else if (time_frame == "one-month-btn") days_to_add = 30;
            else if (time_frame == "two-week-btn") days_to_add = 14;
            
        }
    
        
        for (let id in OptionStatus["platform"]) {
            if (OptionStatus["platform"][id] == 1) {
                platforms_selected.push(id.replace("-btn", ""));
            }
        }
        console.log(platforms_selected,start_gte,end_lte);
    }

    // Set start date and end date here, the "days_to_add" and 
    // platforms_selected can be chosen in the above if-else statement.

    let date_ = new Date();
    start_gte = date_.toISOString();
    console.log("HELOOOOOOOOOOO", start_gte);
    date_.setDate(date_.getDate() + days_to_add);
    end_lte = date_.toISOString();

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
        // resource_id = resource_id_json[id.replace("-btn", "")];
        resource_id = resource_id_json[id];
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

