// ALL OF THIS CODE IS RELATED TO SEARCH BAR

console.log("test");


let openSearchButton = document.getElementById("open-search-button");
let searchBarArea = document.getElementById("search-bar-area");
let enterSearchButton = document.getElementById("enter-search-button");
let inputField = document.getElementById("search-box");
let locValue;
enterSearchButton.style.visibility = 'hidden';
inputField.style.width = 0;
console.log(searchBarArea);

// Once you click the circle search icon
openSearchButton.addEventListener('click', () => {
    enterSearchButton.style.visibility = 'visible';
    inputField.style.visibility = 'visible';
    inputField.style.width = '200px'; // Change width so animation will appear

    setTimeout(function () {
        document.getElementById("selected-cities").remove();
        document.getElementById("open-search-button").remove();
    }, 1000); // Wait 1 second for animation to finish before removing text

    // Submitting whatever you have in input field
    enterSearchButton.addEventListener('click', () => {
        locValue = makeValidString(inputField.value);
        console.log(locValue);
        inputField.value = ``;
        getLocationData();
    });

    // Entering input field
    inputField.addEventListener('keyup', (e) => {
        if(e.keyCode == 13 && inputField.value!=``) {
            locValue = makeValidString(inputField.value);
            console.log(locValue);
            inputField.value = ``;
            getLocationData();
        }
    });
});