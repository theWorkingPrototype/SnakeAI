var t0;
var d;
let n = 40;
let m = 20;

function find(startx, starty, endx, endy, blocks, dir) {
    var grid = [...Array(n)].map(e => Array(m));
    var vis = [...Array(n)].map(e => Array(m));
    blocks.map((block, i) => {
        grid[block[0]][block[1]] = i+1;
        return block;
    });
    vis[startx][starty] = dir;
    var q = [];
    q.push({x: startx, y: starty, t:0});
    function valid (x, y, t) {
        if(x<0 || y<0 || x>=n || y>=m) return false;
        if(vis[x][y] || grid[x][y]>=t) return false;
        return true;
    }
    while(q.length) {
        let f = q.shift();
        if(valid(f.x-1, f.y, f.t+1) && vis[f.x][f.y] != 'R') {
            q.push({x: f.x-1, y: f.y, t: f.t+1});
            vis[f.x-1][f.y] = 'L';
            grid[f.x-1][f.y] = f.t+1;
        }
        if(valid(f.x+1, f.y, f.t+1)  && vis[f.x][f.y] != 'L') {
            q.push({x: f.x+1, y: f.y, t: f.t+1});
            vis[f.x+1][f.y] = 'R';
            grid[f.x+1][f.y] = f.t+1;
        }
        if(valid(f.x, f.y+1, f.t+1) && vis[f.x][f.y] != 'D') {
            q.push({x: f.x, y: f.y+1, t: f.t+1});
            vis[f.x][f.y+1] = 'U';
            grid[f.x][f.y+1] = f.t+1;
        }
        if(valid(f.x, f.y-1, f.t+1) && vis[f.x][f.y] != 'U') {
            q.push({x: f.x, y: f.y-1, t: f.t+1});
            vis[f.x][f.y-1] = 'D';
            grid[f.x][f.y-1] = f.t+1;
        }
    }
    let path = [];
    if(vis[endx][endy]) {
        let i = endx, j = endy;
        while(!(startx == i && starty == j)) {
            path.push({x: i, y: j});
            switch(vis[i][j]) {
                case 'R':i--;break;
                case 'L':i++;break;
                case 'D':j++;break;
                case 'U':j--;break;
            }
        }
    }
    return path;
}

const e= new Event("ai");
document.addEventListener("ai", (e) => { kDown(e); });
var next = [];
var fired = false;
var AI_Enabled = true;

var path = [];
var sbody = [];
var headX;
var headY;
function ai() {
    t0 = performance.now();
    headX = snake[snake.length - 1][0];
    headY = snake[snake.length - 1][1];
    sbody = snake.slice(0, -1);
    let dir = 'R'
    if(xvel == -1) dir = 'L';
    else if(yvel == -1) dir = 'D';
    else if(yvel == 1) dir = 'U';
    var toFood = find(headX, headY, food[0], food[1], sbody, dir);
    var toTail = find(headX, headY, snake[0][0], snake[0][1], sbody, dir);
    if(!toFood.length) {
        // console.log("to food not found");
        path = toTail;
    }
    else {
        sbody.reverse();
        sbody = [ ...toFood, [headX, headY], ...sbody].map(e => {
            if(isFinite(e.x)) return [e.x, e.y];
            else return e;
        }).slice(1, snake.length+1).reverse();
        var foodToTail = find(food[0], food[1], sbody[sbody.length-1][0], sbody[sbody.length-1][1], sbody);
        if(foodToTail.length) {
            path = toFood;
        }
        else {
            // console.log("ftotail not found");
            path = toTail;
        }
    }
    next = path.pop();
    // console.log(headX, headY, next);
    if(next) {
        if (Math.abs(next.x-headX) + Math.abs(next.y-headY)!=1) {
            console.log("caliberation lost");
            // path = [];
            return 0;
        }
        if (next.x > headX) fire_Right();
        if (next.x < headX) fire_Left();
        if (next.y > headY) fire_Up();
        if (next.y < headY) fire_Down();
    }
    else dontdie();
    timeTaken = performance.now() - t0;
    if(timeTaken > 5) console.log(timeTaken);
    return timeTaken;
}


function dontdie() {
    // console.log("Dont die mode");
    if (!onSnake(headX + xvel, headY + yvel)) return;
    if (!onSnake(headX + 1, headY + 0)) fire_Right;
    else if (!onSnake(headX + 0, headY + 1)) fire_Up;
    else if (!onSnake(headX + -1, headY + 0)) fire_Left;
    else if (!onSnake(headX + 0, headY + -1)) fire_Down
}

function fire_Up(){
    if(yvel==0){
        e.code="ArrowUp";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}
function fire_Down(){
    if(yvel==0){
        e.code="ArrowDown";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}
function fire_Left(){
    if(xvel==0){
        e.code="ArrowLeft";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}
function fire_Right(){
    if(xvel==0){
        e.code="ArrowRight";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}

