class Clock {
    constructor(min, sec) {
        this.minutes = min;
        this.seconds = sec;
        this.totalSeconds = min * 60 + sec;
    }

    isDone() {
        if (this.totalSeconds > 0) {
            return false;
        }
        else {
            return true;
        }
    }

    decrement() {
        this.totalSeconds--;
    }

    secondsToMinutes() {
        return Math.floor(this.totalSeconds / 60);
    }

    display() {
        var currentMinute = this.secondsToMinutes();
        var currentSecond = this.totalSeconds % 60;
        return padding(currentMinute) + ":" + padding(currentSecond);
    }

    resetTotalSeconds() {
        this.totalSeconds = Math.floor(this.minutes * 60 + this.seconds);
    }
}

class ValidNumber {
    constructor(bool, num) {
        this.boolean = bool;
        this.number = num;
    }
}

//Default minutes
workDefault = 25;
breakDefault = 5;

//id of inpute fields
inputFields = ['workMinute', 'breakMinute'];

workClock = new Clock(workDefault, 0);
breakClock = new Clock(breakDefault, 0);

currentClock = workClock;
startCountDown = null;
lastCountDown = 0;

//add zero to number if it is less than 10
function padding(number) {
    var result = ""
    if (number < 10) {
        result = "0" + number;
    }
    else {
        result = number.toString();
    }
    return result;
}

//disable input fields
function disableInput(fields) {
    for (var i = 0; i < fields.length; i++) {
        console.log(fields[i])
        document.getElementById(fields[i]).disabled = true;
    }
}

//enable input fields
function enableInput(fields) {
    for (var i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).disabled = false;
    }
}

//set text to display the time
function displayClock() {
    document.getElementById("timer").innerHTML = currentClock.display();
}

function pauseClock() {
    clearInterval(startCountDown);
    lastCountDown++;
    enableInput(inputFields);
}

//switch between work and break clocks
function switchClock() {
    var oldClock = currentClock;
    if (currentClock == workClock) {
        currentClock = breakClock;
    }
    else {
        currentClock = workClock;
    }

    oldClock.resetTotalSeconds();
}

//set initial minute values
function setClockMinute(clock, value) {
    if(clock == workClock) {
        workClock.minutes = value;
        workClock.resetTotalSeconds();
    }
    else {
        breakClock.minutes = value;
        breakClock.resetTotalSeconds();
    }
    displayClock();
}

//start counting down
function startClock() {
    disableInput(inputFields);
    if (lastCountDown != startCountDown) {
        startCountDown = setInterval(function () {
            if (currentClock.isDone()) {
                switchClock();
            }
            currentClock.decrement();
            displayClock();
        }, 1000);
    }
    lastCountDown = startCountDown;
}

//stop the clock and reset values
function stopClock() {
    pauseClock();
    workClock.resetTotalSeconds();
    currentClock = workClock;
    displayClock();
    breakClock.resetTotalSeconds();
}

//stop clock and reset to default values
function resetClock() {
    pauseClock();
    workClock.minutes = workDefault;
    workClock.seconds = 0;
    workClock.resetTotalSeconds();

    breakClock.minutes = breakDefault;
    breakClock.seconds = 0;
    breakClock.resetTotalSeconds();

    document.getElementById('workMinute').value = workClock.minutes;
    document.getElementById('breakMinute').value = breakClock.minutes;

    currentClock = workClock;
    displayClock();
}

//checks to see if input is a number
function isValid(input) {
    var check = parseFloat(input);
    var result = new ValidNumber(false, 0);
    if (input == "") {
        result.value = 0
        result.boolean = true;
    }
    else if (isNaN(check)) {
        alert("Please enter numbers only");
    }
    else {
        result.boolean = true;
        result.number = check;
    }
    return result;
}

$(document).ready(function() {
    document.getElementById('workMinute').value = workClock.minutes;
    document.getElementById('breakMinute').value = breakClock.minutes;
    displayClock();

    $('#workMinute').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockMinute(workClock, validNumberCheck.number);
        }
    });

    $('#breakMinute').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockMinute(breakClock, validNumberCheck.number);
        }
    });  
});