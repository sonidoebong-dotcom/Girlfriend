
// =====================================
// GET HTML ELEMENTS
// =====================================
const display = document.getElementById("display");
const switchBtn = document.getElementById("switch");
const resetBtn = document.getElementById("reset");

const audio = document.getElementById("audio");
const runnerVideo = document.getElementById("runnerVideo");
const runnerStatus = document.getElementById("runner-status");

// =====================================
// STOPWATCH VARIABLES
// =====================================
let elapsedTime = 0;
let startTime = 0;
let timerInterval = null;
let isRunning = false;

// =====================================
// FORMAT STOPWATCH TIME
// =====================================
function updateDisplay() {

    const hours = Math.floor(elapsedTime / 3600000);

    const minutes = Math.floor(
        (elapsedTime % 3600000) / 60000
    );

    const seconds = Math.floor(
        (elapsedTime % 60000) / 1000
    );

    display.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// =====================================
// BUTTON SOUND
// =====================================
function playSound() {

    if (audio) {
        audio.currentTime = 0;

        audio.play().catch(error => {
            console.log("Audio playback unavailable:", error);
        });
    }
}

// =====================================
// START STOPWATCH
// =====================================
function startStopwatch() {

    if (isRunning) return;

    isRunning = true;

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {

        elapsedTime = Date.now() - startTime;

        updateDisplay();

    }, 100);

    // SWITCH ANIMATION
    switchBtn.classList.add("active");

    // RUNNING VIDEO
    runnerStatus.textContent = "RUNNING...";

    runnerVideo.play().catch(error => {
        console.log("Video playback error:", error);
    });
}

// =====================================
// STOP STOPWATCH
// =====================================
function stopStopwatch() {

    if (!isRunning) return;

    isRunning = false;

    clearInterval(timerInterval);

    elapsedTime = Date.now() - startTime;

    updateDisplay();

    // SWITCH ANIMATION
    switchBtn.classList.remove("active");

    // PAUSE VIDEO
    runnerVideo.pause();

    runnerStatus.textContent = "STOPPED";
}

// =====================================
// START / STOP SWITCH
// =====================================
switchBtn.addEventListener("click", () => {

    playSound();

    if (isRunning) {
        stopStopwatch();
    } else {
        startStopwatch();
    }

});

// =====================================
// RESET STOPWATCH
// =====================================
resetBtn.addEventListener("click", () => {

    playSound();

    clearInterval(timerInterval);

    elapsedTime = 0;
    startTime = 0;
    isRunning = false;

    updateDisplay();

    // RESET SWITCH
    switchBtn.classList.remove("active");

    // RESET VIDEO
    runnerVideo.pause();
    runnerVideo.currentTime = 0;

    runnerStatus.textContent = "READY...";

});

// =====================================
// INITIAL SETTINGS
// =====================================
updateDisplay();

runnerVideo.pause();
runnerStatus.textContent = "READY...";
