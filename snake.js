const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snakeColor = 'lightgreen';
const snakeBorderColor = 'black';
const gridColor = '#e0e0e0';

let snake;
let dx;
let dy;
let foodX;
let foodY;
let score;
let gameInterval;

function initializeGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
    ];
    dx = 10;
    dy = 0;
    score = 0;
    document.getElementById('value').textContent = score;
    document.getElementById('retryButton').style.display = 'none'; // Hide the Retry button
    document.getElementById('startGameButton').style.display = 'none'; // Hide the Start button
    createFood();
    gameInterval = setInterval(updateGame, 100);
}

// Draw a light, thin grey grid across the canvas
function drawGrid() {
    for (let x = 0; x < canvas.width; x += 10) {
        for (let y = 0; y < canvas.height; y += 10) {
            ctx.strokeStyle = gridColor; // light grey color
            ctx.strokeRect(x, y, 10, 10);
        }
    }
}

// Draw the snake on the canvas
function drawSnake() {
    snake.forEach(makeSnakePart);
}

function makeSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorderColor;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Change the direction of the snake
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

document.addEventListener("keydown", changeDirection);

// Generate the food for snake
function random(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function createFood() {
    foodX = random(0, canvas.width - 10);
    foodY = random(0, canvas.height - 10);
    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

// Move the snake forward by one step
function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    // check if the snake has eaten the food
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    // if the snake has eaten the food, create a new food and increase the score and
    // don't remove the last part of the snake and grow its size
    if (hasEatenFood) {
        score += 5;
        document.getElementById('value').textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

// End the game if the snake collides with itself or the walls
function hasGameEnded() {
    // loop starts from 4 because if i=0 then it will always return true
    // and it is impossible for the snake's first 3 parts to collide with
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Update the game
function updateGame() {
    if (hasGameEnded()) {
        clearInterval(gameInterval);
        ctx.fillStyle = 'black';
        ctx.font = '50px Montserrat';
        ctx.fillText('Game Over', canvas.width / 6.5, canvas.height / 2);
        document.getElementById('retryButton').style.display = 'block'; // Show the Retry button
        return;
    }
    clearCanvas();
    drawGrid();
    drawFood();
    advanceSnake();
    drawSnake();
}

// Initialize the game
function startGame() {
    initializeGame();
}

// Retry the game
function retryGame() {
    initializeGame();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGameButton').addEventListener('click', startGame);
    document.getElementById('retryButton').addEventListener('click', retryGame);
});
