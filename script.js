const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let direction = 'PAUSE'; //movement: 1-UP, 2-RIGHT, 3-DOWN, 4-LEFT, 0-PAUSE
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            direction = 'UP';
            break;
        case 'ArrowRight':
            direction = 'RIGHT';
            break;
        case 'ArrowDown':
            direction = 'DOWN';
            break;
        case 'ArrowLeft':
            direction = 'LEFT';
            break;
        case 'Space':
            direction = 'PAUSE';
            break;
    }
});
let speed = 120;
let score = 0;
let lives = 3;
let snake = [{ x: 400, y: 400 }];
let fruits = [{ x: 100, y: 100 }, { x: 300, y: 700 }, { x: 600, y: 200 }];
let newX = snake[0].x;
let newY = snake[0].y;
let fruitToDelete = 0;
function getRnd() {
    return Math.ceil(Math.random() * 10) * 80;
}

let interval = setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height); // перед отрисовкой нового кадра очищаем canvas

    drawFrame();
    move();
    
    if (snake.length > 4)
        if (headMatchTail()) lives--;

    if (lives === 0) clearInterval(interval);

    if (headMatchFruit(fruits)) {
        addTail();
        setNewFruit();
        score++;
    }

    document.querySelector('.lives p').textContent = lives === 0 ? 'КОНЕЦ ИГРЫ' : `Жизни: ${lives}`;
    document.querySelector('.score p').textContent = `Счёт: ${score}`;
}, speed);

function drawFrame() {
    context.fillStyle = 'green';
    snake.forEach((el) => {
        context.fillRect(el.x, el.y, 20, 20);
    });

    context.fillStyle = 'orange';
    if (fruits.length !== 0) {
        fruits.forEach((el) => {
            context.fillRect(el.x, el.y, 20, 20);
        })
    }
}

function move() {
    switch (direction) {
        case 'UP':
            snake[0].y -= 20;
            checkYBorder()
            changePosition();
            break
        case 'RIGHT':
            snake[0].x += 20;
            checkXBorder();
            changePosition();
            break
        case 'DOWN':
            snake[0].y += 20;
            checkYBorder();
            changePosition();
            break
        case 'LEFT':
            snake[0].x -= 20;
            checkXBorder();
            changePosition();
            break
    }

    newX = snake[0].x;
    newY = snake[0].y;
}

function changePosition() {
    for (let i = 1; i < snake.length; i++) {
        let Y = snake[i].y;
        let X = snake[i].x;
        snake[i].x = newX;
        snake[i].y = newY;
        newX = X;
        newY = Y;
    }
}

function checkXBorder() {
    if (snake[0].x < 0) snake[0].x = 880;
    if (snake[0].x > 880) snake[0].x = 0;
}

function checkYBorder() {
    if (snake[0].y < 0) snake[0].y = 880;
    if (snake[0].y > 880) snake[0].y = 0;
}

function headMatchFruit() {
    for (let i = 0; i < fruits.length; i++) {
        if (snake[0].x === fruits[i].x && snake[0].y === fruits[i].y) {
            fruitToDelete = fruits[i];
            fruits.splice(i, 1); // удаляем съеденный фрукт
            return true;
        }
    }
    return false;
}

function headMatchTail() {
    for (let i = 3; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function addTail() {
    snake.push({ x: fruitToDelete.x, y: fruitToDelete.y });
}

function setNewFruit() {
    fruits.push({ x: getRnd(), y: getRnd() });
}

// drawFrame();