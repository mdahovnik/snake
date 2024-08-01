'use strict';

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let scoreValue = document.querySelector('.score_value');
let livesValue = document.querySelector('.lives_value');
let levelValue = document.querySelector('.level_value');

let direction = '';
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') direction = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
    }
});

let speed = 100;
let score = 0;
let lives = 3;
let level = 0;
let snake = [];
let fruits = [];
let newX = null;
let newY = null;
let fruitToDelete = null;


(function initialFrame() {
    canvas.style.backdropFilter = "blur(3px)";
    snake.push({ x: (Math.ceil((width / 40)) * 20), y: (Math.ceil((height / 40)) * 20) });
    newX = snake[0].x;
    newY = snake[0].y;
    for (let i = 0; i < 10; i++) addNewFruit();
})();

let interval = setInterval(gameLoop, speed);

// Основной цикл игры
function gameLoop() {
    context.clearRect(0, 0, width, height);
    renderingFrame();
    moveNewPosition();

    if (snake.length > 4)
        if (isHeadEatTail()) lives--;

    if (lives === 0) {
        fruits = [];
        snake = [];
        document.querySelector('.game_over').classList.remove('invisible');
    }

    if (isHeadEatFruit(fruits)) {
        addTail();
        addNewFruit();
        score++;

        if (speed > 0 && (score % 3 === 0)) {
            speed -= 2;
            level++;

            clearInterval(interval);
            interval = setInterval(gameLoop, speed);
        }
    }

    scoreValue.textContent = `score: ${score}`;
    livesValue.textContent = `lives:  ${lives}`;
    levelValue.textContent = `level: ${level}`;
}

// Отрисовка кадра 
function renderingFrame() {
    snake.forEach((el) => {
        if (snake.indexOf(el) === 0) context.fillStyle = 'white';
        else context.fillStyle = 'lightGreen';
        context.fillRect(el.x, el.y, 20, 20);
    });

    context.fillStyle = 'orange';
    context.strokeStyle = 'red';
    context.lineWidth = 1;
    if (fruits.length !== 0) {
        fruits.forEach((el) => {
            context.strokeRect(el.x - 1, el.y - 1, 22, 22);
            context.fillRect(el.x, el.y, 20, 20);
        })
    }
}

// Перемещаем змею с шагом 20 пикселей
function moveNewPosition() {
    switch (direction) {
        case 'UP':
            snake[0].y -= 20;
            if (snake[0].y < 0) snake[0].y = height - 20;
            changeTailPosition();
            break
        case 'RIGHT':
            snake[0].x += 20;
            if (snake[0].x > width - 20) snake[0].x = 0;
            changeTailPosition();
            break
        case 'DOWN':
            snake[0].y += 20;
            if (snake[0].y > height - 20) snake[0].y = 0;
            changeTailPosition();
            break
        case 'LEFT':
            snake[0].x -= 20;
            if (snake[0].x < 0) snake[0].x = width - 20;
            changeTailPosition();
            break
    }

    newX = snake[0].x;
    newY = snake[0].y;
}

// Пробрасываем координаты от головы последовательно по всему хвосту
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

// Проверяем совпадение координат головы и фрукта
function isHeadEatFruit() {
    for (let i = 0; i < fruits.length; i++) {
        if (snake[0].x === fruits[i].x && snake[0].y === fruits[i].y) {
            fruitToDelete = fruits[i];
            fruits.splice(i, 1); // удаляем съеденный фрукт
            return true;
        }
    }
    return false;
}

// Проверяем не наткнулась ли голова на хвост
function isHeadEatTail() {
    for (let i = 3; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) return true;
    }
    return false;
}

function addTail() {
    snake.push({ x: fruitToDelete.x, y: fruitToDelete.y });
}

function addNewFruit() {
    fruits.push({ x: getRnd(width - 20), y: getRnd(height - 20) });
}

// Получаем рандомные координаты кратные 20-ти
function getRnd(maxValue) {
    return Math.ceil((Math.random() * maxValue) / 20) * 20;
}

// Перерисовываем кадр при изменении размера окна
let resize = function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    fruits = [];
    for (let i = 0; i < 10; i++) addNewFruit();
    renderingFrame();
}
window.addEventListener('resize', resize);