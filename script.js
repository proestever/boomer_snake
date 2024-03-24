
const gameArea = document.getElementById('gameArea');
const gameWidth = gameArea.clientWidth;
const gameHeight = gameArea.clientHeight;
const snakeSize = 20;
const gameSpeed = 100;
let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
let dx = snakeSize;
let dy = 0;
let food = { x: 0, y: 0 };
let changingDirection = false;

function main() {
    if (hasGameEnded()) return;
    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, gameSpeed);
}

function clearCanvas() {
    gameArea.innerHTML = '';
}

function drawSnake() {
    snake.forEach(part => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = part.x + 'px';
        snakeElement.style.top = part.y + 'px';
        snakeElement.classList.add('snake');
        gameArea.appendChild(snakeElement);
    });
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.left = food.x + 'px';
    foodElement.style.top = food.y + 'px';
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement);
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        createFood();
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (hasCollided) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameWidth - snakeSize;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameHeight - snakeSize;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max-min) + min) / snakeSize) * snakeSize;
}

function createFood() {
    food.x = randomFood(0, gameWidth - snakeSize);
    food.y = randomFood(0, gameHeight - snakeSize);
    snake.forEach(part => {
        const hasEaten = part.x == food.x && part.y == food.y;
        if (hasEaten) createFood();
    });
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    if (changingDirection) return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingLeft = dx === -snakeSize;
    const goingRight = dx === snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) { dx = -snakeSize; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -snakeSize; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = snakeSize; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = snakeSize; }
}

document.addEventListener("keydown", changeDirection);

createFood();
main();
