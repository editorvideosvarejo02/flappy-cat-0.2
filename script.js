const bird = document.getElementById("bird");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");
const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");

// 🎧 Sons
const jumpSound = new Audio('jump-up-245782.mp3');
const hitSound = new Audio('hit.mp3');
const pointSound = new Audio('point.mp3');

jumpSound.volume = 0.5;
hitSound.volume = 0.6;
pointSound.volume = 0.5;

// 🐱 Variáveis
let birdY = 200;
let birdVelocity = 0;
const gravity = 0.3;
const jumpStrength = -7;

let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false;
let pipeInterval;
let backgroundX1 = 0;
let backgroundX2 = window.innerWidth;

// ▶️ Iniciar jogo
function resetGame() {
    birdY = 250;
    birdVelocity = 0;
    pipes.forEach(pipe => {
        pipe.top.remove();
        pipe.bottom.remove();
    });
    pipes = [];
    score = 0;
    scoreDisplay.textContent = score;
}

function startGame() {
    resetGame();
    startScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    gameStarted = true;
    gameOver = false;

    pipeInterval = setInterval(createPipe, 2000);
    gameLoop();
}

// 💥 Game Over
function endGame() {
    hitSound.currentTime = 0;
    hitSound.play();

    gameOver = false;
    gameStarted = false;
    clearInterval(pipeInterval);
    finalScore.textContent = score;
    gameOverScreen.style.display = "block";
}

// 🚧 Cano
function createPipe() {
    const gap = 250; // ESPAÇO MAIS FÁCIL
    const pipeWidth = 60;
    const pipeHeight = Math.floor(Math.random() * 300) + 50;

    const pipeTop = document.createElement("div");
    pipeTop.classList.add("pipe", "top");
    pipeTop.style.height = pipeHeight + "px";
    pipeTop.style.left = "100vw";

    const pipeBottom = document.createElement("div");
    pipeBottom.classList.add("pipe", "bottom");
    pipeBottom.style.height = (window.innerHeight - pipeHeight - gap) + "px";
    pipeBottom.style.left = "100vw";

    gameArea.appendChild(pipeTop);
    gameArea.appendChild(pipeBottom);

    pipes.push({
        top: pipeTop,
        bottom: pipeBottom,
        x: window.innerWidth,
        passed: false
    });
}


// 🔁 Game loop
function gameLoop() {
    if (gameOver || !gameStarted) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = birdY + "px";

    if (birdY < 0 || birdY > window.innerHeight - 60) {
        endGame();
        return;
    }

    // Mover canos
    pipes.forEach(pipe => {
        pipe.x -= 2.2;
        pipe.top.style.left = pipe.x + "px";
        pipe.bottom.style.left = pipe.x + "px";

        const birdLeft = 100;
        const birdRight = 100 + 60;
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + 60;

        if (
            birdRight > pipeLeft && birdLeft < pipeRight &&
            (birdY < pipe.top.clientHeight || birdY + 60 > window.innerHeight - pipe.bottom.clientHeight)
        ) {
            endGame();
        }

        if (!pipe.passed && pipe.x + 60 < 100) {
            score++;
            pipe.passed = true;
            scoreDisplay.textContent = score;
            pointSound.currentTime = 0;
            pointSound.play();
        }
    });

    pipes = pipes.filter(pipe => pipe.x > -60);

    // Fundo animado
    backgroundX1 -= 1;
    backgroundX2 -= 1;

    if (backgroundX1 <= -window.innerWidth) {
        backgroundX1 = window.innerWidth;
    }
    if (backgroundX2 <= -window.innerWidth) {
        backgroundX2 = window.innerWidth;
    }

    bg1.style.left = backgroundX1 + "px";
    bg2.style.left = backgroundX2 + "px";

    requestAnimationFrame(gameLoop);
}

// ⌨️ Pulo
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        if (gameStarted && !gameOver) {
            // Pular
            birdVelocity = jumpStrength;
            jumpSound.currentTime = 0;
            jumpSound.play();
        } else if (gameOver) {
            // Reiniciar com Enter
            startGame();
        }
    } else if (event.code === "Enter" && !gameStarted && !gameOver) {
        // Iniciar com Enter
        startGame();
    }
});


// Mostrar início ao carregar
startScreen.style.display = "block";
