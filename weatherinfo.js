console.log("weather info");

// Variables
let loc = "new york ";
let validLoc = makeValidString(loc);
let locTiles = document.querySelector(".flex7");
let locName;
let stateName;

console.log(validLoc);
console.log(locTiles);


// AccuWeather API
// Grabbing location data based off input
const getLocationData = async () => {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/US/search?apikey=${apiKey}&q=${loc}`);
    const data = await response.json();
    console.log(data);

    for(let i=0; i<data.length; i++) {
        // console.log(data[i]); // log all elements of data
        locName = data[i]["LocalizedName"];
        stateName = data[i]["AdministrativeArea"]["LocalizedName"];
        console.log(locName+", "+stateName);
        locTiles.innerHTML = locTiles.innerHTML + `<div class="rect7">
        <div class="title"> ${locName}, ${stateName} </div>
        </div>`
    }
}

// Calling API function for location
getLocationData();

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