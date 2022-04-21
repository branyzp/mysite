const pomodoroTimer = document.querySelector('#pomodoro-timer');

const forestButton = document.querySelector('#forest-ambience');
const rainButton = document.querySelector('#rain-ambience');
const nightButton = document.querySelector('#night-ambience');
const lofiButton = document.querySelector('#lofi-ambience');
const quietButton = document.querySelector('#quiet');

const startButton = document.querySelector('#pomodoro-start');
const stopButton = document.querySelector('#pomodoro-stop');

let type = 'Work';
let timeSpentInCurrentSession = 0;
let currentTaskLabel = document.querySelector('#pomodoro-clock-task');

let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');

let isClockStopped = true;

workDurationInput.value = '25';
breakDurationInput.value = '5';

//This ensures that ambience sounds stop when another starts

/* function stopAllAudio() {
    allAudio.forEach(function(audio){
        audio.pause();
    });
}
*/

function stopAllAudio() {
    forest.pause();
    rain.pause();
    night.pause();
    lofi1.pause();
    lofi2.pause();
    lofi3.pause();
}

//This toggles the ambience sounds
let forest = new Audio('audio/garden-ambience.mp3');
let rain = new Audio('audio/rain-ambience.mp3');
let night = new Audio('audio/night-ambience.mp3');
let lofi1 = new Audio('audio/lofi-ambience1.mp3');
let lofi2 = new Audio('audio/lofi-ambience2.wav');
let lofi3 = new Audio('audio/lofi-ambience3.mp3');

forestButton.addEventListener('click',function() {
    stopAllAudio();
    forest.play();
})

rainButton.addEventListener('click',function() {
    stopAllAudio();
    rain.play();
})

nightButton.addEventListener('click',function() {
    stopAllAudio();  
    night.play();
})
lofiButton.addEventListener('click',function() {
    stopAllAudio();
    let randomize = Math.floor(Math.random()*3);
    if (randomize === 1){
        lofi1.play();
    } else if (randomize === 2){
        lofi2.play();
    } else {
        lofi3.play();
    }
})

quietButton.addEventListener('click', function(){
    stopAllAudio();
})







//Start
startButton.addEventListener('click',() => {
    toggleClock();
})

//Pause button was removed as it will now be toggled from within the Play button

//Stop
stopButton.addEventListener('click',() => {
    toggleClock(true);
})

//Update Work Time
workDurationInput.addEventListener('input', () => {
    updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value);
})

//Update Pause Time
breakDurationInput.addEventListener('input', () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value);
})

const minuteToSeconds = (mins) => {
    return mins * 60;
}

const setUpdatedTimers = () => {
    if (type == 'Work') {
        currentTimeLeftInSession = updatedWorkSessionDuration 
        ? updatedWorkSessionDuration : workSessionDuration;
        workSessionDuration = currentTimeLeftInSession;
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration
        ? updatedBreakSessionDuration : currentTimeLeftInSession;
    }
}

let isClockRunning = false;

//in seconds = 25min
let workSessionDuration = 1500;
let currentTimeLeftInSession=1500;

//in seconds = 5min
let breakSessionDuration = 300;

const toggleClock = (reset) => {
    togglePlayPauseIcon(reset);
    if (reset) {
        //stop the timer
        stopClock();
    } else {
        if (isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }

        if (isClockRunning === true) {
            //pause the timer
            clearInterval(clockTimer);
            isClockRunning = false;
        } else {
            //start the timer
            clockTimer = setInterval(() => {
                //decrease time left / increase time spent
                stepDown();
                displayCurrentTimeLeftInSession();
            }, 1000)
            isClockRunning = true; 
        }
        showStopIcon();
    }
}

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);
    //add leading zeroes if it's less than 10
    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    pomodoroTimer.innerText = result.toString(); 
}

const stopClock = () => {
    //update the timers based on user input
    setUpdatedTimers();
    //display the time spent so far in this session
    displaySessionLog(type);
    //reset the timer
    clearInterval(clockTimer);
    //check if clock is stopped
    isClockStopped = true;
    //update variable to know that timer is stopped
    isClockRunning = false;
    //reset the time left in the session to its original state
    currentTimeLeftInSession = workSessionDuration;
    //update the timer displayed
    displayCurrentTimeLeftInSession();
    //reset the session to work again
    type = 'Work';
    timeSpentInCurrentSession = 0;
}

const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
        //decrease time left / increase time spent
        currentTimeLeftInSession--
        timeSpentInCurrentSession++
    } else if (currentTimeLeftInSession === 0) {
        //timer is over -> if work switch to break and vice versa
        timeSpentInCurrentSession = 0;
        //beep sound activates when timer = 0
        let beep = new Audio('audio/beep.mp3');
            beep.play();
        if (type === 'Work') {
            currentTimeLeftInSession = breakSessionDuration;
            displaySessionLog('Work');
            type = 'Break';
            setUpdatedTimers();
            currentTaskLabel.value = 'Break';
            currentTaskLabel.disabled = true;
        } else {
            currentTimeLeftInSession = workSessionDuration;
            type = 'Work';
            setUpdatedTimers();
            if (currentTaskLabel.value === 'Break') {
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;
            displaySessionLog('Break');
        }
    }
    displayCurrentTimeLeftInSession();
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#pomodoro-sessions');
    //append li to ul
    const li = document.createElement('li');
    if (type === 'Work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work';
        workSessionLabel = sessionLabel;
    } else {
        sessionLabel = 'Break';
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
    li.appendChild(text);
    sessionsList.appendChild(li);
}

const togglePlayPauseIcon = (reset) => {
    const playIcon = document.querySelector("#play-icon");
    const pauseIcon = document.querySelector("#pause-icon");
    if (reset) {
        //when resetting always revert to play icon
        if (playIcon.classList.contains('hidden')) {
            playIcon.classList.remove('hidden');
        } 
        if (pauseIcon.classList.contains('hidden')) {
            pauseIcon.classList.add('hidden');
        }
    } else {
        playIcon.classList.toggle('hidden');
        pauseIcon.classList.toggle('hidden');
    }
}

showStopIcon = () => {
    const stopButton = document.querySelector('#pomodoro-stop');
    stopButton.classList.remove('hidden');
}