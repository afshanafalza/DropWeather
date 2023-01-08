// ALL OF THIS CODE IS RELATED TO SEARCH BAR

console.log("test");

let openSearchButton = document.getElementById("open-search-button");
let searchBarArea = document.getElementById("search-bar-area");
let enterSearchButton;
let inputField;
console.log(searchBarArea);

// Once you click the circle search icon
openSearchButton.addEventListener('click', () => {
    searchBarArea.innerHTML = `<input type="text" class="rect6" id="search-box"><button class="material-icons md-26 md-dark" id="enter-search-button">search</button></input>`;
    enterSearchButton = document.getElementById("enter-search-button");
    inputField = document.getElementById("search-box");

    // Submitting whatever you have in input field
    enterSearchButton.addEventListener('click', () => {
        let locValue = inputField.value;
        console.log(locValue);
    });

    // Entering input field
    inputField.addEventListener('keyup', (e) => {
        if(e.keyCode == 13 && inputField.value!=``) {
            let locValue = inputField.value;
            console.log(locValue);
        }
    });
});