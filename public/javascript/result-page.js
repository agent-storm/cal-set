let all_list_items = "";

// let contests = JSON.parse(sessionStorage.getItem("response")); //Get the JSON data of contests.

const dataJson = JSON.parse(sessionStorage.getItem("dataJSON"));
if(!dataJson){alert("Somethign went wrong, cannot fetch data, please try again"); window.location="../pages/calset.html";}
// console.log(dataJson);
//After processing the contests data is stored in the "data" 2D array.
const Contestsdata = [
    ["platform_name", "contest_name", "contest_duration","contest_date", "contest_time", "contest_link"]
];

Object.keys(dataJson).forEach((platform)=>{
  dataJson[platform].forEach((data)=>{
    const utcDate = new Date(data["Start"]["seconds"]*1000 + (5.5 * 60 * 60 * 1000));
    const localDate = utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    all_list_items += `<li class=\"contest-list-item\"><a target="_blank" href=\"${data["Link"]}\" class=\"contest-link\"><button class=\"contest-details-button\"><span class=\"platform-name contest-details\">${data["Platform"][0].toUpperCase()+data["Platform"].slice(1)}</span> <span class=\"contest-name contest-details\">${data["Contest"]}</span> <span class=\"contest-date-time contest-details\">${localDate.replace(",","")}</span><span class=\"contest-duration contest-details\">${data["Duration"]+" mins"}</span></button></li>`;
    Contestsdata.push(
      [data["Platform"][0].toUpperCase()+data["Platform"].slice(1),
      data["Contest"],
      data["Duration"]+" mins",
      localDate.split(",")[0],
      localDate.split(",")[1],
      data["Link"]
    ]);
  });
});
console.log(Contestsdata);

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


//change the inner HTML of the <ul> element in result page to display the contests.
let ul = document.getElementById("contest-list");
ul.innerHTML = all_list_items;


// Used to downlaod the contests details in the form of xlsx sheet.
function ScheduleDownload() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(Contestsdata);
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

//test method
async function CreateEvents() {
  console.log("EventCreator");
  Object.keys(dataJson).forEach((platform)=>{
    dataJson[platform].forEach((contest)=>{
        const utcstartDate = new Date(contest["Start"]["seconds"]*1000 + (5.5 * 60 * 60 * 1000));
        const utcendDate = new Date(contest["End"]["seconds"]*1000 + (5.5 * 60 * 60 * 1000));
        // const localstartDate = utcstartDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).toISOString();
        // const localendDate = utcendDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        const localstartDate = utcstartDate.toISOString();
        const localendDate = utcendDate.toISOString();
        
        const event = {
          'summary': `${(contest["Platform"].split(".")[0]).charAt(0).toUpperCase() + (contest["Platform"].split(".")[0]).slice(1)}-${contest["Contest"]}`,
          'location': '',
          'description': `Link:${contest["Link"]}, Duration: ${parseInt(contest["Duration"])/60 + " mins"}`,
          'start': {
            'dateTime': `${localstartDate}`, // Adjusted for Indian Timezone (IST)
            'timeZone': 'Asia/Kolkata'
          },
          'end': {
            'dateTime': `${localendDate}`, // Adjusted for Indian Timezone (IST)
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
  });
  alert("Contests added to your account successfully, please check and verify, thank you for using the App.");
}




