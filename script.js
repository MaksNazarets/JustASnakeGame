const body = document.querySelector("body");
const game = document.querySelector("#game");
const field = document.querySelector("#back");

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d'); 

const scores = document.querySelector("#scores_number");

const gameOver_block = document.querySelector(".game_over_block");
const gameOver_text = document.querySelector(".game_over_text");
const restart_button = gameOver_block.querySelector(".restart_btn");
const pause_block = document.querySelector(".pause_block");

const rules_container = document.querySelector(".rules-container");
const rules_btn = document.querySelector("#rules-btn");
const ok_btn = document.querySelector(".ok-btn");

const records_btn = document.querySelector('.records-btn');
const records_container = document.querySelector('.records-container')
const records_numbers_elements = document.querySelectorAll('.rec-number');

const settings_btn = document.querySelector('#settings-btn');
const settings_menu = document.querySelector('.settings-menu');

const msg = document.querySelector('.message-container');

var records_array = [0, 0, 0, 0, 0]; // the data is dummy

// Settings
var default_speed = 250;
var speed;

var scores_number = 0;

var direction = {
    is_movingRight: false,
    is_movingLeft: false,
    is_movingUp: false,
    is_movingDown: false,
    setDirection: (direct) => {
        direction.is_movingRight = false;
        direction.is_movingLeft = false;
        direction.is_movingUp = false;
        direction.is_movingDown = false;
        switch(direct){
            case 'right':
                direction.is_movingRight = true;
                break;
            case 'left':
                direction.is_movingLeft = true;
                break;
            case 'up':
                direction.is_movingUp = true;
                break;
            case 'down':
                direction.is_movingDown = true;
                break;    
        }
    }
}

const ONE_EXIS_SECTION_NUMBER = 20;

const FIELD_SIDE = Math.floor(field.clientWidth / 10) * 10;
// ---------------
    field.style.minWidth = FIELD_SIDE + "px";
    field.style.minHeight = FIELD_SIDE + "px";
    field.style.maxWidth = FIELD_SIDE + "px";
    field.style.maxHeight = FIELD_SIDE + "px";

    canvas.width = FIELD_SIDE;
    canvas.height = FIELD_SIDE;

// ----------------

const SQUARE_SIDE = FIELD_SIDE / ONE_EXIS_SECTION_NUMBER;

const ONE_STEP_SIZE = SQUARE_SIDE;


var is_over = false;

class Snake{
    constructor(){
        this.startX = SQUARE_SIDE * Math.floor(ONE_EXIS_SECTION_NUMBER / 2);
        this.startY = SQUARE_SIDE * Math.floor(ONE_EXIS_SECTION_NUMBER / 2);

        this.x = this.startX;
        this.y = this.startY;
        this.dx = 0;
        this.dy = 0;
        this.side = SQUARE_SIDE;
        this.color = "#000"
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.side, this.side)
    }
}

var snake_body = [];

class SnakeSegment{
    constructor(){
        this.x = prev_posX;
        this.y = prev_posY;
        this.side = SQUARE_SIDE;
        this.color = "#000";
        snake_body.push(this);
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.side, this.side)
    }
}

class Food{
    constructor(){
        this.x = undefined,
        this.y = undefined,
        this.side = SQUARE_SIDE,
        this.color = "#424242"
    }

    draw(){
        ctx.fillStyle = "#424242";
        ctx.fillRect(this.x, this.y, this.side, this.side)
    }
}


const snake = new Snake;
const food = new Food;






                    // === GAME === //

//             = MOVING =

var move;
let prev_posX, prev_posY;
let actual_posX, actual_posY;

function Move(){
    unPause();

    savePrevPosition();
    snake.update();

    if(snake.x < 0 ||
        snake.x == canvas.width ||
        snake.y < 0 ||
        snake.y == canvas.height){
            gameOver();
            return;
    } 

    CheckIntersect();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snake.draw();
    updateSnakeBody();
    food.draw();


    let is_on_body = false; 
    snake_body.forEach(segment => {
        segment.draw();

        if(segment.x == snake.x &&
            segment.y == snake.y) is_on_body = true;
    });
    
    if(is_on_body){
        gameOver();
        return;
    } 

    // console.log('Step');

    move = setTimeout(Move, speed);
}

function savePrevPosition() {
    prev_posX = snake.x;
    prev_posY = snake.y;
}

function SetSegmentLocation(element, posX, posY) {
    element.x = posX;
    element.y = posY;
}

function updateSnakeBody(){
    if(snake_body.length){
        for (let i = 0; i < snake_body.length; i++){      
            actual_posX = snake_body[i].x;
            actual_posY = snake_body[i].y;
          
            SetSegmentLocation(snake_body[i], prev_posX, prev_posY);

            prev_posX = actual_posX;
            prev_posY = actual_posY;
        }
    }
}


function moveRight() {
    if(!direction.is_movingLeft){
        stopMoving();
        snake.dx = ONE_STEP_SIZE;
        Move();
        direction.setDirection('right');
    }
}
function moveLeft() {
    if(!direction.is_movingRight){
        stopMoving();
        snake.dx = -ONE_STEP_SIZE;
        Move();
        direction.setDirection('left');
    }
}
function moveUp() {
    if(!direction.is_movingDown){
        stopMoving();
        snake.dy = -1 * ONE_STEP_SIZE;
        Move();
        direction.setDirection('up');
    }
}
function moveDown() {
   if(!direction.is_movingUp){
        stopMoving();
        snake.dy = ONE_STEP_SIZE;
        Move();
        direction.setDirection('down');
   }
}



