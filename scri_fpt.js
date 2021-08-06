
let body = document.getElementsByTagName("body")[0]; 
let board = document.getElementsByClassName("board")[0];
let score_board = document.getElementsByClassName("score")[0];
let levelLine = board.getElementsByClassName("line")[0];
let blurLine = levelLine.getElementsByClassName("loadline")[0];
blurLine.classList.add("disappear")
let black = body.getElementsByClassName("black")[0];

var score = 0;

var limitScore = 30;
if (!localStorage.highScore || localStorage.highScore < 50) localStorage.highScore = 50;

var NightMode = false;
var div;
var complete;
var highScore = localStorage.highScore;
var snake = [];
var food;
var k = false;
var xvel = 1, yvel = 0;
var speed, maxSpeed = 50;
var messagesHitWall = ["ouchh", "AaaaaaA", "*Angry hissing*", "tastes like dirt"];
var messagesHitItself = ["Auuu", "hiss-hisss"];
var messagesDuck = ["quack", "quack!"];
var messagesStart = ["I am hungry", "press start!", "letss goo"];
var messagediv;

var high;
var nxvel = 0, nyvel = 0;
var optionsText;
var first;
var start;
var paused;
var game_over;
    console.log("    ^~^");
    console.log("  oRaNge");
var sizew;
        // =2*parseInt((window.innerWidth>1040?1040:window.innerWidth)/80);
var sizeh;
        // =parseInt((window.innerHeight>520?520:window.innerHeight)/80);
var size;
        // =sizeh>sizew?sizew:sizeh;
        // size=window..innerWidth;
        // completed();
var divEye1 = document.createElement("div");
var divEye2 = document.createElement("div");
divEye2.classList.add("eye");
divEye1.classList.add("eye");
var eyesclosed = false;
var endBlink;

initialise();

document.addEventListener("keydown", (e) => { kDown(e) });
function initialise() {
    if (div)
        board.removeChild(div);
    div = null;
    optionsText = "The little snek's dissapointment is immesurable.";
    //and its day is ruined.
    levelLine = board.getElementsByClassName("line")[0];
    if (NightMode) disableNightMode();
    score = 0;
    limitScore = 30;
    xvel = 1; yvel = 0;
    speed = 500;
    first = true;
    start = false;
    paused = false;
    complete = false;
    if (high) {
        levelLine.style.removeProperty("background-color");
        high = false;
    }
    k = false;
    game_over = false;
    nxvel = 0; nyvel = 0;
    snake = [[15, 14]];
    if (eyesclosed) openEyes();
    resize();
    addHead();
    setFood();
    square();
        
    score_board.classList = "score";
    score_board.style.background = "";
    score_board.textContent = "Enter";
    //for "enter" text
    score_board.style.fontSize = size + "px";
    score_board.style.margin = 1.7 * size + "px";
    if (endBlink) {
        clearInterval(endBlink);
        endBlink = null;
    }
    blink();
    endBlink = setInterval(() => { blink() }, 1000);
    setTimeout(() => { if (!start) { closeEyes(); setTimeout(() => { openEyes(); }, 350) } }, 3000)
    setTimeout(() => { if (!start) { closeEyes(); setTimeout(() => { openEyes(); }, 350) } }, 3750)
    setTimeout(() => { if (!start) { displayMessage(3); messagediv.style.fontSize = .8 * size + "px"; } }, 5000);
    setTimeout(() => {
        if (!start && endBlink) {
            clearInterval(endBlink);
            endBlink = null;
        }
    }, 10000)
    //blinkEyes(2);
}


function go() {
    start = true;
    if (endBlink) {
        clearInterval(endBlink);
        endBlink = null;
    }
    if (score == 0)
        score_board.textContent = "";
    //for "score" text
    score_board.style.fontSize = 1.5 * size + "px";
    // End=setInterval(()=>{moveSnake()},speed);
        
    moveSnake();
}

