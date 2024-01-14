
// let list_item = `<li class=\"contest-list-item\"><button class=\"contest-details-button\"><span class=\"platform-name contest-details\">${}</span> <span class=\"contest-name contest-details\">${}</span> <span class=\"contest-date-time contest-details\">${}</span> <span class=\"contest-duration contest-details\">${}</span></button></li>`;
let all_list_items = "";
let contestList = "";
let contests = JSON.parse(sessionStorage.getItem("response"));
console.log(Object.values(contests));
Object.values(contests).forEach((contest)=> {
    let platform_name = (contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1);
    let contest_name = contest["event"];
    const utcTimestamp = new Date(contest["start"]);
    const contest_time_str = new Date(utcTimestamp.getTime() + (5.5 * 60 * 60 * 1000));
    const contest_time = (contest_time_str.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })).replace(","," @");
    let contest_duration = parseInt(contest["duration"])/60 + " mins";
    let list_item = `<li class=\"contest-list-item\"><button class=\"contest-details-button\"><span class=\"platform-name contest-details\">${platform_name}</span> <span class=\"contest-name contest-details\">${contest_name}</span> <span class=\"contest-date-time contest-details\">${contest_time}</span> <span class=\"contest-duration contest-details\">${contest_duration}</span></button></li>`;
    all_list_items += list_item;
});
console.log(all_list_items);
let ul = document.getElementById("contest-list");
ul.innerHTML = all_list_items;

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
