
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
// var cron = require('node-cron');

import { 
    getFirestore,
    collection,
    getDocs,
    Timestamp,
    query,
    where,
    orderBy
 } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {getAuth,
        signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"


const db = getFirestore();
const auth = getAuth();

async function ScrappingInit() {
    // sessionStorage.removeItem("dataJSON");
    GoBtnController("logo"); // Change the Go button inner html to a loading gif.
    
    TransferChosenOptions(); //Stores the user chosen options in sessionStorage so that we can access it here.


    let optionSelection = JSON.parse(sessionStorage.getItem("selected-options")); // This is a JSON file that stores the user selected options.

    var start_gte, end_lte,days_to_add,preset_options="";
    var platforms_selected = [];
    var time_frame = "";

    for(var presetname in optionSelection["preset"]){
        if(optionSelection["preset"][presetname] == 1){
            preset_options = presetname;
            break;
        }
    }


    if(preset_options != ""){ 
        // If some preset has been chosen, execute if part
        // Break down the preset chosen and initialize start,end,platforms_selected manually.
        // NOTE: the preset_options will contain the btnId of the preset btn that will
        // follow the "platform_name-timeframe-preset-btn" format so we can jsut split and 
        // choose the values.
        platforms_selected = [preset_options.split("-")[0]]; // name of the platform like chodechef or codeforces.
        let timeframe = preset_options.split("-")[1];        //Timeframe like 1w, full, etc;
        
        //timefram == "full" you can only pass the start_gte and not give the end_lte value 
        // to get all the available future contests, but it has to have a modified 
        // GET req URL.
        if      (timeframe == "1w")   days_to_add = 7;
        else if (timeframe == "2w")   days_to_add = 14;
        else if (timeframe == "1m")   days_to_add = 30;
        else if (timeframe == "full") end_lte = "full"; //We pass end_lte as "full" when calling the ClistApiCalls() method.

    } 
    else 
    { 
        // Ifno Preset option in chosen, proceed with the usual procedure.
        for (let id in optionSelection["timeframe"]) {
            if (optionSelection["timeframe"][id] == 1) time_frame = id;
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
        for (let id in optionSelection["platform"]) {
            if (optionSelection["platform"][id] == 1) {
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
    console.log(platforms_selected,start_gte,end_lte)
    //TODO:We have the threee options, printed above in the console .log statement. 
    //Next step is to make queries based on these three options.
    const dbReference = collection(db,"testcol");
    const dataJson = {};
    for(const index in platforms_selected){
        console.log(platforms_selected[index]);
        if(end_lte == "full"){
            var queryRes = await query(
                dbReference,
                where("Platform","==",platforms_selected[index]),
            );
        } else {
            var queryRes = await query(
                dbReference,
                where("Platform","==",platforms_selected[index]),
                where("Start",">=",Timestamp.fromDate(new Date(start_gte))),
                where("End","<=",Timestamp.fromDate(new Date(end_lte))),
                orderBy("Start")
            );
        }
        const querySnapshot= await(getDocs(queryRes));
        dataJson[platforms_selected[index]] = [];
        querySnapshot.forEach((doc)=>{
            dataJson[platforms_selected[index]].push(doc.data());
        });
        
    };
    console.log(dataJson);
    GoBtnController("go");
    sessionStorage.setItem("dataJSON",JSON.stringify(dataJson));
    window.location = "../pages/result-page.html";
}

function LogoutUser(){
    signOut(auth).then(()=>{
        window.location = "../index.html";
    }).catch((err)=>{
        throw err;
    })
}

const goBtn = document.getElementById("go-btn");
const logoutBtn = document.getElementById("logout-btn");

goBtn.addEventListener('click',ScrappingInit);
logoutBtn.addEventListener('click',LogoutUser);