function levelController() {
    //wow! such empty
}
function levelLineController() {
    if (high) return;
    levelLine.style.width = 100 * score / limitScore + "%";
    if (!game_over && score > 0 && score % 10 == 0) {
        blurLine.classList.remove("disappear");
        // blurLine[0].style.setProperty("animation","load 2s ease forwards");
        blurLine.style.width = 100 + "%";
        setTimeout(() => {
            blurLine.classList.add("disappear");
            setTimeout(() => {
                blurLine.style.width = 0 + "%";
            }, 1000);
        }, 1000);
    }
    if (!game_over && score >= limitScore && !complete) {
        // pause();
        completed();
        // play();
        // go();
    }
    if (!game_over && score >= highScore && !high) {
        // pause();
        highScoreAchieved();
    }
}

function resize() {
    //dosnt resize eyes {>.<}  try it
    var sizei = size;
    sizew = 2 * parseInt((window.innerWidth > 1000 ? 1000 : window.innerWidth) / 80);
    sizeh = 2 * parseInt((window.innerHeight > 500 ? 500 : window.innerHeight) / 40);
    size = sizeh > sizew ? sizew : sizeh;
    // size=window.innerWidth;
    if (size * 40 < 600) document.getElementsByClassName("text")[0].style.visibility = "hidden";
    // size=2*parseInt(size/80);
    board.style.height = size * 20 + "px";
    board.style.width = size * 40 + "px";
    board.style.left = (window.innerWidth - size * 40) / (2) + "px";
    board.style.top = (window.innerHeight - size * 20) / (2) + "px";
        
    if (size == sizei) return;
    arr = board.getElementsByClassName("snake");
    for (let i = 0; i < arr.length; i++) {
        arr[i].style.left = snake[i][0] * size + "px";
        arr[i].style.bottom = snake[i][1] * size + "px";
        // arr[i].style.width=size-2+"px";
        // arr[i].style.height=size-2+"px";
    }
    arr = board.getElementsByClassName("food")[0];
    if (arr) {
        arr.style.left = food[0] * size + 1 + "px";
        arr.style.bottom = food[1] * size + 1 + "px";
        arr.style.width = size - 2 + "px";
        arr.style.height = size - 2 + "px";
    }
    score_board.style.fontSize = 1.5 * size + "px";
    score_board.style.margin = 1.6 * size + "px";
        
    divEye1.style.width = parseInt(size / 4) + "px";
    divEye1.style.height = parseInt(size / 4) + "px";
    divEye2.style.width = parseInt(size / 4) + "px";
    divEye2.style.height = parseInt(size / 4) + "px";
}
function onSnake(x, y) {
    var c = 0;
    for (i = 0; i < snake.length; i++) {
        if (snake[i][0] == x && snake[i][1] == y)
            c++;
    }
    return c;
}
function won() {
    gameover();
}

function setFood() {
    //recursive ... also possibility of never stopping >.<
    // food = [15+parseInt(Math.random() * 10),5+ parseInt(Math.random() * 10)];
    food = [parseInt(Math.random() * 40), parseInt(Math.random() * 20)];
    let k = 0;
    while (onSnake(food[0], food[1])||k>800) {
        food=[(food[0]+1)%40,(food[1]+(food[0]+1)%40)%20]
        k++;
    }
    if (k > 800) { won();return; }
    var div = document.createElement("img");
    div.classList.add("food");
    div.src = "try6.png";
    div.style.left = food[0] * size + 1 + "px";
    div.style.bottom = food[1] * size + 1 + "px";
    div.style.width = size - 2 + "px";
    div.style.height = size - 2 + "px";
    board.appendChild(div);
    modifySpeed(snake.length);
    if (score > 2 && score - 1 % 10 == 0) {
        score_board.style.setProperty("animation", "shine 1s ease forwards");
        setTimeout(() => {
            score_board.style.removeProperty("animation");
        }, 1000);
    }
}
function modifySpeed(currentScore) {
    return;
    //speed is time delay in miliseconds
    // speed = 125 - currentScore;
    // if (currentScore > 40) speed--;
    // if (speed < maxSpeed) speed = maxSpeed;
}

function removeFood() {
    board.removeChild(board.getElementsByClassName("food")[0]);
}

