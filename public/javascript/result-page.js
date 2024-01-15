
// let list_item = `<li class=\"contest-list-item\"><button class=\"contest-details-button\" ><span class=\"platform-name contest-details\">${}</span> <span class=\"contest-name contest-details\">${}</span> <span class=\"contest-date-time contest-details\">${}</span> <span class=\"contest-duration contest-details\">${}</span></button></li>`;
let all_list_items = "";
let contestList = "";
let contests = JSON.parse(sessionStorage.getItem("response"));
console.log(Object.values(contests));
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
    data.push([platform_name,contest_name,contest_time.split("@")[0],contest_time.split("@")[1],contest_duration,contest["href"]]);
});
// console.log(all_list_items);
console.log(data);
let ul = document.getElementById("contest-list");
ul.innerHTML = all_list_items;


function ScheduleDownload() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contests");
    XLSX.writeFile(workbook, 'contest_data.xlsx');
}


// <!-- Add this script tag to include the Google API library -->
// <script async defer src="https://apis.google.com/js/api.js" onload="initClient()"></script>

// <!-- Your existing HTML and JS code -->

// <script>
// function initClient() {
//   // Initialize the Google API client library
//   gapi.client.init({
//     apiKey: 'YOUR_API_KEY',
//     clientId: 'YOUR_CLIENT_ID',
//     discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
//     scope: "https://www.googleapis.com/auth/calendar.events",
//   });
// }

// function authorizeAndCreateEvent(platformName, contestName, contestTime, contestDuration) {
//   // Use OAuth to authorize the user
//   gapi.auth2.getAuthInstance().signIn().then(() => {
//     // Use the Google Calendar API to create an event
//     gapi.client.calendar.events.insert({
//       'calendarId': 'primary',
//       'resource': {
//         'summary': `${platformName} - ${contestName}`,
//         'description': `Contest details: ${platformName} - ${contestName}`,
//         'start': {
//           'dateTime': contestTime,
//           'timeZone': 'Asia/Kolkata',
//         },
//         'end': {
//           'dateTime': calculateEndTime(contestTime, contestDuration),
//           'timeZone': 'Asia/Kolkata',
//         },
//       },
//     }).then(response => {
//       console.log('Event created:', response.result);
//       alert('Event created successfully!');
//     }).catch(error => {
//       console.error('Error creating event:', error);
//       alert('Error creating event. Please try again.');
//     });
//   });
// }

// function calculateEndTime(startTime, duration) {
//   const start = new Date(startTime);
//   const durationInMinutes = parseInt(duration);
//   const endTime = new Date(start.getTime() + durationInMinutes * 60 * 1000);
//   return endTime.toISOString();
// }

// // Continue with your existing code to create list items

// // Example usage inside your loop
// // Add a button to trigger the event creation
// let list_item = `<li class=\"contest-list-item\">
//   <button class=\"contest-details-button\" onclick=\"authorizeAndCreateEvent('${platform_name}', '${contest_name}', '${contest_time_str.toISOString()}', '${contest_duration}')\">
//     <!-- Your existing span elements -->
//   </button>
// </li>`;
// all_list_items += list_item;

// // Set innerHTML as before
// </script>
