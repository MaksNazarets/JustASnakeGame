const body = document.querySelector("body");
const game = document.querySelector("#game");
const field = document.querySelector("#back");
const square = document.querySelector('#q');
var square_tail = document.querySelectorAll('.q-tail');

const food = document.querySelector("#food");
const scores = document.querySelector("#scores_number");

const gameOver_block = document.querySelector(".game_over_block");
const gameOver_text = document.querySelector(".game_over_text");
const restart_button = gameOver_block.querySelector(".restart_btn");
const pause_block = document.querySelector(".pause_block");



const rules_btn = document.querySelector("#rules-btn");
const ok_btn = document.querySelector(".ok-btn");
const rules_container = document.querySelector(".rules-container");



// Settings
var default_speed = 250;
var speed;
var posx, posy;

var scores_number = 0;


var foodX, foodY;

var direction = {
    is_movingRight: false,
    is_movingLeft: false,
    is_movingUp: false,
    is_movingDown: false
}

// ===============================
var is_movingRight = false
var is_movingLeft = false
var is_movingUp = false
var is_movingDown = false
// ===============================


const ONE_EXIS_SECTION_NUMBER = 20;

const FIELD_SIDE = Math.floor(field.clientWidth / 10) * 10;
// ---------------
    field.style.width = FIELD_SIDE + "px";
    field.style.height = FIELD_SIDE + "px";
// ----------------

const SQUARE_SIDE = FIELD_SIDE / ONE_EXIS_SECTION_NUMBER;
// ---------------
    square.style.width = SQUARE_SIDE + "px";
    square.style.height = SQUARE_SIDE + "px";
// ----------------

const FOOD_SIDE = SQUARE_SIDE
// ---------------
    food.style.width = FOOD_SIDE + "px";
    food.style.height = FOOD_SIDE + "px";
// ----------------

const ONE_STEP_SIZE = SQUARE_SIDE;

var is_over = false;



                    // === GAME === //

//             = MOVING =

var move;
let prev_posX, prev_posY;
let actual_posX, actual_posY;

function Move(someFunction){
    pause_block.classList.remove("go-block_visible");

    someFunction();
    let updateSnake = () => {
        if(is_over) return;

        if(square_tail.length > 0){
            for (let i = 0; i < square_tail.length; i++){      
                actual_posX = getComputedStyle(square_tail[i]).left;
                actual_posY = getComputedStyle(square_tail[i]).top;
                
                SetLocation(square_tail[i], prev_posX, prev_posY);

                prev_posX = actual_posX;
                prev_posY = actual_posY;
            }
        }

        let is_on_body = false; 
        square_tail.forEach(element => {
            if(getComputedStyle(element).left == posx + 'px' &&
            getComputedStyle(element).top == posy + 'px') is_on_body = true;
        });

        if(is_on_body) gameOver();

    }

    updateSnake();

    move = setInterval(() => {
        someFunction();
        updateSnake();
    }, speed);
}

function SetDirection(someBoolDirectionVar) {    
    direction.is_movingRight = false;
    direction.is_movingLeft = false;
    direction.is_movingUp = false;
    direction.is_movingDown = false;
}

function SetLocation(element, posX, posY) {
    element.style.left = posX;
    element.style.top = posY;
}

function moveRight(){
    if(direction.is_movingLeft) return;

    stopMoving();
    Move(MoveR);

    function MoveR(){
        // SetDirection(direction.is_movingRight);
        direction.is_movingRight = true;
        direction.is_movingLeft = false;
        direction.is_movingUp = false;
        direction.is_movingDown = false;

        prev_posX = posx + 'px';
        prev_posY = posy + 'px';

        posx += ONE_STEP_SIZE;

        if(posx >= FIELD_SIDE){ 
            if(!is_over) gameOver();
            return;
        }

        square.style.left = posx + "px";
        CheckIntersect();

    }
}

function moveLeft(){
    if(direction.is_movingRight) return;

    stopMoving();
    Move(MoveL);


    function MoveL(){
        // SetDirection(direction.is_movingLeft);
        direction.is_movingRight = false;
        direction.is_movingLeft = true;
        direction.is_movingUp = false;
        direction.is_movingDown = false;

        prev_posX = posx + 'px';
        prev_posY = posy + 'px';

        posx -= ONE_STEP_SIZE;
        if(posx < 0){
            if(!is_over) gameOver();
            return;
        }

        square.style.left = posx + "px";

        CheckIntersect();
    }
}

