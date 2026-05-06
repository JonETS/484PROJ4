

const testWrapper = document.querySelector(".test-wrapper");//div
const testArea = document.querySelector("#test-area");//textarea
var originText = document.querySelector("#origin-text p").innerHTML;//p, changed to var for edits
const resetButton = document.querySelector("#reset"); //button
const theTimer = document.querySelector(".timer"); //div

var timerInterval = 0;
var isStart = false;
var checkInterval = 0;
var errorCount = 0;
var WordsPerMin = 0;
var FinishTime = 0;
var isErrored = false;


if(localStorage.length == 0){//create keys
    localStorage.setItem('FirstKey', 9999999999999); //default value
    localStorage.setItem('SecondKey', 9999999999999);
    localStorage.setItem('ThirdKey', 9999999999999);
}

displayScores();
function displayScores(){
    //get first
    document.getElementById('FIRST').textContent = formatScores(localStorage.getItem('FirstKey'));
    //get second
    document.getElementById('SECOND').textContent = formatScores(localStorage.getItem('SecondKey'));
    //get third
    document.getElementById('THIRD').textContent = formatScores(localStorage.getItem('ThirdKey'));
}
function formatScores(timer){
    if(timer == 9999999999999){
        return "00:00:00";
    }
    let this_time = timer;
    let this_minutes = Math.floor(this_time / 60000);//get minutes
        let this_padMinutes = "0";
        if(this_minutes >= 10)
        {
            this_padMinutes = "";
        }
        this_time = this_time - (this_minutes * 60000);//remove minutes
        let this_seconds = Math.floor(this_time / 1000);//get seconds
        let this_padSeconds = "0";
        if(this_seconds >= 10)
        {
            let  this_padSeconds = "";
        }
        this_time = this_time - (this_seconds * 1000);//remove seconds
        let this_hundredths = Math.floor(this_time / 10);//get hundreths
        let this_padHundredths = "0";
        if(this_hundredths >= 10)
        {
            let this_padHundredths = "";
        }
        return this_padMinutes+this_minutes+":"+this_padSeconds+this_seconds+":"+this_padHundredths+this_hundredths;
}

// Add leading zero to numbers 9 or below (purely for aesthetics):
// Run a standard minute/second/hundredths timer:
function startTimer(){
    //Date.now is in milliseconds 
    const start = Date.now();
    timerInterval = setInterval(() => 
    {
        var timeNow = Date.now();
        var time = timeNow - start;//take the difference from start to now to show time counting
        FinishTime = time;
        WPM(time);
        var minutes = Math.floor(time / 60000);//get minutes
        var padMinutes = "0";
        if(minutes >= 10)
        {
            padMinutes = "";
        }
        time = time - (minutes * 60000);//remove minutes
        var seconds = Math.floor(time / 1000);//get seconds
        var padSeconds = "0";
        if(seconds >= 10)
        {
            var padSeconds = "";
        }
        time = time - (seconds * 1000);//remove seconds
        var hundredths = Math.floor(time / 10);//get hundreths
        var padHundredths = "0";
        if(hundredths >= 10)
        {
            var padHundredths = "";
        }
        theTimer.innerHTML = padMinutes+minutes+":"+padSeconds+seconds+":"+padHundredths+hundredths;
        
    }, 10);//interval time is in ms, minutes/seconds/hundreths
}
function WPM(time){
    var seconds = Math.floor(time/1000);//convert to seconds
    var typedString = testArea.value;
    var characters = typedString.length;
    WordsPerMin = Math.floor((characters / 5) / (seconds/60));//calc WPM
    document.getElementById("WPM").textContent = WordsPerMin;
}

function stopTimer(){
    clearInterval(timerInterval);
    if(FinishTime <= localStorage.getItem('FirstKey')){
        //shift all down
        localStorage.setItem('ThirdKey', localStorage.getItem('SecondKey'));
        localStorage.setItem('SecondKey', localStorage.getItem('FirstKey'));
        //set new
        localStorage.setItem('FirstKey', FinishTime);
    }
    else if(FinishTime <= localStorage.getItem('SecondKey')){
        //shift all down
        localStorage.setItem('ThirdKey', localStorage.getItem('SecondKey'));
        //set new
        localStorage.setItem('SecondKey', FinishTime);
    }
    else if(FinishTime <= localStorage.getItem('ThirdKey')){
        //set new
        localStorage.setItem('ThirdKey', FinishTime);
    }
    displayScores();
}

// Reset everything:
function resetTimer(){
    clearInterval(timerInterval);
    FinishTime = 0;
    isStart = false;
}