function stopMoving(){
    clearInterval(move);
    snake.dx = 0;
    snake.dy = 0;
}

function setPause(){
    stopMoving();   
    pause_block.classList.add("go-block_visible");
}

function unPause(){
    pause_block.classList.remove("go-block_visible");
}

document.addEventListener('keydown', function(event) {
    if(!is_over){
        if (event.code == 'ArrowUp' ) moveUp();
        else if (event.code == 'ArrowDown' ) moveDown();
        else if (event.code == 'ArrowRight' ) moveRight();
        else if (event.code == 'ArrowLeft' ) moveLeft();
        else if (event.code == 'Space') setPause();
        records_container.classList.add('rec-container_hidden');
        settings_menu.classList.add('sm-hidden');
        rules_container.classList.add('rc-hidden');
    }
    
});

document.addEventListener('keydown', function(event) {
    if (is_over && event.code == 'Space') restart_button.click();
});



rules_btn.addEventListener("click", () => {
    rules_container.classList.remove("rc-hidden");
})

ok_btn.addEventListener("click", () => {
    rules_container.classList.add("rc-hidden");
})

records_btn.addEventListener("click", () => {
    records_container.classList.toggle("rec-container_hidden");
    FillInRecordList();
})

settings_btn.addEventListener('click', () => {
    settings_menu.classList.toggle('sm-hidden');
})


settings_menu.addEventListener('click', (event) => {
    switch(event.target.id){
        case 'clear-records':
            records_array = [0, 0, 0, 0, 0];
            localStorage.setItem('records', JSON.stringify(records_array));
            FillInRecordList();
            ShowMessage('Очищено');
            break;
    }
})



//             = GAME PROCESS =

function spawnFood(){
    
    let is_on_snake = true; 
    
    while(is_on_snake){
        food.x = SQUARE_SIDE * getRandomInt(1, 19);
        food.y = SQUARE_SIDE * getRandomInt(1, 19);

        is_on_snake = false

        snake_body.forEach(segment => {
            if(segment.x == food.x &&
                segment.y == food.y) is_on_snake = true;
        })
    }

    food.draw();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;   
}

function CheckIntersect() {
    if(snake.x == food.x && 
        snake.y == food.y ){
        plusScore();
    }
}

function plusScore(){
    new SnakeSegment;

    scores_number++;
    scores.textContent = scores_number;

    spawnFood();

    switch(scores_number){
        case 5:
            speed -= 50;
            break;
        case 10:
            speed -= 50;
            break;
        case 20:
            speed -= 40;
            break;
        case 40:
            speed -= 30;
            break;
        case 50:
            speed -= 15;
            break;
        case 70:
            speed -= 15;
            break;     
    }

}

function gameOver(){
    is_over = true;
    stopMoving();

    UpdateRecordList();

    // let go_animation = setInterval(() => {
    //     snake.color = "gray";
    //     Move();
    //     setTimeout(() => {
    //         snake.color = "#000";
    //         Move();
    //     }, 150);
    // },300)

    // setTimeout(() => {
    //     clearInterval(go_animation)
    // }, 1000)

    gameOver_block.classList.add("go-block_visible");
    gameOver_text .classList.add("go-text_visible");
    restart_button.classList.add("go-text_visible");
}

restart_button.onclick = newGame; 

function newGame(){
    is_over = false;

    snake_body = [];

    snake.x = snake.startX;
    snake.y = snake.startY;

    speed = default_speed;
    Move();

    gameOver_block.classList.remove("go-block_visible");
    restart_button.classList.remove("go-btn_visible");
    gameOver_text.classList.remove("go-text_visible");
    restart_button.classList.remove("go-text_visible");

    scores_number = 0;
    scores.textContent = scores_number;

    speed = default_speed;

    spawnFood();
};

function UpdateRecordList() {
    records_array = JSON.parse(localStorage.getItem('records'));

    if(scores_number > records_array[records_array.length-1]){
        records_array[records_array.length-1] = scores_number;

        if(scores_number > records_array[0]) ShowMessage('Новий рекорд!');

        records_array.sort(function(a, b) {
            return b - a;
        });

        localStorage.setItem('records', JSON.stringify(records_array));

    }
}

function FillInRecordList() {
    if(localStorage.getItem('records') == null) 
        localStorage.setItem('records', JSON.stringify(records_array));

    records_array = JSON.parse(localStorage.getItem('records'));
    for(let i = 0; i < records_array.length; i++){
        records_numbers_elements[i].innerHTML = records_array[i];
    }
}

function ShowMessage(text) {
    msg.querySelector('.message-text').textContent = text;

    msg.classList.remove('message-container-hidden');

    setTimeout(() => {
        msg.classList.add('message-container-hidden');  
    }, 3000);       
}



// =========== Mobile controls ==========

var mobile_controls = document.querySelector('.mobile-controls');
mobile_controls.addEventListener('click', (event) => {
    if(!is_over){
        switch(event.target.id){
            case 'arr-left':
                moveLeft();
                break;
            case 'arr-right':
                moveRight();
                break;
            case 'arr-up':
                moveUp(); 
                break;
            case 'arr-down':
                moveDown();
                break;
            case 'pause-btn':
                setPause();
                break;
        }
    }

    records_container.classList.add('rec-container_hidden');
    settings_menu.classList.add('sm-hidden');
    rules_container.classList.add('rc-hidden');
})




//        ======= GAME SCRIPT =======

newGame();
FillInRecordList()
