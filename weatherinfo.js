console.log("weather info");

// Location Variables
let loc;
let locTiles = document.querySelector(".flex7");
let locName;
let stateName;
let idName;
let selectedLocKey;
let locIDs = [];
let locNames = [];
let stateNames = [];
let locKeys = []; 
let gmtOffSets = [];
let locationDisplayArea = document.querySelector(".location");

// Date Variables
const d = new Date();
let day = d.getDay();
let gmt = 0;

// Mapping the days
let dayMap = new Map([
    [0, "Sunday"],
    [1, "Monday"],
    [2, "Tuesday"],
    [3, "Wednesday"],
    [4, "Thursday"],
    [5, "Friday"],
    [6, "Saturday"]
]);




// AccuWeather API
// Grabbing location data based off input
const getLocationData = async () => {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/US/search?apikey=${apiKey}&q=${locValue}`);
    const data = await response.json();
    console.log(data);

    locTiles.innerHTML = ``;
    locIDs = [];
    locNames = [];
    stateNames = [];
    locKeys = [];
    gmtOffSets = [];

    for(let i=0; i<data.length; i++) {
        // Storing area name
        locName = data[i]["LocalizedName"];
        stateName = data[i]["AdministrativeArea"]["LocalizedName"];
        idName = makeValidString(locName)+"-"+makeValidString(stateName);
        locKey = data[i]["Key"];
        gmtOffSet = data[i]["TimeZone"]["GmtOffset"];

        console.log(locKey);

        // Displaying location tiles
        locTiles.innerHTML = locTiles.innerHTML + `<div class="rect7" id="${idName}">
        <div class="title"> ${locName}, ${stateName} </div>
        </div>`
        
        // Pushing each ID into an array
        locIDs.push(idName);
        locNames.push(locName);
        stateNames.push(stateName);
        locKeys.push(locKey);
        gmtOffSets.push(gmtOffSet);
    }

    console.log(locIDs);
    clickLocationTiles(locIDs);
}

// Turns location into something readable for URLs
function makeValidString(str) {
    for(let i=0; i<str.length; i++) {
        if(str.charAt(i)==' ') {
            if(i==str.length-1) {
                return str.slice(0, i);
            }
            str = str.slice(0, i)+"-"+str.slice(i+1);
        }
    }
    return str;
}


const getForecastData = async () => {
    const response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${selectedLocKey}?apikey=${apiKey}`);
    const data = await response.json();
    console.log(data);

    for(let i=0; i<5; i++) {
        //  Grabbing the day of the week
        let dayTile = document.getElementById(`day${i}`);
        let dayOTW = dayMap.get((day+i)%7);

        // Grabbing icon
        let iconNumber = data["DailyForecasts"][i]["Day"]["Icon"];
        console.log("icon number: "+iconNumber);
        
        // Grabbing max temperature
        let temperature = data["DailyForecasts"][i]["Temperature"]["Maximum"]["Value"];
        console.log("temperature"+temperature);

        if(i==0) {
            dayTile.innerHTML = `<div class="title"> ${dayOTW} </div>
            <div class="icon"> <img src="assets/accuiconsnew/${iconNumber}-s.png"/> </div>`;    
        }
        else {
            //url("assets/backgrounds/morning-sunny.gif")
            dayTile.innerHTML = `<div class="title"> ${dayOTW} </div>
            <div class="icon"> <img src="assets/accuiconsnew/${iconNumber}-s.png"/> </div><div class="temp"> ${temperature}°F </div>`;    
        }
    }
}

const clickLocationTiles = async (idNames) => {
    for(let i=0; i<idNames.length; i++) {
        let locationTile = document.getElementById(idNames[i]);
        locationTile.addEventListener('click', () => {
            locTiles.innerHTML = `<div class="rect7" id="${idNames[i]}">
            <div class="title"> ${locNames[i]}, ${stateNames[i]} </div>
            </div>`
            selectedLocKey = locKeys[i];
            console.log("this is selected: "+selectedLocKey);
            locationDisplayArea.innerHTML = `<img src="assets/location.png">${locNames[i]}, ${stateNames[i]}`;
            gmt = gmtOffSets[i];
            console.log(gmt);
            // Call function where we update weather conditions  
            getForecastData();  
        })
    }
}

function updateDays() {
    // All day updates here
    
}

updateDays();