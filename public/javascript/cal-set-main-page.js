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
    console.log(OptionStatus);
}

function ScrappingInit() {
    console.log("Here@scrappinginit");
    // window.location = "../pages/result-page.html";
    var start_gte,end_lte,resource_id;
    let resource_id_json = {
        "codechef":2,
        "codeforces":1,
        "leetcode":102,
        "gfg":126,
    }
    let time_frame = "";
    for(let id  in OptionStatus["timeframe"]) {
        if(OptionStatus["timeframe"][id] == 1) time_frame = id;
    }
    console.log(time_frame);
    if(time_frame != ""){
        let days_to_add
        if(time_frame == "one-week-btn") days_to_add = 7;
        else days_to_add = 30;
        let date_ = new Date();
        start_gte = date_.getFullYear()+"-"+(date_.getMonth()+1)+"-"+date_.getDate()+"T"+date_.getHours()+":"+date_.getMinutes()+":"+date_.getSeconds();
        date_.setDate(date_.getDate() + days_to_add );
        end_lte = date_.getFullYear()+"-"+(date_.getMonth()+1)+"-"+date_.getDate()+"T"+date_.getHours()+":"+date_.getMinutes()+":"+date_.getSeconds();
    }
    let platforms_selected = new Array();
    for(let id  in OptionStatus["platform"]) {
        if(OptionStatus["platform"][id] == 1) {
            platforms_selected.push(id);
        }
    }
    console.log(platforms_selected);
    console.log(start_gte,end_lte);
    let res = new Array();
    platforms_selected.forEach((id)=>{
        resource_id = resource_id_json[id.replace("-btn","")];
        console.log(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`);
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`)}`)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
        })
        .then(data =>{return JSON.parse(data.contents);})
        .then(jsonData => {
            jsonData["objects"].forEach((cont)=>{
                res.push(cont);
            });
        });
    });
    console.log(res);
    console.log("Scrap Finished!");
    const div_ = document.getElementById("test1-div");
    console.log(div_);

}