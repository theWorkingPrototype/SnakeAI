var t0;
var d;
let AStar = true;
var shortestPathToTail = [];
function find(startX, startY, endX, endY, blocks) {
    // console.log(startX,startY,endX,endY,blocks)
    // console.log(blocks);
    let maxx = 39;
    let maxy =19;
    let reqPath = [];   
    let found = false;
    let allowedLength = Math.abs(endX - startX) + Math.abs(endY - startY);
    let distance = allowedLength;
    let edges = [[startX, startY]];
    let pmax = [[]];
    let edge;
    let savedBlocks=[];
    savedBlocks = blocks.slice();
    while (!found) {
        cp = pmax.shift();
        edge = edges.shift();
        allowedLength = Math.abs(endX - edge[0]) + Math.abs(endY - edge[1]);
        shortestPath(edge[0], edge[1], [], savedBlocks);
        // console.log(edge[0], edge[1],endX,endY, savedBlocks);
        savedBlocks=savedBlocks.map((a) => [a[0],a[1]- allowedLength])
        console.log(savedBlocks,edges,pmax);
    }
    console.log("-------------------")
    if (found) return reqPath;
    else return [];
    function shortestPath(xo, yo, p2, p) {
        // console.log(xo, yo, xD, yD, p2, p);
        if (performance.now() - t0 > 400) {
            found = true; return;
        }
        // generate the shortest possible path from A to B
        if (xo < 0 || xo > maxx || yo < 0 || yo > maxy) return;
        
        i = p2.length;
        // if (i > allowedLength) {
        //     return;
        // }
        if (i < blocks.length)
            j = i;
        else
            j = blocks.length;
        exists = false;
        if (j > 0) j--;
        for (; j < p.length; j++) {
            if (p[j][0] == xo * 100 + yo) {
                if (i >= p[j][1]) return;
                else p[j][1] = i;
                exists = true;
                break;
            }
            // if (Math.abs(xo - endX) + Math.abs(yo - endY) > 2 * allowedLength - distance) return;
        }
        if (!exists) {
            p.push([xo * 100 + yo, i]);
        }
        
        var p3 = p2.slice();
        if (i > allowedLength) {
            
            pmax.push([...cp, ...p2]);
            edges.push([xo, yo]);
            // console.log(edges, pmax)
            return;
        }
        p3.push(xo * 100 + yo);
        if (xo == endX && yo == endY) {
            reqPath = [...cp, ...p3];
            found = true;
            return;
        }
        let offx = 1, offy = 1;
        if(endX!=xo)
            offx = Math.abs(endX - xo) / (endX - xo);
        if(endY!=yo)
            offy = Math.abs(endY - yo) / (endY - yo);
        if (!found)
            shortestPath(xo + 0, yo + offy, p3, p);
        if (!found)
            shortestPath(xo + offx, yo + 0, p3, p);
        if (!found)
            shortestPath(xo + 0, yo - offy, p3, p);
        if (!found)
            shortestPath(xo - offx, yo + 0, p3, p);
    
        // },100)
        // p2 = [];
    }

    var t1 = performance.now();
    console.log(t1 - t0 + "ms");
    var mat=[];
    for (i = 0; i <= maxx; i++) {
        var arr=[];
        for (j = 0; j <= maxy; j++){
            arr[j] = 0;
        }
        mat[i] = arr;
    }
    for (i in reqPath) {
        mat[parseInt(reqPath[i] / 100)][reqPath[i] % 100] = i;
    }
    console.table(mat);
    
    if (found) return reqPath;
    else return [];
}

const e= new Event("ai");
document.addEventListener("ai", (e) => { kDown(e); });
// var cantFindPath = false;
var next = [];
var fired = false;
var AI_Enabled = true;

var path = [];
var sbody = [];
var headX;
var headY;
// ai();
function ai() {
    t0 = performance.now();
    headX = snake[snake.length - 1][0];
    headY = snake[snake.length - 1][1];
    fired = false;
    if (path.length) {
        next = path.shift()
            if (parseInt(next / 100) > headX) fire_Right();
            if (parseInt(next / 100) < headX) fire_Left();
            if (next % 100 > headY) fire_Up();
            if (next % 100 < headY) fire_Down();
            fired = true;
    }
    if (!path.length) {
        // if (AStar) {
            sbody = snake.slice(0, -1);
            sbody = sbody.map((a) => [a[0] * 100 + a[1], 0]);
            path = find(headX, headY, food[0], food[1], sbody);
        path.shift();
        if (path.length) {
            path.push(food[0] * 100 + food[1]);
                ai();
        }
    }
    timeTaken = performance.now() - t0;
    return timeTaken;
}


function dontdie() {
    console.log("Dont die mode")
    if (!onSnake(headX + xvel, headY + yvel)) return;
    if (!onSnake(headX + 1, headY + 0)) fire_Right;
    else if (!onSnake(headX + 0, headY + 1)) fire_Up;
    else if (!onSnake(headX + -1, headY + 0)) fire_Left;
    else if (!onSnake(headX + 0, headY + -1)) fire_Down
}

function fire_Up(){
    if(yvel==0){
    // if(freePath(pathXY[y][x],pathXY[y+1][x])){
        // console.log("Up");
        e.code="ArrowUp";
        document.dispatchEvent(e);
        return true;
    }
    // console.log("fireup-false");
    return false;
}
function fire_Down(){
    if(yvel==0){
    // if(freePath(pathXY[y][x],pathXY[y-1][x])){
        // console.log("Down");
        e.code="ArrowDown";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}
function fire_Left(){
    
    if(xvel==0){
    // if(freePath(pathXY[y][x],pathXY[y][x-1])){
        // console.log("Left");
        e.code="ArrowLeft";
        document.dispatchEvent(e);
        return true;
    }
    // console.log("fireleft-false");
    return false;
}
function fire_Right(){
    if(xvel==0){
    // if(freePath(pathXY[y][x],pathXY[y][x+1])){
        // console.log("Right");
        e.code="ArrowRight";
        document.dispatchEvent(e);
        return true;
    }
    return false;
}