function removeTail() {
    board.removeChild(board.getElementsByClassName("snake")[0]);
    snake.shift();
    // if(!(snake[0][0]==snake[snake.length-1][0]&&snake[0][1]==snake[snake.length-1][1]))
    square();
}
        // function blinkFood(){
        //cause Y not
        //     if(n==11)board.getElementsByClassName("food")[0].style.visibility="hidden";
        //     if(n==20)board.getElementsByClassName("food")[0].style.visibility="visible";
        // }



function blinkEyes(times) {
    //doesnt look good hehh blinking eyes while moving uk
    // if (times <= 0) return;
    // var eye = board.getElementsByClassName("snake")[snake.length - 1].getElementsByClassName("eye");
    // // console.log(times);
    // size -= 2;
    // if (eye[0].style.left == eye[1].style.left) {
    //     eye[0].style.height = parseInt(size / 4) + "px";
    //     eye[0].style.width = parseInt(size / 10) + "px";
    //     eye[0].style.top = parseInt(size / 8) + "px";

    //     eye[1].style.height = parseInt(size / 4) + "px";
    //     eye[1].style.width = parseInt(size / 10) + "px";
    //     eye[1].style.bottom = parseInt(size / 8) + "px";
    // }
    // else {
    //     eye[0].style.height = parseInt(size / 10) + "px";
    //     eye[0].style.width = parseInt(size / 4) + "px";
            
    //     eye[1].style.height = parseInt(size / 10) + "px";
    //     eye[1].style.width = parseInt(size / 4) + "px";
    // }
    // setTimeout(() => {
    //     eye = board.getElementsByClassName("snake")[snake.length - 1].getElementsByClassName("eye");
    //     eye[0].style.height = parseInt(size / 3) + "px";
    //     eye[0].style.width = parseInt(size / 3) + "px";
            
    //     eye[1].style.height = parseInt(size / 3) + "px";
    //     eye[1].style.width = parseInt(size / 3) + "px";
    // }, 100);
    // size += 2;
    // setTimeout(() => { blinkEyes(times - 1) }, 400 + 100);
    return;
}
function closeEyes() {
    if (divEye1.style.left != "unset" && (divEye1.style.left == divEye2.style.left)) {
        divEye1.style.width = 2 + "px";
        divEye2.style.width = 2 + "px";
    }
    if (divEye1.style.right != "unset" && (divEye1.style.right == divEye2.style.right)) {
        divEye1.style.width = 2 + "px";
        divEye2.style.width = 2 + "px";
    }
    if (divEye1.style.bottom != "unset" && (divEye1.style.bottom == divEye2.style.bottom)) {
        divEye1.style.height = 2 + "px";
        divEye2.style.height = 2 + "px";
    }
    if (divEye1.style.top != "unset" && (divEye1.style.top == divEye2.style.top)) {
        divEye1.style.height = 2 + "px";
        divEye2.style.height = 2 + "px";
    }
    eyesclosed = true;
}
function openEyes() {
    divEye1.style.width = parseInt(size / 4) + "px";
    divEye1.style.height = parseInt(size / 4) + "px";
    divEye2.style.width = parseInt(size / 4) + "px";
    divEye2.style.height = parseInt(size / 4) + "px";
    eyesclosed = false;
}
function addHead() {
    if (game_over) return;
    if (first) first = false;
    else {
        if (snake[snake.length - 1][0] + xvel < 0 || snake[snake.length - 1][0] + xvel >= 40 || snake[snake.length - 1][1] + yvel < 0 || snake[snake.length - 1][1] + yvel >= 20) {
            gameover(); displayMessage(1); document.getElementsByClassName("snake")[snake.length - 1].style.backgroundColor = "rgb(255 ,200  ,200)"; return;
        }
        snake.push([snake[snake.length - 1][0] + xvel, snake[snake.length - 1][1] + yvel]);
    }
    var div = document.createElement("div");
    div.classList.add("snake");
    var left = snake[snake.length - 1][0] * size + 1;
    var bottom = snake[snake.length - 1][1] * size + 1;
    var width = size - 2;
    var height = size - 2;
    if (xvel == 1) {
        divEye1.style.right = width * 1 / 5 + "px";
        divEye1.style.top = height * 1 / 6 + "px";
        divEye1.style.bottom = "unset";
        divEye1.style.left = "unset";
        divEye2.style.right = width * 1 / 5 + "px";
        divEye2.style.bottom = height * 1 / 6 + "px";
        divEye2.style.top = "unset";
        divEye2.style.left = "unset";
        left -= 2;
        width += 2;
    }
    if (xvel == -1) {
        divEye1.style.left = width * 1 / 5 + "px";
        divEye1.style.top = height * 1 / 6 + "px";
        divEye1.style.right = "unset";
        divEye1.style.bottom = "unset";
        divEye2.style.left = width * 1 / 5 + "px";
        divEye2.style.bottom = height * 1 / 6 + "px";
        divEye2.style.top = "unset";
        divEye2.style.right = "unset";
        width += 2;
    }
    if (yvel == 1) {
        divEye1.style.left = width * 1 / 6 + "px";
        divEye1.style.top = height * 1 / 5 + "px";
        divEye1.style.bottom = "unset";
        divEye1.style.right = "unset";
        divEye2.style.right = width * 1 / 6 + "px";
        divEye2.style.top = height * 1 / 5 + "px";
        divEye2.style.bottom = "unset";
        divEye2.style.left = "unset";
        bottom -= 2;
        height += 2;
    }
    if (yvel == -1) {
        divEye1.style.left = width * 1 / 6 + "px";
        divEye1.style.bottom = height * 1 / 5 + "px";
        divEye1.style.top = "unset";
        divEye1.style.right = "unset";
        divEye2.style.right = width * 1 / 6 + "px";
        divEye2.style.bottom = height * 1 / 5 + "px";
        divEye2.style.left = "unset";
        divEye2.style.top = "unset";
        height += 2;
    }
    div.style.left = left + "px";
    div.style.bottom = bottom + "px";
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.zIndex = score;
    div.appendChild(divEye1);
    div.appendChild(divEye2);
    if (snake.length >= 2)
        board.getElementsByClassName("snake")[snake.length - 2].innerHTML = "";
    board.appendChild(div);
}


