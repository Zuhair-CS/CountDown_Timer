document.addEventListener('mousemove', e=>{
    const cursor = document.querySelector('.cursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
});
const semicircles = document.querySelectorAll('.semicircle');
const timer = document.querySelector('.timer');
const startButton = document.querySelector('.start');
const pauseButton = document.querySelector('.pause');
const lapButton = document.querySelector('.lap');
const resetButton = document.querySelector('.reset');
const lapTimesList = document.querySelector('.lap-times');

const outermost = document.querySelector('.outermost-circle');

let hr = localStorage.getItem('hours') || 0;
let min = localStorage.getItem('minutes') || 0;
let sec = localStorage.getItem('seconds') || 0;

const hours = hr * 3600000;
const minutes = min * 60000;
const seconds = sec * 1000;
let setTime = hours + minutes + seconds;
let remainingTime = setTime;
let startTime;
let timerLoop;
let running = false;
semicircles[1].style.display = "none";
semicircles[0].style.display = "none";

// Start/Resume Timer
function startTimer() {
    if (!running) {
        semicircles[1].style.display = "";
        semicircles[0].style.display = ""; 
        startTime = Date.now() - (setTime - remainingTime);
        timerLoop = setInterval(countDownTimer, 10);
        running = true;
        startButton.textContent = "Pause";
        pauseButton.disabled = false;
        lapButton.disabled = false;
        resetButton.disabled = false;
    } else {
        pauseTimer(); // Toggle Pause
    }
}

// Pause Timer
function pauseTimer() {
    clearInterval(timerLoop);
    running = false;
    startButton.textContent = "Resume";
}

// Lap Timer
function lapTimer() {
    if (running) {
        const lapTime = formatTime(remainingTime);
        const lapItem = document.createElement('li');
        lapItem.textContent = lapTime;
        lapTimesList.appendChild(lapItem);
    }
}

// Reset Timer
function resetTimer() {
    clearInterval(timerLoop);
    running = false;
    remainingTime = setTime;

    // Reset semicircles
    semicircles.forEach((semicircle) => {
        semicircle.style.display = 'none'; // Ensure all semicircles are visible
        semicircle.style.transform = 'rotate(0deg)'; // Reset rotation
        semicircle.style.backgroundColor = 'white'; // Restore color
    });

    // Reset timer display
    timer.innerHTML = formatTime(setTime);
    timer.style.color = 'white';

    // Reset buttons
    startButton.textContent = 'Start';
    pauseButton.disabled = true;
    lapButton.disabled = true;
    resetButton.disabled = true;

    // Clear lap times
    lapTimesList.innerHTML = '';
}

// Countdown Logic
function countDownTimer() {
    const currentTime = Date.now();
    remainingTime = setTime - (currentTime - startTime);
    const angle = (remainingTime / setTime) * 360;

    // Update Circular Progress
    if (angle > 180) {
        semicircles[2].style.display = 'none'; // Hide the left semicircle
        semicircles[0].style.transform = "rotate(180deg)";
        semicircles[1].style.transform = `rotate(${angle}deg)`;
    } else {
        semicircles[2].style.display = 'block'; // Show the left semicircle
        semicircles[0].style.transform = `rotate(${angle}deg)`;
        semicircles[1].style.transform = `rotate(${angle}deg)`;
        semicircles[2].style.backgroundColor = "#374151"
    }

    // Update Timer Display
    timer.innerHTML = formatTime(remainingTime);

    // Stop Timer at 0
    if (remainingTime <= 0) {
        clearInterval(timerLoop);
        semicircles.forEach((semicircle) => (semicircle.style.display = 'none'));
        timer.innerHTML = "00:00:00";
        startButton.textContent = "Start";
        pauseButton.disabled = true;
        lapButton.disabled = true;
        resetButton.disabled = false;
        running = false;
    }
}
// Format Time as HH:MM:SS
function formatTime(time) {
    const hrs = Math.floor((time / (1000 * 60 * 60)) % 24).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const mins = Math.floor((time / (1000 * 60)) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const secs = Math.floor((time / 1000) % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    return `${hrs}:${mins}:${secs}`;
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
lapButton.addEventListener('click', lapTimer);
resetButton.addEventListener('click', resetTimer);

window.onload = () => {
    startTimer(); // Automatically start the timer when the page loads
};