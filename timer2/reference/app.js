let startTime;
let interval;
let running = false;

const display = document.querySelector('.display');
const startButton = document.querySelector('.start');
const pauseButton = document.querySelector('.pause');
const resetButton = document.querySelector('.reset');
const lapButton = document.querySelector('.lap');
const lapTimesList = document.querySelector('.lap-times');

startButton.addEventListener('click', start);
pauseButton.addEventListener('click', pause);
resetButton.addEventListener('click', reset);
lapButton.addEventListener('click', lap);

function start() {
    if (!running) {
        startTime = Date.now() - (interval || 0);
        interval = setInterval(updateDisplay, 10);
        running = true;
        startButton.textContent = 'Pause';
    } else {
        clearInterval(interval);
        running = false;
        startButton.textContent = 'Resume';
    }
}

function pause() {
    clearInterval(interval);
    running = false;
    startButton.textContent = 'Resume';
}

function reset() {
    clearInterval(interval);
    running = false;
    startButton.textContent = 'Start';
    display.textContent = '00:00:00.000';
    lapTimesList.innerHTML = '';
}

function lap() {
    if (running) {
        const lapTime = formatTime(Date.now() - startTime);
        const lapItem = document.createElement('li');
        lapItem.textContent = lapTime;
        lapTimesList.appendChild(lapItem);
    }
}

function updateDisplay() {
    const currentTime = Date.now() - startTime;
    display.textContent = formatTime(currentTime);
}

function formatTime(time) {
    const date = new Date(time);
    const milliseconds = date.getMilliseconds();
    return date.toISOString().substr(11, 8) + '.' + milliseconds.toString().padStart(3, '0');
}