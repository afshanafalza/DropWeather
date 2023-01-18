// ALL OF THIS CODE IS RELATED TO SEARCH BAR

console.log("test");


let openSearchButton = document.getElementById("open-search-button");
let searchBarArea = document.getElementById("search-bar-area");
let enterSearchButton = document.getElementById("enter-search-button");
let inputField = document.getElementById("search-box");
let locValue;
enterSearchButton.style.visibility = 'hidden';
inputField.style.width = 0;
inputField.style.opacity = 1;
console.log(searchBarArea);

// Once you click the circle search icon
openSearchButton.addEventListener('click', () => {
    enterSearchButton.style.visibility = 'visible';
    inputField.style.visibility = 'visible';
    inputField.style.opacity = 1;
    inputField.style.width = '200px'; // Change width so animation will appear

    setTimeout(function () {
        document.getElementById("selected-cities").style.visibility= 'hidden';
        document.getElementById("open-search-button").style.visibility= 'hidden';
    }, 1000); // Wait 1 second for animation to finish before removing text

    // Submitting whatever you have in input field
    enterSearchButton.addEventListener('click', () => {
        if(inputField.value!=``) {
            locValue = makeValidString(inputField.value);
            inputField.value = ``;
            enterSearchButton.style.visibility = 'hidden';
            inputField.style.visibility = 'hidden';
            document.getElementById("selected-cities").style.visibility= 'visible';
            document.getElementById("open-search-button").style.visibility= 'visible';
            inputField.style.opacity = 0;
            inputField.style.width = '0px';
            getLocationData();    
        }
    });

    // Entering input field
    inputField.addEventListener('keyup', (e) => {
        if(e.keyCode == 13 && inputField.value!=``) {
            locValue = makeValidString(inputField.value);
            inputField.value = ``;
            enterSearchButton.style.visibility = 'hidden';
            inputField.style.visibility = 'hidden';
            inputField.style.opacity = 0;
            inputField.style.width = '0px';
            document.getElementById("selected-cities").style.visibility= 'visible';
            document.getElementById("open-search-button").style.visibility= 'visible';
            getLocationData();
        }
    });
});