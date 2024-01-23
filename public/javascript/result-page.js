// let list_item = `<li class=\"contest-list-item\"><button class=\"contest-details-button\" ><span class=\"platform-name contest-details\">${}</span> <span class=\"contest-name contest-details\">${}</span> <span class=\"contest-date-time contest-details\">${}</span> <span class=\"contest-duration contest-details\">${}</span></button></li>`;
let all_list_items = "";
let contestList = "";
let contests = JSON.parse(sessionStorage.getItem("response"));
const data = [
    ["platform_name", "contest_name", "contest_duration","contest_date", "contest_time", "contest_link"]
];
Object.values(contests).forEach((contest)=> {
    let platform_name = (contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1);
    let contest_name = contest["event"];
    let utcTimestamp = new Date(contest["start"]);
    let contest_time_str = new Date(utcTimestamp.getTime() + (5.5 * 60 * 60 * 1000));
    let contest_time = (contest_time_str.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })).replace(","," @");
    let contest_duration = parseInt(contest["duration"])/60 + " mins";
    let list_item = `<li class=\"contest-list-item\"><a target="_blank" href=\"${contest["href"]}\" class=\"contest-link\"><button class=\"contest-details-button\"><span class=\"platform-name contest-details\">${platform_name}</span> <span class=\"contest-name contest-details\">${contest_name}</span> <span class=\"contest-date-time contest-details\">${contest_time}</span> <span class=\"contest-duration contest-details\">${contest_duration}</span></button></li>`;
    all_list_items += list_item;
    let contest_link = contest["href"];
    data.push([platform_name,contest_name,contest_time.split("@")[0],contest_time.split("@")[1],contest_duration,contest_link]);
});

let ul = document.getElementById("contest-list");
ul.innerHTML = all_list_items;


function ScheduleDownload() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contests");
    let  d = new Date();
    XLSX.writeFile(workbook, `contests_data_${d.toLocaleDateString()+"_"+(d.toLocaleTimeString()).replace(" ","_")}.xlsx`);

}



// Google API stuff (still working on it)

const CLIENT_ID = '292309582190-1g3mul71cj6fkodcho4mj2e875pp3cj8.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBRbr_1JWw2pGTmdJvBWNjwBWlsdfG7iXE';

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
    const event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2015-05-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': '2015-05-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'lpage@example.com'},
          {'email': 'sbrin@example.com'}
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10}
          ]
        }
      };
      
      const request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      });
      
      request.execute(function(event) {
        console.log('Event created: ' + event.htmlLink);
      });
}

// async function AddToCalendar() {
//     console.log(gapi.auth2.getAuthInstance());
//     if(gapiInited && gisInited) {
//         gapi.auth2.getAuthInstance().signIn().then(function () {
//             console.log('User signed in.');
//             // You can now make API requests.
//           });
//     }
// }