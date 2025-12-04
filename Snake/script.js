const canvas = document.getElementById("grille");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const boxSize = 40;
const gameSpeed = 150;

let snake = [
    { x: 4 * boxSize, y: 5 * boxSize }
];

let direction = "RIGHT";
let score = 0;
const eatSound = new Audio('sounds/sound_point.wav');
const victorySound = new Audio('sounds/victory_sound.mp3');
const losingSound = new Audio('sounds/losing_sound.mp3');

const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScoreDisplay");
let game;

const RECORD_KEY = 'snakeHighScore'; 

let currentHighScore = sessionStorage.getItem(RECORD_KEY);
if (highScoreDisplay) {
    highScoreDisplay.textContent = currentHighScore ? currentHighScore : '0';
}

const beeImage = new Image();
beeImage.src = 'images/bee.png';

const foodImages = [];
const imagePaths = [
    'images/google.png', 
    'images/apple.png', 
    'images/facebook.png', 
    'images/amazon.png', 
    'images/microsoft.png'
];

imagePaths.forEach(path => {
    const img = new Image();
    img.src = path;
    foodImages.push(img);
});

function getRandomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (width / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (height / boxSize)) * boxSize
  };
}
let food = getRandomFoodPosition();

function changeDirection(event) {
    const keyPressed = event.key; 
    const LEFT = "ArrowLeft";
    const UP = "ArrowUp";
    const RIGHT = "ArrowRight";
    const DOWN = "ArrowDown";

    if (keyPressed === LEFT && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (keyPressed === UP && direction !== "DOWN") {
        direction = "UP";
    } else if (keyPressed === RIGHT && direction !== "LEFT") {
        direction = "RIGHT";
    }
    else if (keyPressed === DOWN && direction !== "UP") {
        direction = "DOWN";
    }
}
document.addEventListener("keydown", changeDirection);

function checkAndSaveHighScore(currentScore) {
    const oldHighScore = sessionStorage.getItem(RECORD_KEY);
    
    if (oldHighScore === null || currentScore > parseInt(oldHighScore)) {
        // Sauvegarder le nouveau record
        sessionStorage.setItem(RECORD_KEY, currentScore.toString());
        
        if (highScoreDisplay) {
            highScoreDisplay.textContent = currentScore;
        }
    }
}

function gameLoop() {
    let headX = snake[0].x;
    let headY = snake[0].y;
    let section2 = document.getElementById("section2");

    if (direction === "LEFT") headX -= boxSize;
    if (direction === "UP") headY -= boxSize;
    if (direction === "RIGHT") headX += boxSize;
    if (direction === "DOWN") headY += boxSize; 
        
    if (headX < 0 || headX >= width || headY < 0 || headY >= height) {
        clearInterval(game);
        checkAndSaveHighScore(score); 
        losingSound.currentTime = 0;
        losingSound.play();
        let gameOverContent = 
            "<h2 style='color: gold; text-align: center;'>Game Over! Votre score: " + score + "</h2>" + 
            "<input type='button' value='Rejouer' onclick='location.reload()' style='padding: 10px 20px; font-size: 16px; background-color: gold; border: none; border-radius: 5px; cursor: pointer;'>";
        section2.innerHTML = "<div class=\"bounce-animation gm\">" + gameOverContent + "</div>";
        return;
    }
    
    for (let i = 1; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
        clearInterval(game);
        checkAndSaveHighScore(score); 
        losingSound.currentTime = 0;
        losingSound.play();
        let gameOverContent = 
            "<h2 style='color: gold; text-align: center;'>Game Over! Votre score: " + score + "</h2>" + 
            "<input type='button' value='Rejouer' onclick='location.reload()' style='padding: 10px 20px; font-size: 16px; background-color: gold; border: none; border-radius: 5px; cursor: pointer;'>";
        section2.innerHTML = "<div class=\"bounce-animation gm\">" + gameOverContent + "</div>";
        return;
        }    
    }
    
    snake.unshift({ x: headX, y: headY });

    if (headX === food.x && headY === food.y) {
        eatSound.currentTime = 0; 
        eatSound.play();
        score++;
        scoreDisplay.textContent = score;
        food = getRandomFoodPosition();
        if (score === 20) {
            clearInterval(game);
            victorySound.currentTime = 0;
            victorySound.play();
            let victoryContent = 
            "<h2 style='color: gold; text-align: center;'>Félicitations! <br>Vous avez gagné avec un score de " + score + "!</h2>" + 
            "<input type='button' value='Rejouer' onclick='location.reload()' style='padding: 10px 20px; font-size: 16px; background-color: gold; border: none; border-radius: 5px; cursor: pointer;'>";
            section2.innerHTML = "<div class=\"bounce-animation gm\">" + victoryContent + "</div>";
            checkAndSaveHighScore(score); 
            return;
        }

    } else {
        snake.pop();
    }
    
    ctx.clearRect(0, 0, width, height);

    let logo = foodImages[Math.floor(Math.random() * foodImages.length)];
    ctx.drawImage(logo, food.x, food.y, boxSize, boxSize);
    for (let segment of snake) {
        ctx.drawImage(beeImage, segment.x, segment.y, boxSize, boxSize);
    }
}

document.addEventListener('keydown', function(event) {
    let arrowElement;
    
    switch (event.key) {
        case 'ArrowUp':
            arrowElement = document.getElementById('arrow-up');
            break;
        case 'ArrowDown':
            arrowElement = document.getElementById('arrow-down');
            break;
        case 'ArrowLeft':
            arrowElement = document.getElementById('arrow-left');
            break;
        case 'ArrowRight':
            arrowElement = document.getElementById('arrow-right');
            break;
        default:
            return;
    }

    if (arrowElement && !arrowElement.classList.contains('arrow-pressed')) {
        arrowElement.classList.add('arrow-pressed');
    }
});

document.addEventListener('keyup', function(event) {
    let arrowElement;

    switch (event.key) {
        case 'ArrowUp':
            arrowElement = document.getElementById('arrow-up');
            break;
        case 'ArrowDown':
            arrowElement = document.getElementById('arrow-down');
            break;
        case 'ArrowLeft':
            arrowElement = document.getElementById('arrow-left');
            break;
        case 'ArrowRight':
            arrowElement = document.getElementById('arrow-right');
            break;
        default:
            return;
    }
    
    if (arrowElement) {
        arrowElement.classList.remove('arrow-pressed');
    }
});

game = setInterval(gameLoop, gameSpeed);