// Match the text entered with the provided text on the page:
function matchText(){
    if(originText == testArea.value){
        //show green
        testWrapper.classList.add('test-wrapper-green');
        testWrapper.classList.remove('test-wrapper');
        testWrapper.classList.remove('test-wrapper-blue');
        testWrapper.classList.remove('test-wrapper-red');
        updateProgress();
        //stop timer
        stopTimer();
        clearInterval(checkInterval);
        createConfetti(window.innerWidth/2, window.innerHeight/2);
        isErrored = false;
    }
    else if (originText.includes(testArea.value) == true){
        //show blue
        testWrapper.classList.add('test-wrapper-blue');
        testWrapper.classList.remove('test-wrapper');
        testWrapper.classList.remove('test-wrapper-green');
        testWrapper.classList.remove('test-wrapper-red');
        updateProgress();
        isErrored = false;
    }
    else{
        //show red
        testWrapper.classList.add('test-wrapper-red');
        testWrapper.classList.remove('test-wrapper');
        testWrapper.classList.remove('test-wrapper-blue');
        testWrapper.classList.remove('test-wrapper-green');
        errorCounter();
    }
}
function errorCounter(){
    if(isErrored == false){
        errorCount++;
        document.getElementById("ERROR").textContent = errorCount;
        isErrored = true;
    }
}
function updateProgress(){
    document.getElementById("PROGRESS").value = (testArea.value.length / originText.length);
}


// Start the timer:
function startCheckText(){
    if(isStart == false){
        isStart = true;
        startTimer();
        isErrored = false;
        checkInterval = setInterval(() =>{
                matchText();
        });
    }
}

// Reset everything:
function resetEverything(){
    resetTimer();
    resetTextArea();
    clearInterval(checkInterval);//if they havent completed it
    isStart = false;//reset check condition
    resetWPM();
    resetErrors();
    newTest();//get new text to test
    displayScores();
    document.getElementById("PROGRESS").value = 0;
}
function resetTimer(){
    clearInterval(timerInterval);
    theTimer.innerHTML = "00:00:00";
}
function resetTextArea(){
    //reset border
    testWrapper.classList.add('test-wrapper');
    testWrapper.classList.remove('test-wrapper-green');
    testWrapper.classList.remove('test-wrapper-blue');
    testWrapper.classList.remove('test-wrapper-red');
    //reset value
    testArea.value = null;
}
function newTest(){
    var randomNumber = Math.floor(Math.random() * 6);
    var newString = RandomTextArray[randomNumber];
    document.querySelector("#origin-text p").innerHTML = newString;//update display
    originText = newString;//update var
}
function resetWPM(){
    WordsPerMin = 0;
    document.getElementById("WPM").textContent = WordsPerMin;
}
function resetErrors(){
    errorCount = 0;
    document.getElementById("ERROR").textContent = errorCount;
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("input", startCheckText);
resetButton.addEventListener('click', resetEverything);//clicking reset button resets everything

//array of text
var RandomTextArray = 
[
"The text to test",
"According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible.",
"This is going to be really difficult to do. This ain't going to be easy.",
"Crazy? I was crazy once. They locked me in a room. A rubber room. A rubber room with rats. And rats make me crazy.",
"NOOOOOOOOOOOOOOOOOOOOOO",
"123456789"
];

/*
    I found importing js libraries that have confetti effects to be difficult and encountered many issues with importing
    I followed this guide for creating the confetti purely with css and js 
    https://codingartistweb.com/2025/05/create-stunning-confetti-burst-effects-on-click-with-html-css-and-javascript/
*/
function getRandomColor() {
  const colors = [
    "#ff5252",
    "#ffeb3b",
    "#4caf50",
    "#03a9f4",
    "#ff9800",
    "#e91e63",
    "#00e676",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
function createConfetti(x, y) {
  const confettiCount = 100;
  const radius = 200;
  for (let i = 0; i < confettiCount; i++) {
    const angle = (2 * Math.PI * i) / confettiCount;
    const xDirection = Math.cos(angle) * radius;
    const yDirection = Math.sin(angle) * radius;
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.width = `${Math.random() * 6 + 4}px`;
    confetti.style.height = confetti.style.width;
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.top = `${y}px`;
    confetti.style.left = `${x}px`;
    confetti.style.setProperty("--x", `${xDirection}px`);
    confetti.style.setProperty("--y", `${yDirection}px`);
    confetti.style.animation = `burst ${
      Math.random() * 1.5 + 0.15
    }s ease-out forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => {
      confetti.remove();
    }, 3000); // Clean up after 3 seconds
  }
}

