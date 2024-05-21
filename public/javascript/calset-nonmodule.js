
const OptionStatus = {
    "timeframe" : {
        "one-week-btn":0,
        "one-month-btn":0,
        "two-week-btn":0

    },
    "platform" : {
        "codechef-btn":0,
        "codeforces-btn":0,
        "leetcode-btn":0,
        "geeksforgeeks-btn":0
    },
    "preset" : {
        "codeforces-full-preset-btn":0,
        "codechef-full-preset-btn":0,
        "leetcode-full-preset-btn":0,
        "gfg-full-preset-btn":0,

        "codeforces-1w-preset-btn":0,
        "codechef-1w-preset-btn":0,
        "leetcode-1w-preset-btn":0,
        "gfg-1w-preset-btn":0
        
    }
}

var style_props = getComputedStyle(document.documentElement);

var default_btn_color = style_props.getPropertyValue('--options-button-color');
var chosen_btn_color = style_props.getPropertyValue("--hover-button-color");

function OptionsDeselector(options_name){
    switch(options_name){
        case "timeframe":
            for (var id in OptionStatus["timeframe"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = default_btn_color;
                OptionStatus["timeframe"][id] = 0;
            }
            break;
        case "platform":
            for (var id in OptionStatus["platform"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = default_btn_color;
                OptionStatus["platform"][id] = 0;
            }
            break;
        case "preset":
            for (var id in OptionStatus["preset"]){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = default_btn_color;
                OptionStatus["preset"][id] = 0;
            }
            preset_options = "";
            break;
    }
    
    DescUpdate();
}
var preset_options; // For storing Preset options
function OptionChosen(section,btnId) {
    const btn = document.getElementById(btnId);

    if(section == "preset"){
        for (var id in OptionStatus["preset"]){
            if(id!=btnId){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = default_btn_color;
                OptionStatus["preset"][id] = 0;
            }
        }
        preset_options = btnId;
        OptionsDeselector("timeframe");
        OptionsDeselector("platform");
    } else {
        OptionsDeselector("preset");
    }
    if(section == "timeframe"){
        for (var id in OptionStatus["timeframe"]){
            if(id!=btnId){
                var tempBtn = document.getElementById(id);
                tempBtn.style.backgroundColor = default_btn_color;
                OptionStatus["timeframe"][id] = 0;
            }
        }
    }

    if(OptionStatus[section][btnId] == 0){
        OptionStatus[section][btnId] = 1;
        btn.style.backgroundColor = chosen_btn_color;
    }
    else {
        OptionStatus[section][btnId] = 0;
        btn.style.backgroundColor = default_btn_color;
    }
    console.log("OptionCHosenFunc:",OptionStatus, preset_options);
    DescUpdate();
}

function TransferChosenOptions(){
    sessionStorage.clear();
    GoBtnController("logo");
    console.log("ScrapingInitMethod:");
    console.log(JSON.stringify(OptionStatus));
    sessionStorage.setItem("selected-options",JSON.stringify(OptionStatus));
    // window.location = "../pages/result-page.html";
    
}