function square() {
    board.getElementsByClassName("snake")[0].style.width = size - 2 + "px";
    board.getElementsByClassName("snake")[0].style.height = size - 2 + "px";
    board.getElementsByClassName("snake")[0].style.left = snake[0][0] * size + 1 + "px";
    board.getElementsByClassName("snake")[0].style.bottom = snake[0][1] * size + 1 + "px";
}
function eatOrRemoveTail() {
    if (snake[snake.length - 1][0] == food[0] && snake[snake.length - 1][1] == food[1]) {
        removeFood(); setFood(); score++; score_board.textContent = score;
        levelLineController();
        // blinkEyes(2);
    }
    else
        removeTail();
}
function blink() {
    score_board.style.visibility = "hidden";
    setTimeout(() => { score_board.style.visibility = "visible"; }, 500);
}

function moveSnake() {
    addHead();
    if (!game_over)
        eatOrRemoveTail();
    // levelLineController();
    if (onSnake(snake[snake.length - 1][0], snake[snake.length - 1][1]) - 1) {
        gameover(); displayMessage(2);
        var div = document.createElement("div");
        div.classList.add("snake");
        div.style.width = size - 2 + "px";
        div.style.height = size - 2 + "px";
        div.style.left = snake[snake.length - 1][0] * size + 1 + "px";
        div.style.bottom = snake[snake.length - 1][1] * size + 1 + "px";
        div.style.backgroundColor = "rgb(255,86,86)";
        div.style.opacity = "0.2";
        div.style.zIndex = score + 1;
        snake.push(snake[snake.length - 1]);
        board.appendChild(div);
        div = null;
    }
    // if(game_over){
    //     return;
    // }
    // k=false;
    if (nxvel || nyvel) {
        xvel = nxvel; yvel = nyvel; nyvel = 0; nxvel = 0;
    }
    else k = false;
    tt=ai();
    if (!paused && !game_over) {
        // console.log(tt);
        sssss = speed;
        speed = speed - tt;
        if (speed < 50) speed = 50;
        // console.log(speed);
        setTimeout(() => { moveSnake() }, speed);
        speed = sssss;
    }
}
function talk() {       
}
function completed() {
    complete = true;
    optionsText = "We were on the verge of greatness. We were this close. ";
    levelLine = board.getElementsByClassName("sline")[0];
        levelLine.style.left = "0px";
        limitScore = highScore;
    // levelLine.style.setProperty("animation","completed-1 1.5s ease-in forwards");
    // score_board.visibility="hidden";
    blink();
    // div = document.createElement("div");
    // div.classList.add("sideText");
    // board.appendChild(div);
    // levelLine.style.setProperty("animation", "completed-2 1.5s ease-in forwards");
    // var j = 0;
    // var text = "Level Completed. ";
    enableNightMode();
    // div.innerHTML = "";

    // div.innerHTML = text;
    // var endText=setInterval(() => {
    //     div.innerHTML += text.charAt(j);
    //     j++;
    //         if (j >= text.length)
    //             clearInterval(endText);
    // }, 50);
    // pause();

    // setTimeout(() => {
        // enableNightMode();
        // div.innerHTML += highScore - score;
        // text = highScore - score + " left to high score. Press SPACE to continue.";
        // j = 0;
        // var endText = setInterval(() => {
        //     div.innerHTML += text.charAt(j);
        //     j++;
        //     if (j >= text.length)
        //         clearInterval(endText);
        // }, 50);
        // div.innerHTML += text;
    // }, text.length * 50 + 500);
}

