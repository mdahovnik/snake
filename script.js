const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let direction = '';

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


// Основной цикл игры
let interval = setInterval(function () {
    context.clearRect(0, 0, canvas.width, canvas.height); // перед отрисовкой нового кадра очищаем canvas
    renderingFrame();
    moveNewPosition();
    
    if (snake.length > 4)
        if (headEatTail()) lives--;

    if (lives === 0) clearInterval(interval);

    if (headEatFruit(fruits)) {
        addTail();
        addNewFruit();
        score++;
    }

    document.querySelector('.lives p').textContent = lives === 0 ? 'КОНЕЦ ИГРЫ' : `Жизни: ${lives}`;
    document.querySelector('.score p').textContent = `Счёт: ${score}`;
}, speed);

// отрисовка кадра 
function renderingFrame() {
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

// перемещаем змею с шагом 20 пикселей
function moveNewPosition() {
    switch (direction) {
        case 'UP':
            snake[0].y -= 20;
            checkYBorder()
            changeTailPosition();
            break
        case 'RIGHT':
            snake[0].x += 20;
            checkXBorder();
            changeTailPosition();
            break
        case 'DOWN':
            snake[0].y += 20;
            checkYBorder();
            changeTailPosition();
            break
        case 'LEFT':
            snake[0].x -= 20;
            checkXBorder();
            changeTailPosition();
            break
    }

    newX = snake[0].x;
    newY = snake[0].y;
}

// пробрасываем координаты от головы последовательно по всему хвосту
function changeTailPosition() {
    for (let i = 1; i < snake.length; i++) {
        let Y = snake[i].y;
        let X = snake[i].x;
        snake[i].x = newX;
        snake[i].y = newY;
        newX = X;
        newY = Y;
    }
}

// проверяем, достигла ли змея границ canvas, если да то выходим с противоположной стороны
function checkXBorder() {
    if (snake[0].x < 0) snake[0].x = 880;
    if (snake[0].x > 880) snake[0].x = 0;
}

function checkYBorder() {
    if (snake[0].y < 0) snake[0].y = 880;
    if (snake[0].y > 880) snake[0].y = 0;
}

// проверяем совпадение координат головы змеи и фрукта
function headEatFruit() {
    for (let i = 0; i < fruits.length; i++) {
        if (snake[0].x === fruits[i].x && snake[0].y === fruits[i].y) {
            fruitToDelete = fruits[i];
            fruits.splice(i, 1); // удаляем съеденный фрукт
            return true;
        }
    }
    return false;
}

// проверяем не наткнулась ли змея сама на себя
function headEatTail() {
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

function addNewFruit() {
    fruits.push({ x: getRnd(), y: getRnd() });
}

// с помощью этой функции получаем рандомные координаты кратные 20-ти
function getRnd() {
    return Math.ceil(Math.random() * 10) * 80;
}
