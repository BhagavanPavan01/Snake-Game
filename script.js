const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = generateFood();
let score = 0;
let highestScore = localStorage.getItem("highestScore") || 0;

// Start Game
function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    food = generateFood();
    score = 0;
    document.getElementById("score").innerText = score;
    gameLoop();
}

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
}

// Game loop
function gameLoop() {
    if (isGameOver()) {
        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
        }
        alert(`Game Over! Your score: ${score}\nHighest Score: ${highestScore}`);
        return;
    }

    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        gameLoop();
    }, 100);
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

// Draw snake
function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// Move snake
function moveSnake() {
    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Check game over
function isGameOver() {
    let head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});



