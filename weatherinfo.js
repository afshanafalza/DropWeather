console.log("weather info");

// Variables
let loc;

// let validLoc = makeValidString(loc);
let locTiles = document.querySelector(".flex7");
let locName;
let stateName;
let idName;
let locIDs = [];
let locNames = [];
let stateNames = [];

let locTileInfos 



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

    for(let i=0; i<data.length; i++) {
        // Storing area name
        locName = data[i]["LocalizedName"];
        stateName = data[i]["AdministrativeArea"]["LocalizedName"];
        idName = makeValidString(locName)+"-"+makeValidString(stateName);

        // Displaying location tiles
        locTiles.innerHTML = locTiles.innerHTML + `<div class="rect7" id="${idName}">
        <div class="title"> ${locName}, ${stateName} </div>
        </div>`
        
        // Pushing each ID into an array
        locIDs.push(idName);
        locNames.push(locName);
        stateNames.push(stateName);
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

function clickLocationTiles(idNames) {
    for(let i=0; i<idNames.length; i++) {
        let locationTile = document.getElementById(idNames[i]);
        locationTile.addEventListener('click', () => {
            locTiles.innerHTML = `<div class="rect7" id="${idNames[i]}">
            <div class="title"> ${locNames[i]}, ${stateNames[i]} </div>
            </div>`
        })
    }
}