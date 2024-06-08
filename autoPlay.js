var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function get2dArray(r, c) {
    var mat = new Array(r);
    for (var i = 0; i < r; i++) {
        mat[i] = new Array(c);
    }
    return mat;
}
function gameToCart(A) {
    return [19 - A[1], A[0]];
}
var Matrix = /** @class */ (function () {
    function Matrix(r, c) {
        this.rows = r;
        this.cols = c;
        this.mat = get2dArray(r, c);
    }
    Matrix.prototype.refresh = function (blocks) {
        this.mat = get2dArray(this.rows, this.cols);
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var _a = blocks_1[_i], x = _a[0], y = _a[1];
            this.mat[x][y] = 'B';
        }
    };
    Matrix.prototype.valid = function (A) {
        if (A[0] >= this.rows || A[0] < 0)
            return false;
        if (A[1] >= this.cols || A[1] < 0)
            return false;
        return !this.mat[A[0]][A[1]];
    };
    // Algorithms to find path from a cell A to cell B.
    // We are assuming we have a very small grid with roughly 1000 cells.
    // n2 algorithms should also work.
    Matrix.prototype.bfs = function (start) {
        // console.assert(this.valid(start));
        var q = [];
        q.push(start);
        while (q.length) {
            var _a = q.shift() || [0, 0], x = _a[0], y = _a[1];
            if (this.valid([x + 1, y])) {
                q.push([x + 1, y]);
                this.mat[x + 1][y] = 'U';
            }
            if (this.valid([x - 1, y])) {
                q.push([x - 1, y]);
                this.mat[x - 1][y] = 'D';
            }
            if (this.valid([x, y + 1])) {
                q.push([x, y + 1]);
                this.mat[x][y + 1] = 'L';
            }
            if (this.valid([x, y - 1])) {
                q.push([x, y - 1]);
                this.mat[x][y - 1] = 'R';
            }
        }
    };
    Matrix.prototype._findPath = function (A, B) {
        var opposite = function (dir) {
            switch (dir) {
                case 'U': return 'D';
                case 'D': return 'U';
                case 'L': return 'R';
                case 'R': return 'L';
                default: return '';
            }
            ;
        };
        var x = B[0], y = B[1];
        if (!this.mat[x][y] || this.mat[x][y] == 'B') {
            // No path exists between A and B
            return null;
        }
        var solDir = [];
        var sol = [];
        while (!(x == A[0] && y == A[1])) {
            if (sol.length > 200) {
                debugger;
            }
            solDir.push(opposite(this.mat[x][y]));
            sol.push([x, y]);
            switch (this.mat[x][y]) {
                case 'U':
                    x = x - 1;
                    break;
                case 'D':
                    x = x + 1;
                    break;
                case 'R':
                    y = y + 1;
                    break;
                case 'L':
                    y = y - 1;
                    break;
            }
        }
        return {
            dir: solDir.reverse(),
            cells: sol.reverse()
        };
    };
    Matrix.prototype.findPath = function (A, B) {
        // first we do bfs to find shortest path to each cell.
        this.bfs(A);
        var path = this._findPath(A, B);
        if (path)
            return path.cells;
        else
            return null;
    };
    return Matrix;
}());
var Test = /** @class */ (function () {
    function Test(board, mat) {
        this.board = board;
        this.elementBoard = [];
        var r = mat.rows;
        var c = mat.cols;
        this.cellSize = computeCellSize();
        this.cleared = false;
        this.elementBoard = get2dArray(r, c);
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                var el = document.createElement('div');
                el.classList.add('snake');
                el.style.backgroundColor = 'unset';
                el.style.left = j * this.cellSize + 'px';
                el.style.top = i * this.cellSize + 'px';
                el.style.width = this.cellSize + 'px';
                el.style.height = this.cellSize + 'px';
                this.elementBoard[i][j] = el;
                board.appendChild(el);
            }
        }
    }
    Test.prototype.draw = function (mat) {
        this.cleared = false;
        var r = mat.rows;
        var c = mat.cols;
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                var el = this.elementBoard[i][j];
                // el.innerText = mat.mat[i][j] || '';
                switch (mat.mat[i][j]) {
                    case 'B': {
                        el.style.backgroundColor = 'red';
                        break;
                    }
                    default: {
                        el.style.backgroundColor = 'unset';
                        break;
                    }
                }
            }
        }
    };
    Test.prototype.drawPath = function (path, color) {
        if (color === void 0) { color = 'green'; }
        this.cleared = false;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var _a = path_1[_i], x = _a[0], y = _a[1];
            this.elementBoard[x][y].style.backgroundColor = color;
        }
    };
    Test.prototype.clear = function () {
        if (!this.cleared)
            for (var _i = 0, _a = this.elementBoard; _i < _a.length; _i++) {
                var row = _a[_i];
                for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                    var cell = row_1[_b];
                    cell.style.backgroundColor = 'unset';
                    cell.innerHTML = '';
                }
            }
        this.cleared = true;
    };
    return Test;
}());
var m = new Matrix(20, 40);
var t = new Test(getComponents().board, m);
var virtualTail = [[5, 14]];
var toTail = false;
var followingRandom = false;
var random = [];
var debug = false;
function checkCollision(block, blocks) {
    if (!block)
        return;
    for (var _i = 0, blocks_2 = blocks; _i < blocks_2.length; _i++) {
        var b = blocks_2[_i];
        if (b[0] == block[0] && b[1] == block[1])
            return true;
    }
    return false;
}
function getMoveTo(head, dest, blocks, isFood) {
    var move = '';
    var last = 0;
    for (var i = 0; i < virtualTail.length; i++) {
        if (checkCollision(head, virtualTail))
            last = i;
    }
    while (last < virtualTail.length - 1 && checkCollision(virtualTail[last], blocks)) {
        last++;
    }
    var tail = virtualTail[last];
    blocks = __spreadArray(__spreadArray([], virtualTail.slice(last + 1), true), blocks, true);
    m.refresh(blocks);
    m.bfs(head);
    var pathToFood = m._findPath(head, dest);
    var pathToTail = m._findPath(head, tail);
    toTail = false;
    if (debug) {
        t.draw(m);
        t.drawPath((pathToFood === null || pathToFood === void 0 ? void 0 : pathToFood.cells) || [], 'green');
        t.drawPath((pathToTail === null || pathToTail === void 0 ? void 0 : pathToTail.cells) || [], 'blue');
        t.drawPath(virtualTail, 'gold');
    }
    else {
        t.clear();
    }
    if (pathToFood) {
        // Check if after getting food, do we have path to the then tail.
        var virtualSnake = __spreadArray(__spreadArray([], blocks, true), pathToFood.cells, true).slice(-blocks.length - 1 - 5);
        m.refresh(virtualSnake.slice(1));
        m.bfs(dest);
        var pathToTail_1 = m._findPath(dest, virtualSnake[0]);
        if (pathToTail_1 || blocks.length < 5) {
            move = pathToFood.dir.shift() || '';
        }
        if (debug) {
            // t.draw(m);
            // t.drawPath(pathToTail?.cells || [], 'yellow');
            // t.drawPath([virtualSnake[0]], 'purple');
        }
    }
    if (move.length == 0) {
        if (pathToTail) {
            // Path to tail found but path to food not found.
            move = pathToTail.dir.shift() || '';
            toTail = true;
        }
    }
    return move;
}
function get_move(_head, _blocks, _food) {
    var head = _head.slice();
    var blocks = _blocks.slice();
    var food = _food.slice();
    head = gameToCart(head);
    food = gameToCart(food);
    for (var i = 0; i < blocks.length; i++) {
        blocks[i] = gameToCart(blocks[i]);
    }
    if (followingRandom) {
        if (random[0] == head[0] && random[1] == head[1]) {
            followingRandom = false;
            random = [];
        }
        else {
            food = random;
        }
    }
    var move = getMoveTo(head, food, blocks, !followingRandom);
    if (!move || toTail) {
        // Select a random point to go for, if we can go.
        var r = [Math.floor(Math.random() * defaults.maxY), Math.floor(Math.random() * defaults.maxX)];
        var moveToRandom = getMoveTo(head, r, blocks, false);
        if (moveToRandom) {
            followingRandom = true;
            random = r;
            move = moveToRandom;
        }
    }
    if (!checkCollision(blocks[0], virtualTail))
        virtualTail.push(blocks[0]);
    virtualTail = virtualTail.slice(-5);
    return move;
}
// Start the game by itself.
setTimeout(function () {
    var keydown = new KeyboardEvent('keydown', { code: 'Enter' });
    document.dispatchEvent(keydown);
}, 3000);
