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

// Background Variables
let bg = document.querySelector(".background-images");

// Default Variables
let defaultLoc;
let defaultLocName;
let defaultStateName;

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


// Auto Location stuff
var userZip = 0
fetch(
  "http://ip-api.com/json/?fields=city,zip"
)
.then(response => response.json())
.then((data) => {
    console.log("the zip from API is " + data.zip)
    userZip = data.zip
    getDefaultLocationData();
})

const getDefaultLocationData = async () => {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/postalcodes/US/search?apikey=${apiKey}&q=${userZip}`);
    const data = await response.json();
    console.log(data);

    // Vars
    defaultLoc = data[0]["Key"];
    defaultLocName = data[0]["LocalizedName"];
    defaultStateName = data[0]["AdministrativeArea"]["LocalizedName"];
    gmt = data[0]["TimeZone"]["GmtOffset"];

    locationDisplayArea.innerHTML = `<img src="assets/location.png">${defaultLocName}, ${defaultStateName}`;
    getForecastData(defaultLoc);
}


// AccuWeather API
// Grabbing location data based off input
const getLocationData = async () => {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/US/search?apikey=${apiKey}&q=${locValue}`);
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


const getForecastData = async (locKeyVal) => {
    const response = await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locKeyVal}?apikey=${apiKey}`);
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
            let condition = data["DailyForecasts"][i]["Day"]["IconPhrase"];
            let highTemp = data["DailyForecasts"][i]["Temperature"]["Maximum"]["Value"];
            let lowTemp = data["DailyForecasts"][i]["Temperature"]["Minimum"]["Value"];

            // Updating the today tile with data
            dayTile.innerHTML = `<div class="title"> ${dayOTW} </div>
            <div class="info">
                <table>
                    <tr>
                        <td><div class="temp"> ${temperature}°F </div></td>
                    </tr>
                    <tr>
                        <td><div class="condition"> ${condition} </div></td>
                    </tr>
                    <tr>
                        <td id="highLow">
                            <div class="high"> ↑ ${highTemp}°F </div>
                            <div class="low"> ↓ ${lowTemp}°F </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="icon"> <img src="assets/accuiconsnew/${iconNumber}-s.png"/> </div>`;   
            console.log("ICON NUMBER IS " +iconNumber);
            
            // Changing the background GIF
            if(iconNumber>=1 && iconNumber<=5) {
                bg.style.backgroundImage = `url("assets/backgrounds/sunny.gif")`;
            }
            else if (iconNumber>=6 && iconNumber<=8) {
                bg.style.backgroundImage = `url("assets/backgrounds/cloudy.gif")`;
            }
            else if(iconNumber==11) {
                bg.style.backgroundImage = `url("assets/backgrounds/foggy.gif")`;
            }
            else if(iconNumber>=12 && iconNumber<=18) {
                bg.style.backgroundImage = `url("assets/backgrounds/rainy.gif")`;
            }
            else if(iconNumber>=19 && iconNumber<=29) {
                bg.style.backgroundImage = `url("assets/backgrounds/snowing.gif")`;
            }
            else if(iconNumber>=32 && iconNumber<=44) {
                bg.style.backgroundImage = `url("assets/backgrounds/night.gif")`;
            }
        }
        else {
            //url("assets/backgrounds/morning-sunny.gif")
            if(iconNumber>=1 && iconNumber<=23) {
                dayTile.innerHTML = `<div class="title"> ${dayOTW} </div>
                <div class="icon"> <img src="assets/jennicons/${iconNumber}-s.png"/> </div><div class="temp"> ${temperature}°F </div>`;        
            }
            else {
                dayTile.innerHTML = `<div class="title"> ${dayOTW} </div>
                <div class="icon"> <img src="assets/accuiconsnew/${iconNumber}-s.png"/> </div><div class="temp"> ${temperature}°F </div>`;        
            }
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
            getForecastData(selectedLocKey);  
        })
    }
}
