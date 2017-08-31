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
inputFields = ['workMinute', 'workSecond', 'breakMinute', 'breakSecond'];

workClock = new Clock(workDefault, 0);
breakClock = new Clock(breakDefault, 0);

currentClock = workClock;
startCountDown = null;
lastCountDown = 0;
inputAreEnabled = true;

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
    inputAreEnabled = false;
}

//enable input fields
function enableInput(fields) {
    for (var i = 0; i < fields.length; i++) {
        document.getElementById(fields[i]).disabled = false;
    }
    inputAreEnabled = true;
}

//set text to display the time
function displayClock() {
    var clockType = ""
    if (currentClock == workClock) {
        clockType = "Work ";
    }
    else {
        clockType = "Break ";
    }
    document.getElementById("session").innerHTML = clockType;
    document.getElementById("time").innerHTML = currentClock.display();
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
    if (inputAreEnabled && value >= 0) {
        if(clock == workClock) {
            workClock.minutes = value;
            workClock.resetTotalSeconds();
        }
        else {
            breakClock.minutes = value;
            breakClock.resetTotalSeconds();
        }
    }
    setInputFields()
    displayClock();
}

function setClockSecond(clock, value) {
    if (inputAreEnabled && value >= 0) {
        if(clock == workClock) {
            workClock.seconds = value;
            workClock.resetTotalSeconds();
        }
        else {
            breakClock.seconds = value;
            breakClock.resetTotalSeconds();
        }
    }
    setInputFields()
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

    currentClock = workClock;
    setInputFields();
    displayClock();
}

//set current clock to work time
function setToWork() {
    currentClock = workClock;
    displayClock();
}

//set current clock to break time
function setToBreak() {
    currentClock = breakClock;
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

function setInputFields() {
    document.getElementById('workMinute').value = workClock.minutes;
    document.getElementById('workSecond').value = workClock.seconds;
    document.getElementById('breakMinute').value = breakClock.minutes;
    document.getElementById('breakSecond').value = breakClock.seconds;
}

$(document).ready(function() {
    setInputFields();
    displayClock();

    $('#workMinute').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockMinute(workClock, validNumberCheck.number);
        }
    });

    $('#workSecond').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockSecond(workClock, validNumberCheck.number);
        }
    });

    $('#breakMinute').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockMinute(breakClock, validNumberCheck.number);
        }
    });

    $('#breakSecond').on('keyup', function() {
        var validNumberCheck = isValid($(this).val());
        if( validNumberCheck.boolean ) {
            setClockSecond(breakClock, validNumberCheck.number);
        }
    });  
});