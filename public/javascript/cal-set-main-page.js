
/*
    ToDo list(ideas):
    -> Add a option "Full" in the time frame options to get all the available contests.
    -> Custom Preset creation option. 

    DataBase Integration:
    Note: Most the stuff here is going to get deleted.{Will try to save it somehow ig, the ScrappingInit() method can be a optional option in site.}
    The Idea:
        -> Weekly once a script/function is executed, this function will get data of all the contests and store it in the firestore DB.
        -> When ever the user selects options and clicks "Go", we send the "OptionStatus" JSON to the results page(Session Storage).
        -> Result Page will process this JSON, then Retrive data from the Firestore DB according to the OptionStatus JSON.
    Process(DB creation and Data Storage):
        -> Delete any old "Collection" (from previous week) if exists.
        -> Create a new Collection with an appropriate name (something like a currentt date.)
        -> For each contest create a new "document" with all the contest data, document is like a JSON.
    PS: Watch Course on YT.

*/
function ScrappingInit() {
    sessionStorage.clear();
    GoBtnController("logo"); // Change the Go button inner html to a loading gif.

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
        
        //timefram == "full" you can only pass the start_gte and not give the end_lte value 
        // to get all the available future contests, but it has to have a modified 
        // GET req URL.
        if(timeframe == "1w") days_to_add = 7;
        else if (timeframe == "2w") days_to_add = 14;
        else if (timeframe == "1m") days_to_add = 30;
        else if (timeframe == "full") end_lte = "full"; //We pass end_lte as "full" when calling the ClistApiCalls() method.

    } else { // Id no Preset option in chosen, proceed with the usual procedure.
        for (let id in OptionStatus["timeframe"]) {
            if (OptionStatus["timeframe"][id] == 1) time_frame = id;
        }
        if(!time_frame) {
            alert("Please choose a timeframe dude.");
            GoBtnController("go");
        }
        if (time_frame != "") {
            // TODO: Can potentially add a "Full time" option here, this timeframe option will return all the contests available.
        
            if(time_frame == "one-week-btn") days_to_add = 7;
            else if (time_frame == "one-month-btn") days_to_add = 30;
            else if (time_frame == "two-week-btn") days_to_add = 14;
        }
        for (let id in OptionStatus["platform"]) {
            if (OptionStatus["platform"][id] == 1) {
                platforms_selected.push(id.replace("-btn", ""));
            }
        }
    }

    // Set start date and end date here, the "days_to_add" and 
    // platforms_selected can be chosen in the above if-else statement.

    let date_ = new Date();
    start_gte = date_.toISOString();
    // If full time is not chosen initialize the end time as following.
    if(end_lte != "full") {
        date_.setDate(date_.getDate() + days_to_add);
        end_lte = date_.toISOString();
    }
    
    ClistApiCalls(start_gte, end_lte,platforms_selected)
    .then(result => {
        console.log(result);
        sessionStorage.setItem("response",result);
        window.location = "../pages/result-page.html";
    })
    .catch(error => {
        alert(error,"Please refresh page.");
    });
}
// Returns a JSON String that contains all the contests in the requested platforms_selected list and the
// Specified timeframe.
function ClistApiCalls(start_gte, end_lte,platforms_selected){
    var resource_id_json = {
        "codeforces": 1,
        "codechef": 2,
        "leetcode": 102,
        "gfg": 126,
    }
    let fetchPromises = platforms_selected.map((id) => { //`https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`)}
        // resource_id = resource_id_json[id.replace("-btn", "")];
        var resource_id = resource_id_json[id];
        // If end_lte is specified as full, all available contest data is fetched.
        if(end_lte == "full"){
            var get_req_url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&order_by=start&duration__lte=10800`)}`;
        } else {
            var get_req_url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://clist.by/api/v4/contest/?username=agent_storm&api_key=7129eafffe8ab3889c0ac5c92b6d8e3b147e0fc5&resource_id=${resource_id}&start__gte=${start_gte}&end__lte=${end_lte}&order_by=start&duration__lte=10800`)}`;
        }
        return fetch(get_req_url)
            .then(response => {
                if (response.ok) return response.json();
                throw new alert('Network response was not ok.');
            })
            .then(data => JSON.parse(data.contents))
            .then(jsonData => jsonData.objects);
    });
    let contest_date = Promise.all(fetchPromises)
        .then(results => {
            let res = {};
            let count = 0;
            results.forEach(contests => {
                contests.forEach(cont => {
                    res["contest" + count] = cont;
                    count += 1;
                });
            });
            var contests_list = JSON.stringify(res);
            return contests_list;
        })
        .catch(error => alert('Error fetching data, please refresh the page.', error));
    return contest_date; //Returns a promise with the 
}

function WeekelyScrapper() {
    let date_ = new Date();
    let start_gte = date_.toISOString();
    // let platforms_list = ["codeforces","codechef","leetcode","gfg"]; // Real values
    let platforms_list = ["codeforces","codechef"]; // For testing sake
    console.log("WeekelyScrapper init");
    ClistApiCalls(start_gte,"full",platforms_list)
    .then(result => {
        // console.log(contests); 
        let contests = JSON.parse(result);
        Object.values(contests).forEach((contest)=> {
            let platform_name = (contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1);
            let contest_name = contest["event"];
            let contest_duration = parseInt(contest["duration"])/60 + " mins";
            let contest_link = contest["href"];
            console.log("platform_name: ",platform_name,"contest_name: ",contest_name,"contest_start: ",contest["start"],"contest_end: ",contest["end"],"contest_duration: ",contest_duration,"contest_link: ",contest_link);
            
            // TODO: Add this data to the Firestore.
            // Add a second document with a generated ID.
            // let db = firebase.firestore();
            // db.collection("testcol").add({
            //     name:"Dada",
            //     age:"Giri"
            // })
            // .then((docRef) => {
            //     console.log("Document written with ID: ", docRef.id);
            // })
            // .catch((error) => {
            //     console.error("Error adding document: ", error);
            // });
            sessionStorage.setItem("response",result);
            window.location = "../pages/result-page.html";
        });
    })
    .catch(error => {
        console.error(error);
    });
}




// handling all the button click events.
const dbBtn = document.getElementById("db-btn");
const goBtn = document.getElementById("go-btn")

dbBtn.addEventListener("click",WeekelyScrapper);
goBtn.addEventListener('click',ScrappingInit);
