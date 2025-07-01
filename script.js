const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const box = 20;
const canvasSize = 600;
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
    // Draw each snake segment with realistic structure
    snake.forEach((segment, index) => {
        const isHead = (index === 0);
        const isTail = (index === snake.length - 1);

        if (isHead) {
            drawSnakeHead(segment);
        } else if (isTail) {
            drawSnakeTail(segment, snake[index - 1]);
        } else {
            drawSnakeBody(segment, snake[index - 1], snake[index + 1]);
        }
    });
}

function drawSnakeHead(segment) {
    ctx.fillStyle = '#4CAF50'; // Green head
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 2;

    // Draw head (rounded rectangle with eyes)
    ctx.beginPath();
    ctx.roundRect(segment.x, segment.y, box, box, [10, 10, 2, 2]);
    ctx.fill();
    ctx.stroke();

    // Eyes
    const eyeSize = box / 5;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(segment.x + box / 3, segment.y + box / 3, eyeSize, 0, Math.PI * 2);
    ctx.arc(segment.x + box * 2 / 3, segment.y + box / 3, eyeSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(segment.x + box / 3, segment.y + box / 3, eyeSize / 2, 0, Math.PI * 2);
    ctx.arc(segment.x + box * 2 / 3, segment.y + box / 3, eyeSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawSnakeBody(segment, prevSegment, nextSegment) {
    ctx.fillStyle = '#8BC34A'; // Light green body
    ctx.strokeStyle = '#689F38';
    ctx.lineWidth = 2;

    // Calculate curves based on adjacent segments
    const width = box;
    const height = box;

    ctx.beginPath();
    // Draw curved body segment connecting to neighbors
    // (Implementation depends on your preferred body style)
    ctx.roundRect(segment.x, segment.y, width, height, [5, 5, 5, 5]);
    ctx.fill();
    ctx.stroke();
}

function drawSnakeTail(segment, prevSegment) {
    ctx.fillStyle = '#689F38'; // Darker green tail
    ctx.strokeStyle = '#33691E';
    ctx.lineWidth = 2;

    // Draw tapered tail
    ctx.beginPath();
    ctx.roundRect(segment.x, segment.y, box, box, [2, 2, 10, 10]);
    ctx.fill();
    ctx.stroke();
}

// Draw food
function drawFood() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    // Adding a small leaf on the apple
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 4, 5, 0, Math.PI * 2);
    ctx.fill();
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

// Control buttons (For Touch Devices)
document.getElementById("up").addEventListener("click", () => changeDirection("UP"));
document.getElementById("down").addEventListener("click", () => changeDirection("DOWN"));
document.getElementById("left").addEventListener("click", () => changeDirection("LEFT"));
document.getElementById("right").addEventListener("click", () => changeDirection("RIGHT"));

// Handle keyboard input (For Desktops)
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") changeDirection("UP");
    if (event.key === "ArrowDown") changeDirection("DOWN");
    if (event.key === "ArrowLeft") changeDirection("LEFT");
    if (event.key === "ArrowRight") changeDirection("RIGHT");
});

// Change direction function
function changeDirection(newDirection) {
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}
