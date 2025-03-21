


// Contains the non-core methods, written seperately to reduce clutter in main js file.

function GoBtnController(option){
    var go_button = document.getElementById("go-btn");
    if(option == "logo"){
        go_button.innerHTML = "<img src=\"../assets/icons8-sand-timer-unscreen.gif\">";
    } else if(option == "go") {
        go_button.innerHTML = "Go!";
    }
}


//DescUpdate() is called to update the description on the calset page after a button is selected or
//deselected.
function DescUpdate() {
    let time_chosen = "(not selected)";
    let platforms_chosen = [];
    if(preset_options != ""){
        platforms_chosen = preset_options.split("-")[0];
        switch(preset_options.split("-")[1]){
            case "full":
                time_chosen = "full";
                break;
            case "1w":
                time_chosen = "1 week";
                break;
        }
    } else {
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
    }
    let desc = `You have chosen the platforms ${platforms_chosen} for the timeframe ${time_chosen}`;
    let desc_box = document.getElementById("action-description");
    desc_box.innerHTML = "";
    desc_box.innerHTML = desc;

}

function PageRedirector(destnationPage) {
    switch(destnationPage){
        case "about-page":
            window.location = "https://srinith-portfolio.web.app";
            break;
        case "contact-page":
            window.location = "https://srinith-portfolio.web.app";
            break;
            
    }
}