

class node{
    constructor(x, y, from, to) {
        this.x = x;
        this.y = y;
        this.from = from;
        this.to = to;
        this.neighbours = [];
    }
    connectTo(n) {
        this.to = n;
    }
}

function connect(x, y) {
    x.to = y;
    y.from = x;
}

function createNodes() {
    arr = [];
    for (var i = 0; i < 20; i++){
        arr.push(0);
    }
    for (i = 0; i < 40; i++){
        grid.push(arr.slice());
    }
    for (var i = 0; i < 40; i++){
        for (var j = 0; j < 20; j++){
            grid[i][j] = new node(i, j);
        }
    }
    var i = 0, j = 1;
    for (var i = 0; i < 20; i++){
        j = 1;
        grid[0][i].from = grid[0][i + 1];
        grid[0][i].to = grid[0][i - 1];

        grid[1][i].from = grid[1][i - 1];
        grid[1][i].to = grid[2][i];
        for (j = 2; j < 39; j++){
            grid[j][i].from = grid[j - 1][i];
            grid[j][i].to = grid[j + 1][i];
        }
        grid[j][i].from = grid[j - 1][i];
        grid[j][i].to = grid[j][i + 1];
        grid[j][i + 1].from = grid[j][i];
        grid[j][i + 1].to = grid[j - 1][i + 1];
        i++;

        
        grid[0][i].from = grid[0][i + 1];
        grid[0][i].to = grid[0][i - 1];

        for (j--; j > 1; j--) {
            grid[j][i].from = grid[j + 1][i];
            grid[j][i].to = grid[j - 1][i];
        }
        grid[1][i].from = grid[2][i];
        grid[1][i].to = grid[1][i + 1];
    }
    grid[1][0].from = grid[0][0];
    grid[1][19].to = grid[0][19];
    grid[0][19].from = grid[1][19];
    grid[0][0].to = grid[1][0];
}
function displaygrid(grid) {
    eraseGrid();
    k = 1 / 800;
    var node = grid[parseInt(Math.random() * 39)][parseInt(Math.random() * 19)];
    // for (var i = 0; i < grid.length; i++) {
    //     for (var j = 0; j < grid[i].length; j++) {
    while (node.to && k < 1) {
        i = node.x;
        j = node.y;
        // if (grid[i][j].from && grid[i][j].to) {
        let div = document.createElement("div");
        div.classList.add("node");
        div.style.backgroundColor = "white";
        div.style.width = size + "px";
        div.style.height = size + "px";
        div.style.left = i * size + "px";
        div.style.bottom = j * size + "px";
        div.style.opacity = k;
        k += 1 / 800;
        // div.style.border = size / 10 + "px";
        board.appendChild(div);
        div = null;
        node = node.to;
        // }
    }
    //     }
    // }
}
function eraseGrid() {
    arr = [...board.getElementsByClassName("node")];
    while (arr.length) {
        board.removeChild(arr.shift());
    }
}




















var grid = [];
createNodes();
// function generateGrid() {
//     n = 1;
//     var arr =[];
//     for (var j = 1; j < 40; j++) {
//         arr.push(n++);
//     }
//     var arr2 = arr.slice();
//     arr2.reverse();
//     for (var i = 0; i < 10; i++){
//         grid.push([...[0],...arr.map((a) => a + 2*i*39).slice()]);
//         grid.push([...[0],...arr2.map((a) => a + (2*i+1)*39).slice()]);
//     }
//     print(grid);
// }
function print(x) {
    console.log(x);
}














function addneighbourhood() {
    var i, j;
    for (i = 0; i < 40; i++){
        for (j = 0; j < 20; j++){
            if (grid[i + 1]) grid[i][j].neighbours.push(grid[i + 1][j]);
            if (grid[i][j + 1]) grid[i][j].neighbours.push(grid[i][j+1]);
            if (grid[i - 1]) grid[i][j].neighbours.push(grid[i - 1][j]);
            if (grid[i][j - 1]) grid[i][j].neighbours.push(grid[i][j - 1]);

        }
    }
}













addneighbourhood();


const e= new Event("ai");
document.addEventListener("ai", (e) => { kDown(e); });
var headX;
var headY;
// ai();
function ai() {
    t0 = performance.now();
    headX = snake[snake.length - 1][0];
    headY = snake[snake.length - 1][1];
    // let next = grid[headX][headY].to;
    // console.log(next);
    // console.log(headX, headY, next.x, next.y);
    let dist = [];
    let head = grid[headX][headY];
    for (i in head.neighbours) {
        dist.push([Math.abs(food[0] - head.neighbours[i].x) + Math.abs(food[1] - head.neighbours[i].y)
            - Math.abs(food[0] - head.x) - Math.abs(food[1] - head.y), head.neighbours[i]]);
    }

    // console.log(dist.slice());

    dist.sort((a, b) => a[0] - b[0]);
    // console.log(dist.slice());
    let n = [];
    while(dist.length) {
        n = dist.shift();
        if (n[1] == head.from) continue;
        next = n[1];
        if (next == grid[headX][headY].to) {
            fire(next);
            return performance.now() - t0;
        }
        // console.log(next);
        let xdash = next.x + (head.to.x - head.x);
        let ydash = next.y + (head.to.y - head.y);
        let dash = grid[xdash][ydash];
        // console.log(dash);
        let curr = head.to;

        if (dash.to != next) continue;
        let cycle = [];
        while (curr != dash||cycle.length>78) {
            cycle.push(curr);
            curr = curr.to;
        }
        // displaygrid(grid);
        //     next    dash
        //     head   head.to
        curr = head.to;
        let c=1
        while (curr != dash||c>78) {
            // console.log(curr);
            for (i in curr.neighbours) {
                console.log(i);
                t = curr.neighbours[i];
                if (t == curr.to || t == curr.from) continue;
                let b = false;
                for (i in cycle) {
                    if (cycle[i] == t) { b = true; break; }
                }
                if (b) continue;
                // console.log(t);
                d = grid[t.x + (curr.to.x - curr.x)][t.y + (curr.to.y - curr.y)];
                if (d == head) continue;
                if (d.to == t) {
                    join(d, curr.to);
                    join(curr, t);

                    join(dash, head.to);
                    join(head, next);

                    displaygrid(grid);
                    fire(next);
                    return performance.now() - t0;
                }
            }
            curr = curr.to; c++;
        }
    }
}
function join(a, b) {
    a.to = b;
    b.from = a;
}
function fire(lala) {
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