function highScoreAchieved() {
    high = true;
    optionsText = "Awesome! Game Completed.<br>";
    board.getElementsByClassName("line")[0].style.backgroundColor = "transparent";
    board.getElementsByClassName("sline")[0].style.setProperty("transition-duration", "2s");
    board.getElementsByClassName("sline")[0].style.width = 0 + "%";
    board.getElementsByClassName("sline")[0].style.left = 50 + "%";
    // board.getElementsByClassName("loadline")[0].style.backgroundColor = "black";
    // board.getElementsByClassName("loadline")[0].style.width = 51 + "%";
}


function enableNightMode() {
    NightMode = true;
    black.style.opacity = 1;
    body.getElementsByClassName("topText")[0].style.color = "white";
}
function disableNightMode() {
    if (!NightMode) return;
    black.style.opacity = 0;
    body.getElementsByClassName("topText")[0].style.color = "black";
}
function pause() {
    paused = true;
}
function play() {
    // if (complete) {
    //     levelLine = board.getElementsByClassName("sline")[0];
    //     levelLine.style.left = "0px";
    //     limitScore = highScore;
    // }
    var saveScore = score;
    score = -1;
    var endInterval = setInterval(() => {
        score++;
        levelLineController();
        // console.log(limitScore)
        if (score >= saveScore)
            clearInterval(endInterval);
    }, 20);
    //}
    start = false;
    paused = false;
    nxvel = 0; nyvel = 0;
    //to remove talk div contains that if it exists
    if (div) {
        board.removeChild(div);
        div = null;
    }
}
        // function screenshot(){
        //     if(div)
        //     board.removeChild(div);
        // }
function gameover() {
    if (high) {
        if (localStorage.highScore > score) {
            optionsText += " All time High : " + localStorage.highScore;
        }
        else {
            optionsText += " Highest score achieved.<br>(* Happy snek noises *)";
            localStorage.highScore = score;
        }
    }
    else
        closeEyes();
    game_over = true;
    pause();
    if (score == 0) {
        score_board.style.background = "url(duck!.png) no-repeat";
        score_board.style.height = "124px";
        score_board.style.width = "129px";
        score_board.style.margin = size + "px";
        setTimeout(() => { displayMessage(4) }, 50);
        setTimeout(() => { displayMessage(4) }, 1000);
    }
    else {
        blink();
        endBlink = setInterval(() => blink(), 1000);
    }
    setTimeout(() => {
        addOptionsGameOver();
    }, 750);
}

