var clock = document.getElementById('clock');

setInterval(function() {
    var currentTime = new Date(),
    hours = currentTime.getHours(),
    minutes = currentTime.getMinutes(),
    ampm = hours > 11 ? 'PM' : 'AM';
    hours = hours > 12 ? hours-12 : hours;
    minutes += minutes < 10 ? '0' : '';

    let diff = currentTime.getTimezoneOffset()/60; //get hours difference from UTC
    hours += diff; //make hours equal UTC time

    clock.innerHTML = hours + ":" + minutes + " " + ampm;
}, 1000);