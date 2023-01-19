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

// Hourly Table Variables
let hourlyTable = document.getElementById("hourly-table");

// Search Box Container
let searchBarFlex = document.getElementById("search-bar-flex");

// Weather Condition Variables
let UVTile = document.getElementById("UV-tile");
let airTile = document.getElementById("air-tile");
let rainTile = document.getElementById("rain-tile");
let windTile = document.getElementById("wind-direction");
let sunTile = document.getElementById("sun-tile");

// Sunset Sunrise Variables
let sunsetTime;
let sunriseTime;

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
  "https://ipapi.co/json/"
)
.then(response => response.json())
.then((data) => {
    console.log("the zip from API is " + data.postal)
    userZip = data.postal
    getDefaultLocationData();
})

// Displaying the default location forecast data
const getDefaultLocationData = async () => {
    const response = await fetch(`https://dataservice.accuweather.com/locations/v1/postalcodes/US/search?apikey=${apiKey}&q=${userZip}`);
    const data = await response.json();
    console.log(data);

    // Vars
    defaultLoc = data[0]["Key"];
    defaultLocName = data[0]["LocalizedName"];
    defaultStateName = data[0]["AdministrativeArea"]["LocalizedName"];
    gmt = data[0]["TimeZone"]["GmtOffset"];

    locationDisplayArea.innerHTML = `<img src="assets/location.png">${defaultLocName}, ${defaultStateName}`;
    getForecastData(defaultLoc);
    createTable(defaultLoc);
    displayConditions(defaultLoc);
    displayMode(defaultLoc);
}


// AccuWeather API
// Grabbing location data based off input
const getLocationData = async () => {
    const response = await fetch(`https://dataservice.accuweather.com/locations/v1/US/search?apikey=${apiKey}&q=${locValue}`);
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
        locTiles.innerHTML = locTiles.innerHTML + `<div class="rect7 box-night" id="${idName}">
        <div class="title title-night"> ${locName}, ${stateName} </div>
        </div>`
        
        // Pushing each ID into an array
        locIDs.push(idName);
        locNames.push(locName);
        stateNames.push(stateName);
        locKeys.push(locKey);
        gmtOffSets.push(gmtOffSet);
    }

    locTiles.style.opacity = 1;
    locTiles.style.right = "auto";

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

// Displaying forecast data
const getForecastData = async (locKeyVal) => {
    const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locKeyVal}?apikey=${apiKey}`);
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
                dayTile.innerHTML = `<div class="title title-night" id="title0"> ${dayOTW} </div>
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
                <div class="icon"> <img src="assets/jennicons/${iconNumber}-s.png"/> </div>`;   
            
            
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
                dayTile.innerHTML = `<div class="title title-night"> ${dayOTW} </div>
                <div class="icon"> <img src="assets/jennicons/${iconNumber}-s.png"/> </div><div class="temp"> ${temperature}°F </div>`;        
        }
    }
}

// Selecting a location
const clickLocationTiles = async (idNames) => {
    for(let i=0; i<idNames.length; i++) {
        let locationTile = document.getElementById(idNames[i]);
        locationTile.addEventListener('click', () => {
            locTiles.innerHTML = `<div class="rect7 box-night" id="${idNames[i]}">
            <div class="title title-night"> ${locNames[i]}, ${stateNames[i]} </div>
            </div>`
            selectedLocKey = locKeys[i];
            console.log("this is selected: "+selectedLocKey);
            locationDisplayArea.innerHTML = `<img src="assets/location.png">${locNames[i]}, ${stateNames[i]}`;
            gmt = gmtOffSets[i];
            searchBarFlex.style.width = '0px';
            console.log(gmt);
            // Call function where we update weather conditions  
            getForecastData(selectedLocKey);  
            createTable(selectedLocKey);
            displayConditions(selectedLocKey);
        })
    }
}


const createTable = async (locKeyVal) => {
    // Grabbing hourly forecast data
    const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locKeyVal}?apikey=${apiKey}`);
    const data = await response.json();
    console.log(data);

    // Resetting hourly table HTML
    hourlyTable.innerHTML = "";
    for(let i=0; i<data.length; i++) {
        // Icon Variable
        let iconNumber = data[i]["WeatherIcon"];

        // Condition Variable
        let hourlyTemp = data[i]["Temperature"]["Value"];

        // Hour Variable
        let dateTime = data[i]["DateTime"];
        let currHour = convertTime(dateTime);

        // Inserting values into table
        if(i!=data.length-1) {
            hourlyTable.innerHTML = hourlyTable.innerHTML+`<tr>
            <td>${currHour}</td>
            <td><img src="assets/jennicons/${iconNumber}-s.png"/></td>
            <td>${hourlyTemp}°F</td>
            </tr>`
            
        }
        else {
            hourlyTable.innerHTML = hourlyTable.innerHTML+`<tr class="last-table">
            <td>${currHour}</td>
            <td><img src="assets/jennicons/${iconNumber}-s.png"/></td>
            <td>${hourlyTemp}°F</td>
            </tr>`    
        }
    }
}

