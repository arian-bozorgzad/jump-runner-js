// get the things from the HTML
const gameArea = document.getElementById("gameArea");
const playerElement = document.getElementById("player");
const obstacleLayer = document.getElementById("obstacleLayer");
const groundLine = document.getElementById("groundLine");
const scoreText = document.getElementById("scoreText");
const highScoreText = document.getElementById("highScoreText");
const stateText = document.getElementById("stateText");
const finalScoreText = document.getElementById("finalScoreText");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const soundButton = document.getElementById("soundButton");

const clouds = document.querySelectorAll(".cloud");

// main values for the game
let score = 0;
let highScore = 0;
let gameSpeed = 5;
let gameRunning = false;
let jumping = false;
let ducking = false;
let gameOver = false;
let downKeyPressed = false;
let soundOn = true;

let playerY = 0;
let playerSpeedY = 0;
let gravity = 0.75;
let jumpPower = 13.5;
let groundHeight = 45;

let obstacles = [];
let obstacleTimer = 70;
let groundPosition = 0;
let cloud1X = 130;
let cloud2X = 580;
let audioContext;

let player = {
    x: 70,
    y: 0,
    width: 48,
    height: 60
};


function getSavedHighScore() {
    let saved = localStorage.getItem("jumpRunnerHighScore");

    if (saved != null) {
        highScore = Number(saved);
    }

    highScoreText.textContent = addZeroes(highScore);
}

function addZeroes(number) {
    let text = Math.floor(number).toString();

    while (text.length < 5) {
        text = "0" + text;
    }

    return text;
}

function startGame() {
    score = 0;
    gameSpeed = 5;
    playerY = 0;
    playerSpeedY = 0;
    jumping = false;
    ducking = false;
    gameOver = false;
    downKeyPressed = false;
    obstacleTimer = 70;
    gameRunning = true;

    removeObstacles();
    playerElement.style.bottom = groundHeight + "px";
    playerElement.className = "player running";
    stateText.textContent = "Running";
    scoreText.textContent = "00000";
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    player.x = playerElement.offsetLeft;
    startAudio();
}

function restartGame() {
    if (gameOver == true) {
        startGame();
    }
}


// make the player jump
function jump() {
    if (gameRunning == false || jumping == true || gameOver == true) {
        return;
    }

    if (ducking == true) {
        stopDucking();
    }

    jumping = true;
    playerSpeedY = jumpPower;
    playerElement.className = "player jumping";
    stateText.textContent = "Jumping";
    playSound("jump");
}

function movePlayer() {
    if (jumping == true) {
        playerY = playerY + playerSpeedY;
        playerSpeedY = playerSpeedY - gravity;

        if (playerY <= 0) {
            playerY = 0;
            playerSpeedY = 0;
            jumping = false;

            if (downKeyPressed == true) {
                startDucking();
            } else {
                playerElement.className = "player running";
                stateText.textContent = "Running";
            }
        }

        player.y = playerY;
        playerElement.style.bottom = groundHeight + playerY + "px";
    }
}

// make the player shorter when Down is held
function startDucking() {
    if (gameRunning == false || gameOver == true || jumping == true) {
        return;
    }

    if (ducking == false) {
        ducking = true;
        player.width = 62;
        player.height = 35;
        playerElement.className = "player ducking";
        stateText.textContent = "Ducking";
        playSound("duck");
    }
}

function stopDucking() {
    if (ducking == true) {
        ducking = false;
        player.width = 48;
        player.height = 60;

        if (gameOver == false && jumping == false) {
            playerElement.className = "player running";
            stateText.textContent = "Running";
        }
    }
}


function randomNumber(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

// add one box or one flying bird
function createObstacle() {
    let obstacle = {};
    let newElement = document.createElement("div");
    let makeFlyingObstacle = Math.random() < 0.38;

    obstacle.x = gameArea.clientWidth + 10;
    obstacle.element = newElement;
    obstacle.element.classList.add("obstacle");

    if (makeFlyingObstacle == true) {
        obstacle.type = "flying";
        obstacle.width = 64;
        obstacle.height = 150;
        obstacle.bottom = 38;
        obstacle.element.classList.add("bird-obstacle");

        // three birds make a tall obsticale . so jumping cannot go over it
        //added it because the bird could jump over at the tall obstacle on some angles 
        obstacle.element.innerHTML =
            '<div class="small-bird bird-top"><span></span></div>' +
            '<div class="small-bird bird-middle"><span></span></div>' +
            '<div class="small-bird bird-low"><span></span></div>';
    } else {
        obstacle.type = "ground";
        obstacle.width = randomNumber(34, 45);
        obstacle.height = randomNumber(35, 50);
        obstacle.bottom = 0;
        obstacle.element.classList.add("box-obstacle");
    }

    obstacle.element.style.left = obstacle.x + "px";
    obstacle.element.style.bottom = groundHeight + obstacle.bottom + "px";
    obstacle.element.style.width = obstacle.width + "px";
    obstacle.element.style.height = obstacle.height + "px";

    obstacleLayer.appendChild(obstacle.element);
    obstacles.push(obstacle);
}

function moveObstacles() {
    let i;

    for (i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x = obstacles[i].x - gameSpeed;
        obstacles[i].element.style.left = obstacles[i].x + "px";

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles[i].element.remove();
            obstacles.splice(i, 1);
            obstacleTimer = randomNumber(40, 80);
        }
    }
}