function addOptionsGameOver() {
    var options = document.createElement("div");
    options.classList.add("dialogue");
    // options.classList.add("translucent");
        
    options.innerHTML =
        "<div class=\"translucent\">" +
        "<h3>" + optionsText + "</h3>" +
        "<div class=\"btns\">" +
        "<div class=\"btn\" onclick=\"removeOptionsGameOver();restart();\">Try Again</div>" +
        // "<div class=\"btn\" onclick=\"removeOptionsGameOver();play();\">Continue the snek's quest</div>"
        "</div></div>" ;
    board.appendChild(options);
}

function removeOptionsGameOver() {

    if (board.getElementsByClassName("dialogue").length) {
        // board.getElementsByClassName("dialogue")[0].classList.add("disappear");
        setTimeout(() => {
            board.removeChild(board.getElementsByClassName("dialogue")[0]);
        }, 100);
    }
}

function restart() {

    if (endBlink) {
        clearInterval(endBlink);
        endBlink = null;
    }
    setTimeout(() => {
        score_board.classList.add("disappear");
    }, 1000)
    setTimeout(() => {
        initialise();
    }, 100 * snake.length + 1000);
    erase();
}

function erase() {
    while (true) {
        messagediv = board.getElementsByClassName("message")[0];
        if (!messagediv) {
            break;
        }
        board.removeChild(messagediv);
    }
    arr = board.getElementsByClassName("snake");
    i = 0;

    levelLine = board.getElementsByClassName("line")[0];
    levelLine.innerHTML =
        "<div class=\"loadline\"></div>"+
        "<div class=\"sline\"></div>";
    var dash = setInterval(() => {
        score--;
        levelLineController();
        // console.log(i);
        if (arr[i])
            arr[i].classList.add("disappear");
        i++;
        if (i == arr.length)
            clearInterval(dash);
    }, 100);
    // }
    setTimeout(() => {
        while (true) {
            if (!board.getElementsByClassName("snake")[0]) break;
            board.removeChild(board.getElementsByClassName("snake")[0]);
        }
    }, 100 * arr.length + 500);
        
    board.removeChild(board.getElementsByClassName("food")[0]);
}