// Converting the time format to "XAM/PM"
function convertTime(dateTime) {
    let currHour = parseInt(dateTime.substring(dateTime.indexOf(`T`)+1, dateTime.indexOf(`:`)));
        
    // Converting hour to 12 scale
    if(currHour/12>=1) {
        if(currHour%12==0) {
            currHour = "12PM";
        }
        else {
            currHour = (currHour%12)+"PM";
        }
    }
    else {
        if(currHour%12==0) {
            currHour = "12AM";
        }
        else {
            currHour = (currHour%12)+"AM";
        }
    }

    return currHour;
}

// Converting the time format to "XAM/PM"
function convertTime2(dateTime) {
    let currHour = parseInt(dateTime.substring(dateTime.indexOf(`T`)+1, dateTime.indexOf(`:`)));
    let currMins = dateTime.substring(dateTime.indexOf(`:`), dateTime.indexOf(`:`)+3);
    console.log("CURRMINS: "+currMins);
        
    // Converting hour to 12 scale
    if(currHour/12>=1) {
        if(currHour%12==0) {
            currHour = `12${currMins}PM`;
        }
        else {
            currHour = (currHour%12)+`${currMins}PM`;
        }
    }
    else {
        if(currHour%12==0) {
            currHour = `12${currMins}AM`;
        }
        else {
            currHour = (currHour%12)+`${currMins}AM`;
        }
    }

    return currHour;
}

// Other Weather Conditions
const displayConditions = async (locKeyVal) => {
    const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locKeyVal}.json?apikey=${apiKey}&details=true`);
    const data = await response.json();
    console.log(data);

    // Icons
    let iconMap = new Map([
        ["Low", "low.png"],
        ["High", "high.png"],
        ["Good", "good.png"],
        ["Moderate", "moderate.png"],
        ["Unhealthy", "unhealthy.png"],
        ["Hazardous", "hazardous.png"],
    ]);

    // UV INDEX
    // UV Variables
    let UVVal = data["DailyForecasts"][0]["AirAndPollen"][5]["Value"];
    let UVCat = data["DailyForecasts"][0]["AirAndPollen"][5]["Category"];
    let UVMap = new Map([
        ["Low", "No need to hide indoors, but don't forget the sunscreen!"],
        ["High", "Time to break out the big guns: high SPF sunscreen, protective clothing, and shade seeking."],
        ["Good", "Enjoy the great outdoors, but don't forget to protect that skin!"],
        ["Moderate", "Your standard sunscreen, clothing, and shade routine will do the trick."],
        ["Unhealthy", "Time to step up your sun protection game."],
        ["Hazardous", "Stay indoors if possible, otherwise break out the full armor: high SPF sunscreen, protective clothing, and shade seeking."],
    ]);

    // Displaying UV Information
    UVTile.innerHTML = `<div class="title title-night"> UV Index </div>
    <div class="condition-data">
        <div class="current-color">
            <img src="assets/conditicons/${iconMap.get(UVCat)}"/>
        </div>
        <div class="current-value">
            ${UVVal}
            <br>
            ${UVCat}
        </div>
        <p class="current-text"> ${UVMap.get(UVCat)}</p>
     </div>`;

    // AIR QUALITY
    // Air Quality Variables
    let airVal = data["DailyForecasts"][0]["AirAndPollen"][0]["Value"];
    let airCat = data["DailyForecasts"][0]["AirAndPollen"][0]["Category"]; 
    let airMap = new Map([
        ["Low", "Keep it indoors, and freshen up the air with some purifiers."],
        ["High", "Time to break out the N95 mask and stay indoors."],
        ["Good", "Fresh air, fresh mind! Get outside and enjoy the good air."],
        ["Moderate", "Take it easy on the outdoor activities, and freshen up your home with some purifiers."],
        ["Unhealthy", "Time to break out the N95 mask and stay indoors."],
        ["Hazardous", "It's best to stay indoors, if possible, and freshen up the air with some purifiers."],
    ]);

    // Displaying Air Quality Information
    airTile.innerHTML = `<div class="title title-night"> Air Quality </div>
    <div class="condition-data">
        <div class="current-color">
            <img src="assets/conditicons/${iconMap.get(airCat)}"/>
        </div>
        <div class="current-value">
            ${airVal}
            <br>
            ${airCat}
        </div>
        <p class="current-text">${airMap.get(airCat)}</p>
    </div>`;

    // RAIN FALL
    // Rain Fall Variables
    let rainIn = data["DailyForecasts"][0]["Day"]["Rain"]["Value"];

    // Displaying Rain Fall Information
    rainTile.innerHTML = `<div class="title title-night"> Rainfall </div>
    <div class="condition-data">
        <div class="current-color">
            <img id="drops" src="assets/conditicons/drops.png">
        </div>
        <div class="current-value">
            ${rainIn}"
            <br>
            of rain
        </div>
        <p class="current-text"> There have been ${rainIn} inches of rain recorded at your location over the past 24 hours </p>
     </div>`

    // WIND
    // Wind Variables
    let windVal = data["DailyForecasts"][0]["Day"]["Wind"]["Speed"]["Value"];
    let windDir = data["DailyForecasts"][0]["Day"]["Wind"]["Direction"]["English"];

    // Displaying Wind Information
    // windTile.innerHTML = `<div class="title"> Wind </div>
    // <div class="condition-data">
    //     <div class="current-value">
    //         ${windVal} mph ${windDir}
    //         <br>
    //     </div>
    //     <div class="current-color">
    //         wind-icon
    //     </div>
    // </div>`;

    windTile.innerHTML = `<p> ${windVal} <span>mph</span></p>`;
    document.getElementsByClassName('arrow')[0].id = windDir; //change ID of arrow class

    // SUNSET AND SUNRISE
    // Sunset and Sunrise Variables
    sunsetTime = convertTime2(data["DailyForecasts"][0]["Sun"]["Set"]);
    sunriseTime = convertTime2(data["DailyForecasts"][0]["Sun"]["Rise"]);

    sunTile.innerHTML = `<div class="title title-night"> Sunset and Sunrise </div>
    <div class="condition-data">
        <div class="current-color">
            <img src="assets/conditicons/sunset.png">
        </div>
        <div class="current-value">
            Sunset: ${sunsetTime}
            <br>
            Sunrise: ${sunriseTime}
        </div>
    </div>
    <p class="current-text"> 
        Curfew? Plans? Make sure to get home on time
    </p>`;

}