function makeObstaclesAtRandomTimes() {
    // only one obstacle is used at a time, so no impossible pairs are made
    if (obstacles.length == 0) {
        obstacleTimer = obstacleTimer - 1;

        if (obstacleTimer <= 0) {
            createObstacle();
        }
    }
}

function removeObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].element.remove();
    }

    obstacles = [];
}


// get a smaller box than the visible player
function getPlayerBox() {
    let box = {};
    box.left = player.x + 5;
    box.bottom = groundHeight + playerY + 3;

    if (ducking == true) {
        box.width = 52;
        box.height = 23;
    } else if (jumping == true) {
        box.width = 38;
        box.height = 46;
    } else {
        box.width = 38;
        box.height = 49;
    }

    box.right = box.left + box.width;
    box.top = box.bottom + box.height;
    return box;
}

function getObstacleBox(obstacle) {
    let box = {};
    box.left = obstacle.x + 3;
    box.right = obstacle.x + obstacle.width - 3;
    box.bottom = groundHeight + obstacle.bottom + 3;
    box.top = groundHeight + obstacle.bottom + obstacle.height - 3;
    return box;
}
//fixed
// check if the player hit an obstacle 
function checkCollision() {
    let playerBox = getPlayerBox();

    for (let i = 0; i < obstacles.length; i++) {
        let obstacleBox = getObstacleBox(obstacles[i]);

        if (playerBox.right > obstacleBox.left &&
            playerBox.left < obstacleBox.right &&
            playerBox.top > obstacleBox.bottom &&
            playerBox.bottom < obstacleBox.top) {
            endGame();
        }
    }
}


function updateScore() {
    score = score + 0.1;
    scoreText.textContent = addZeroes(score);





    // make the speed a little faster every 100 points
    if (Math.floor(score) > 0 && Math.floor(score) % 100 == 0) {
        if (gameSpeed < 11) {
            gameSpeed = gameSpeed + 0.002;
        }
    }
}

function endGame() {
    if (gameOver == true) {
        return;
    }

    
    
    gameOver = true;
    gameRunning = false;
    downKeyPressed = false;
    
    
    playerElement.className = "player dead";
    stateText.textContent = "Game Over";
    finalScoreText.textContent = Math.floor(score);

    if (Math.floor(score) > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem("jumpRunnerHighScore", highScore);
        highScoreText.textContent = addZeroes(highScore);
    }

    gameOverScreen.classList.remove("hidden");
    playSound("hit");
}


function moveBackground() {
    groundPosition = groundPosition - gameSpeed;
    groundLine.style.backgroundPositionX = groundPosition + "px";

    cloud1X = cloud1X - 0.4;
    cloud2X = cloud2X - 0.25;

    if (cloud1X < -80) {
        cloud1X = gameArea.clientWidth + 30;
    }

    if (cloud2X < -80) {
        cloud2X = gameArea.clientWidth + 130;
    }

    clouds[0].style.left = cloud1X + "px";
    clouds[1].style.left = cloud2X + "px";
}


// an advanced  sounds made in JavaScript
function startAudio() {
    if (audioContext == undefined) {
        let AudioContext = window.AudioContext || window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }
}

function beep(frequency, time) {
    if (soundOn == false || audioContext == undefined) {
        return;
    }

    let sound = audioContext.createOscillator();
    let volume = audioContext.createGain();
    sound.frequency.value = frequency;
    sound.type = "square";
    volume.gain.value = 0.05;
    sound.connect(volume);
    volume.connect(audioContext.destination);
    sound.start();
    volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + time);
    sound.stop(audioContext.currentTime + time);
}

function playSound(name) {
    if (name == "jump") {
        beep(500, 0.12);
    }

    if (name == "duck") {
        beep(220, 0.07);
    }

    if (name == "hit") {
        beep(100, 0.3);
    }
}

function changeSound() {
    soundOn = !soundOn;

    if (soundOn == true) {
        soundButton.textContent = "Sound: On";
        startAudio();
        beep(350, 0.08);
    } else {
        soundButton.textContent = "Sound: Off";
    }
}


// keyboard controls
document.addEventListener("keydown", function (event) {
    if (event.code == "Space" || event.code == "ArrowUp" || event.code == "ArrowDown") {
        event.preventDefault();
    }

    if (event.code == "KeyR" && gameOver == true) {
        restartGame();
    }

    if (gameOver == true) {
        return;
    }

    if (event.code == "Space" || event.code == "ArrowUp") {
        if (event.repeat == false) {
            if (gameRunning == false) {
                startGame();
            }
            jump();
        }
    }

    if (event.code == "ArrowDown") {
        downKeyPressed = true;

        // Down does nothing in the air in this simple version
        if (jumping == false) {
            if (gameRunning == false) {
                startGame();
            }
            startDucking();
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.code == "ArrowDown") {
        downKeyPressed = false;
        stopDucking();
    }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
soundButton.addEventListener("click", changeSound);

window.addEventListener("resize", function () {
    player.x = playerElement.offsetLeft;
});


// the main game loop
function gameLoop() {
    if (gameRunning == true && gameOver == false) {
        movePlayer();
        makeObstaclesAtRandomTimes();
        moveObstacles();
        moveBackground();
        checkCollision();
        updateScore();
    }

    requestAnimationFrame(gameLoop);
}

getSavedHighScore();
player.x = playerElement.offsetLeft;
requestAnimationFrame(gameLoop);