function displayMessage(select) {
    //1:hitWall 2:hitItself 3:start 4:duck
    messagediv = document.createElement("div");
    messagediv.classList.add("message");
    messagediv.style.fontSize = size * 0.8 + "px";
    messagediv.style.height = 1.1 * size+"px";
    var message;
    //select message and approximate location
    switch (select) {
        //hitWall
        case 1: {
            if (score == 0) {
                messagesHitWall.push("Hate that duck");
            }
            message = messagesHitWall[parseInt(Math.random() * messagesHitWall.length)];
            {
                headX = snake[snake.length - 1][0];
                headY = snake[snake.length - 1][1];
                if (headX < message.length / 3)
                    messagediv.style.left = snake[snake.length - 1][0] * size + .5 * size + "px";
                else
                    messagediv.style.right = 40 * size - snake[snake.length - 1][0] * size + .5 * size + "px";
                if (headY >= 18)
                    messagediv.style.top = (20 * size - snake[snake.length - 1][1] * size - .5 * size) + "px";
                else
                    messagediv.style.bottom = snake[snake.length - 1][1] * size + .5 * size + "px";
                
                if (score == 0)
                    messagesHitWall.pop;
                break;
            }
        }
        //hitItself
        case 2: {
            message = messagesHitItself[parseInt(Math.random() * messagesHitItself.length)];
            {
                headX = snake[snake.length - 1][0];
                headY = snake[snake.length - 1][1];
                if (headX < message.length / 3)
                    messagediv.style.left = snake[snake.length - 1][0] * size + .5 * size + "px";
                else
                    messagediv.style.right = 40 * size - snake[snake.length - 1][0] * size + .5 * size + "px";
                if (headY >= 18)
                    messagediv.style.top = (20 * size - snake[snake.length - 1][1] * size - .5 * size) + "px";
                else
                    messagediv.style.bottom = snake[snake.length - 1][1] * size + .5 * size + "px";
                
                break;
            }
        }
        //start message
        case 3: {
            message = messagesStart[parseInt(Math.random() * messagesStart.length)];
            {
                headX = snake[snake.length - 1][0];
                headY = snake[snake.length - 1][1];
                if (headX < message.length / 3)
                    messagediv.style.left = snake[snake.length - 1][0] * size + .5 * size + "px";
                else
                    messagediv.style.right = 40 * size - snake[snake.length - 1][0] * size + .5 * size + "px";
                if (headY >= 18)
                    messagediv.style.top = (20 * size - snake[snake.length - 1][1] * size - .5 * size) + "px";
                else
                    messagediv.style.bottom = snake[snake.length - 1][1] * size + .5 * size + "px";
                messagediv.style.backgroundColor = "#77A656";
                messagediv.style.color = "black";
                break;
            }
        }
        //quacks?!
        case 4: {
            message = messagesDuck[parseInt(Math.random() * messagesDuck.length)];
            messagediv.style.backgroundColor = "#DEAD3A";
            messagediv.style.border = "1px #000 solid";
            messagediv.style.color = "black";
            messagediv.style.left = Math.random() * 120 + "px";
            messagediv.style.top = Math.random() * 120 + "px";
            // messagediv.style.padding = 0 + "px";
        }
            break;
            
    }
    //setPosition
    {
        if (parseInt(messagediv.style.top) < 0) messagediv.style.top = 3 + "px";
        else if (parseInt(messagediv.style.top) > 19 * size) messagediv.style.top = 18.5 * size + "px";

        if (parseInt(messagediv.style.bottom) < 0) messagediv.style.bottom = 3 + "px";
        else if (parseInt(messagediv.style.bottom) > 19 * size) messagediv.style.bottom = 18.5 * size + "px";

        if (parseInt(messagediv.style.left) < 0) messagediv.style.left = 3 + "px";
        else if (parseInt(messagediv.style.left) > 39 * size) messagediv.style.left = 38.5 * size + "px";

        if (parseInt(messagediv.style.right) < 0) messagediv.style.right = 3 + "px";
        else if (parseInt(messagediv.style.right) > 39 * size) messagediv.style.right = 38.5 * size + "px";
    }
    messagediv.textContent = message;
    board.appendChild(messagediv);
    if (select == 4)
        messagediv.classList.add("disappear");
    if (select == 3)
        setTimeout(() => {
            if (messagediv)
                messagediv.classList.add("disappear");
        }, 500);
    // if (select == 2)
    setTimeout(() => {
        while (true) {
            messagediv = board.getElementsByClassName("message")[0];
            if (!messagediv) break;
            // messagediv.classList.add("disappear");
            board.removeChild(messagediv);
        }
    }, 3000);
}



function kDown(e) {
    if (game_over) return;
    console.log(e.code);
    // console.log("xvel"+xvel+" "+"yvel"+yvel);
    // console.log("nxvel"+nxvel+" "+"nyvel"+nyvel);
    if (!start) if (e.code == "Enter") { go(); }
    else return;
    if (e.code == "Space" && !game_over) { if (paused) { play(); go(); return; } pause(); return; }
    // if (paused) return;
    if (nyvel || nxvel) return;
    if (k) { nyvel = yvel; nxvel = xvel; }
    if (e.code == "ArrowUp" && yvel != -1) { yvel = 1; xvel = 0; }
    if (e.code == "ArrowDown" && yvel != 1) { yvel = -1; xvel = 0; }
    if (e.code == "ArrowRight" && xvel != -1) { xvel = 1; yvel = 0; }
    if (e.code == "ArrowLeft" && xvel != 1) { xvel = -1; yvel = 0; }
    if (k) {
        k = yvel; yvel = nyvel; nyvel = k;
        k = xvel; xvel = nxvel; nxvel = k;
    }
    k = true;
}



        //blink eyes
        //after eating
        //on start
        //on ded?
        //am hungry after 5 sec idle
        //shine tag @theworkingprototype
        //font for messages
        //font for completed