const displayMode = async (locKeyVal) => {
    const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${locKeyVal}?apikey=${apiKey}`);
    const data = await response.json();
    let isDayTime = data[0]["IsDayTime"];

    // Display tiles
    let titleHeader = document.querySelectorAll(".title");
    let box = document.querySelectorAll(".box");
    let todayBox = document.querySelector("#day0");
    let todayTitle = document.querySelector("#title0");
    let blurbg = document.querySelector(".blur-bg");
    let searchArea = document.querySelector(".flex6");

    console.log(blurbg);

    console.log(todayTitle);

    if(isDayTime==false) {
        for(let i=0; i<titleHeader.length; i++) {
            titleHeader[i].classList.add("title-night");
        }
        for(let i=0; i<box.length; i++) {
            box[i].classList.add("box-night");
        }
        todayBox.style.background = `rgba(186, 192, 252, 0.7)`;
        todayBox.style.color = `#FFFFFF`;
        todayTitle.style.background = `rgba(137, 147, 245, 0.8)`;
        todayTitle.style.color = `#FFFFFF`;
        blurbg.style.backgroundColor = `rgba(102, 100, 127, 0.78)`;
        windTile.style.background = `rgb(148, 148, 180, 0.6)`;
        windTile.style.color = `#FFFFFF`;
        searchArea.style.background = `rgba(117, 117, 152, 0.5)`;
        searchArea.style.color = `#FFFFFF`;
    }
}


// function timeOfDay() {
//     // console.log("the time now is "+timeNow);
//     // console.log("sunset time is "+sunsetTime);
//     // console.log("sunrise time is "+sunriseTime);

//     // Now Time
//     let currHourInt = getHour(timeNow);
//     let currMinInt = getMinute(timeNow);
//     let currAMorPM = getAMorPM(timeNow);
//     let currTotalMins;

//     // Sunset Time
//     let setHourInt = getHour(sunsetTime);
//     let setMinInt = getMinute(sunsetTime);
//     let setAMorPM = getAMorPM(sunsetTime);
//     let setTotalMins;

//     // Sunrise Time
//     let riseHourInt = getHour(sunriseTime);
//     let riseMinInt = getMinute(sunriseTime);
//     let riseAMorPM = getAMorPM(sunriseTime);
//     let riseTotalMins;

//     // find the offset, if its <30 then sunrise/sunset

//     // console.log(currHourInt+" "+currMinInt+" "+currAMorPM);
//     // console.log(setHourInt+" "+setMinInt+" "+setAMorPM);
//     // console.log(riseHourInt+" "+riseMinInt+" "+riseAMorPM);

// }

// function getHour(timeStamp) {
//     return parseInt(timeStamp.substring(0, timeStamp.indexOf(':')));
// }

// function getMinute(timeStamp) {
//     return parseInt(timeStamp.substring(timeStamp.indexOf(':')+1, timeStamp.indexOf(':')+3));
// }

// function getAMorPM(timeStamp) {
//     return timeStamp.substring(timeStamp.indexOf(':')+3);
// }

// function subtractTime() {
//     // Curr Time: 6:07 PM
//     // Sunset Time: 4:46 PM
// }