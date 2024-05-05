// let list_item = `<li class=\"contest-list-item\"><button class=\"contest-details-button\" ><span class=\"platform-name contest-details\">${}</span> <span class=\"contest-name contest-details\">${}</span> <span class=\"contest-date-time contest-details\">${}</span> <span class=\"contest-duration contest-details\">${}</span></button></li>`;
let all_list_items = "";
let contestList = "";
// let contests = JSON.parse(sessionStorage.getItem("response")); //Get the JSON data of contests.
let optionSelection = JSON.parse(sessionStorage.getItem("selected-options")); // This is a JSON file that stores the user selected options.
//After processing the contests data is stored in the "data" 2D array.
const data = [
    ["platform_name", "contest_name", "contest_duration","contest_date", "contest_time", "contest_link"]
];

//The following oiece of code will process the JSON data and store each contest details in the "data" array
// Object.values(contests).forEach((contest)=> {
//     let platform_name = (contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1);
//     let contest_name = contest["event"];
//     let utcTimestamp = new Date(contest["start"]);
//     let contest_time_str = new Date(utcTimestamp.getTime() + (5.5 * 60 * 60 * 1000));
//     let contest_time = (contest_time_str.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })).replace(","," @");
//     let contest_duration = parseInt(contest["duration"])/60 + " mins";
//     let list_item = `<li class=\"contest-list-item\"><a target="_blank" href=\"${contest["href"]}\" class=\"contest-link\"><button class=\"contest-details-button\"><span class=\"platform-name contest-details\">${platform_name}</span> <span class=\"contest-name contest-details\">${contest_name}</span> <span class=\"contest-date-time contest-details\">${contest_time}</span> <span class=\"contest-duration contest-details\">${contest_duration}</span></button></li>`;
//     all_list_items += list_item; //add the html for <li> to a string.
//     let contest_link = contest["href"];
//     data.push([platform_name,contest_name,contest_time.split("@")[0],contest_time.split("@")[1],contest_duration,contest_link]);
// });

// Forestore query system.
if(!optionSelection){
  alert('Something went wrong, please try again');
  window.location = "../pages/calset.html";
}
//Paramerter varaibles to store the query details.
var start_gte, end_lte,days_to_add,preset_options="";
var platforms_selected = [];
var time_frame = "";

for(presetname in optionSelection["preset"]){
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
    if(timeframe == "1w") days_to_add = 7;
    else if (timeframe == "2w") days_to_add = 14;
    else if (timeframe == "1m") days_to_add = 30;
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


//change the inner HTML of the <ul> element in result page to display the contests.
let ul = document.getElementById("contest-list");
ul.innerHTML = all_list_items;


// Used to downlaod the contests details in the form of xlsx sheet.
function ScheduleDownload() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contests");
    let  d = new Date();
    XLSX.writeFile(workbook, `contests_data_${d.toLocaleDateString()+"_"+(d.toLocaleTimeString()).replace(" ","_")}.xlsx`);

}






// Google API stuff (still working on it)
const CLIENT_ID = '482704809296-266p3dk7l7qrt11jtudh2s7k74ohe3q2.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAVu__PBcgl0Wn2UmUBI6vbjsVQJG1FY_0';

let tokenClient;
let gapiInited = false;
let gisInited = false;

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';



function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}
async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  }

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw (resp);
      }
      console.log("Authentication done");
      await CreateEvents();
    };

    if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({prompt: ''});
    }
}


async function CreateEvents() {
    console.log("EventCreator");
    Object.values(contests).forEach((contest)=>{
        const startDate = new Date(contest["start"] + "Z");
        const endDate = new Date(contest["end"] + "Z");
        const indianTimeZone = "Asia/Kolkata";
        const startDateString = startDate.toLocaleString("en-IN", { timeZone: indianTimeZone,hour12: false});
        const endDateString = endDate.toLocaleString("en-IN", { timeZone: indianTimeZone,hour12: false});

        function DateFormator(date) {
          let splitter = date.split(", ");
          let dates = splitter[0].split("/");
          let Finaldate = dates[2]+"-"+dates[1]+"-"+dates[0]+"T"+splitter[1];
          return Finaldate;
        }
        
        const event = {
            'summary': `${(contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1)}-${contest["event"]}`,
            'location': '',
            'description': `Link:${contest["href"]}, Duration: ${parseInt(contest["duration"])/60 + " mins"}`,
            'start': {
              'dateTime': `${DateFormator(startDateString)}`, // Adjusted for Indian Timezone (IST)
              'timeZone': 'Asia/Kolkata'
            },
            'end': {
              'dateTime': `${DateFormator(endDateString)}`, // Adjusted for Indian Timezone (IST)
              'timeZone': 'Asia/Kolkata'
            },
            'recurrence': [
              'RRULE:FREQ=DAILY;COUNT=1'
            ],
            'reminders': {
              'useDefault': false,
              'overrides': [
                // {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 30}
              ]
            }
          };
        console.log(event);
        const request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
        });
        request.execute(function(event) {
          console.log('Event created: ' + event.htmlLink);
        });
    });
    alert("Contests added to your account successfully, please check and verify, thank you for using the App.");
}

