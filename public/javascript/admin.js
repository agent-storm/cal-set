import { 
    getFirestore,
    collection,
    addDoc,
    getDocs, 
    deleteDoc, 
    Timestamp,
    query
 } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


const db = getFirestore()
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
    return contest_date; //Returns a promise with the data.
}

async function DeleteDocs(collectionPath) {

    const q = query(collection(db, collectionPath));

    const querySnapshot = await getDocs(q);
    const batch = [];
    querySnapshot.forEach((doc) => {
        batch.push(deleteDoc(doc.ref));
    });

    // Execute all delete operations
    await Promise.all(batch);
    console.log('All documents in the collection have been deleted.');
}

async function WeekelyScrapper() {
    alert("Your about to rewrite new data, proceed with caution.");
    let date_ = new Date();
    let start_gte = date_.toISOString();
    let platforms_list = ["codechef","leetcode","codeforces","gfg"]; // For testing sake, can add all the platform names.

    console.log("WeekelyScrapper init");
    await DeleteDocs("testcol"); // Delete previous records so we can add new records weekely
    try {
        const result = await ClistApiCalls(start_gte, "full", platforms_list);
        let contests = JSON.parse(result);
        for (const contest of Object.values(contests)) {
            let platform_name = (contest["host"].split(".")[0]).charAt(0).toUpperCase() + (contest["host"].split(".")[0]).slice(1);
            let contest_name = contest["event"];
            let contest_duration = parseInt(contest["duration"]) / 60 + " mins";
            let contest_link = contest["href"];
            console.log("platform_name: ", platform_name, "contest_name: ", contest_name, "contest_start: ", contest["start"], "contest_end: ", contest["end"], "contest_duration: ", contest_duration, "contest_link: ", contest_link);
            
            // Adding document to Firestore
            try {
                const docRef = await addDoc(collection(db, "testcol"), {
                    Platform:platform_name.toLowerCase(),
                    Contest:contest_name,
                    Start:Timestamp.fromDate(new Date(contest["start"])),
                    End:Timestamp.fromDate(new Date(contest["end"])),
                    Duration:parseInt(contest_duration),
                    Link:contest_link
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (error) {
                console.error("Database insert failed: ", error);
            }
        }
    } catch (error) {
        console.error("Error fetching contests: ", error);
    }
}

export function WeekelyScrapperConfirmationDialogue(){
    var option = prompt("About to run the Weekelyscrapping method, Choose action (y/n)?");
    if(option == "y" || option == 'Y'){
        WeekelyScrapper();
    }
}


export async function addSuperUser() {
    // Prompt the user for an email
    const email = window.prompt("Enter the email to add as a Super User:");

    // Check if input is valid
    if (!email) {
        alert("No email entered. Operation canceled.");
        return;
    }

    try {
        // Reference to the "super_users" collection
        const superUsersRef = collection(db, "super_users");

        // Add the email to Firestore
        await addDoc(superUsersRef, { email });

        alert(`Super User ${email} added successfully!`);
        console.log(`Super User ${email} added to Firestore.`);
    } catch (error) {
        console.error("Error adding Super User:", error);
        alert("Failed to add Super User. Check console for details.");
    }
}