function moveUp(){
    if(direction.is_movingDown) return;

    stopMoving();
    Move(MoveUp);

    function MoveUp(){
        // SetDirection(direction.is_movingUp);
        direction.is_movingRight = false;
        direction.is_movingLeft = false;
        direction.is_movingUp = true;
        direction.is_movingDown = false;

        prev_posX = posx + 'px';
        prev_posY = posy + 'px';

        posy -= ONE_STEP_SIZE;
        if(posy < 0){ 
            if(!is_over) gameOver();
            return;
        }

        square.style.top = posy + "px";

        CheckIntersect();
    }

}

function moveDown(){
    if(direction.is_movingUp) return;


    stopMoving();
    Move(MoveDown);

    function MoveDown(){
        // SetDirection(direction.is_movingDown);
        direction.is_movingRight = false;
        direction.is_movingLeft = false;
        direction.is_movingUp = false;
        direction.is_movingDown = true;

        prev_posX = posx + 'px';
        prev_posY = posy + 'px';
        
        posy += ONE_STEP_SIZE;
        if(posy >= FIELD_SIDE){ 
            if(!is_over) gameOver();
            return;
        }

        square.style.top = posy + "px";

        CheckIntersect();
    }
}

function stopMoving(){
    clearInterval(move);
}

document.addEventListener('keydown', function(event) {
    if(!is_over){
        if (event.code == 'ArrowUp' ) moveUp();
        else if (event.code == 'ArrowDown' ) moveDown();
        else if (event.code == 'ArrowRight' ) moveRight();
        else if (event.code == 'ArrowLeft' ) moveLeft();
        else if (event.code == 'Space') {
            stopMoving();   
            pause_block.classList.add("go-block_visible");
        } 
    }
});

document.addEventListener('keyup', function(event) {
    if (is_over && event.code == 'Space') restart_button.click();
});



//             = GAME PROCESS =

function spawnFood(){
    foodX = FOOD_SIDE * getRandomInt(1, 19);
    foodY = FOOD_SIDE * getRandomInt(1, 19);

    let is_on_snake = false; 
    square_tail.forEach(element => {
        if(getComputedStyle(element).left == foodX &&
        getComputedStyle(element).top == foodY) is_on_snake = true
    });

    while(is_on_snake){
        foodX = getRandomInt(1, 19);
        foodY = getRandomInt(1, 19);
        is_on_snake = false;
        square_tail.forEach(element => {
            if(getComputedStyle(element).left == foodX &&
            getComputedStyle(element).top == foodY) is_on_snake = true
        });
    }

    food.style.left = foodX + 'px';
    food.style.top = foodY + 'px';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;   
}

function CheckIntersect() {
    if(posy == foodY && 
        posx == foodX ){
        plusScore();
    }
}

function plusScore(){
    square_tail = document.querySelectorAll('.q-tail'); // getting actual tail-block array    

    scores_number++;
    scores.innerHTML = scores_number;

    var tail_segment = document.createElement("div");
    tail_segment.classList.add("q-tail");

    tail_segment.style.width = SQUARE_SIDE + 'px';
    tail_segment.style.height = SQUARE_SIDE + 'px';

    field.appendChild(tail_segment);
    square_tail = field.querySelectorAll('.q-tail');

    spawnFood();

    switch(scores_number){
        case 5:
            speed -= 50;
            break;
        case 10:
            speed -= 50;
            break;
        case 20:
            speed -= 50;
            break;
        case 40:
            speed -= 50;
            break;
    }

}

function gameOver(){
    is_over = true;
    clearInterval(move);

    square.classList.add("q-game_over");
    gameOver_block.classList.add("go-block_visible");
    gameOver_text .classList.add("go-text_visible");
    restart_button.classList.add("go-text_visible");

    // UpdateRecordList();  === Online version ===
}

restart_button.onclick = newGame; 

function newGame(){
    is_over = false;
    stopMoving();

    square_tail = field.querySelectorAll('.q-tail');
    if(square_tail.length > 0){
        square_tail.forEach(element => {
            element.parentNode.removeChild(element);
        });
    }

    gameOver_block.classList.remove("go-block_visible");
    restart_button.classList.remove("go-btn_visible");
    gameOver_text.classList.remove("go-text_visible");
    square.classList.remove("q-game_over");
    restart_button.classList.remove("go-text_visible");

    scores_number = 0;
    scores.innerHTML = scores_number;

    posx = Math.floor(ONE_EXIS_SECTION_NUMBER / 2 * SQUARE_SIDE);
    posy = posx;
    speed = default_speed;

    square.style.left = posx + "px";
    square.style.top = posy+ "px";

    spawnFood();
};




rules_btn.addEventListener("click", () => {
    rules_container.classList.remove("rc-hidden");
})

ok_btn.addEventListener("click", () => {
    rules_container.classList.add("rc-hidden");
})


//        ======= GAME SCRIPT =======

newGame();

