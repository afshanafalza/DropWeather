var clock = document.getElementById('clock');
let hours;

setInterval(function() {
    var currentTime = new Date(),
    hours = currentTime.getHours(),
    minutes = currentTime.getMinutes(),
    ampm = hours > 11 ? 'PM' : 'AM';

    let diff = currentTime.getTimezoneOffset()/60; // Get hours difference from UTC
    hours += diff; // Make hours equal UTC time
    hours += gmt; // Change time to location based on GMT value

    ampm = (parseInt(hours / 12 % 2)) == 0 ? 'AM' : 'PM'; // Fix AM/PM according to current time
    hours %= 12; // Hours are from 0 to 11
    hours = hours == 0 ? 12 : hours; // If hour is 0, change to 12
    minutes = minutes < 10 ? '0' + minutes : minutes; // Add 0 to minutes if between 0 and 9


    clock.innerHTML = hours + ":" + minutes + "" + `<div class="ampm">`+ ampm + `</div>`;
}, 1000);