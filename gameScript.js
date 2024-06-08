function getComponents() {
    var board = document.getElementById("board") || new HTMLElement;
    var scoreBoard = document.getElementById("score") || new HTMLElement;
    var levelLine = document.getElementById("line") || new HTMLElement;
    return { board: board, scoreBoard: scoreBoard, levelLine: levelLine };
}
var computeCellSize = function () { return Math.min(2 * Math.floor(Math.min(1000, window.innerWidth) / 80), 2 * Math.floor(Math.min(500, window.innerHeight) / 40)); };
var defaults = {
    maxX: 40,
    maxY: 20,
    cellSize: computeCellSize(),
    startPosition: [[15, 14]],
    score: 0,
    renderInterval: 50,
    lowestRenderInterval: 10
};
var Snake = /** @class */ (function () {
    function Snake(board, startPosition, onCollision) {
        if (Snake.initialized) {
            throw new Error("Singleton classes can't be instantiated more than once");
        }
        this.body = startPosition;
        this.cellSize = defaults.cellSize;
        this.board = board;
        this.eating = false;
        this.direction = 'R';
        this.nextDirection = null;
        this.pendingUpdate = false;
        this.alive = true;
        this.eyes = [];
        this.bodyElements = this.createElements();
        this.fixEyes(this.direction);
        this.resize(defaults.cellSize);
        this.onCollision = onCollision;
        Snake.initialized = true;
    }
    Snake.prototype.eat = function () {
        this.eating = true;
    };
    Snake.prototype.resizeBlock = function (index, direction) {
        var _a = this.body[index], x = _a[0], y = _a[1];
        var element = this.bodyElements[index];
        var style = {
            left: x * this.cellSize + 1,
            bottom: y * this.cellSize + 1,
            width: this.cellSize - 2,
            height: this.cellSize - 2
        };
        switch (direction) {
            case 'R':
                style.left -= 2;
                style.width += 2;
                break;
            case 'L':
                style.width += 2;
                break;
            case 'U':
                style.bottom -= 2;
                style.height += 2;
                break;
            case 'D':
                style.height += 2;
                break;
        }
        element.style.left = style.left + 'px';
        element.style.bottom = style.bottom + 'px';
        element.style.width = style.width + 'px';
        element.style.height = style.height + 'px';
    };
    Snake.prototype.createBlock = function (block) {
        var x = block[0], y = block[1];
        var e = document.createElement('div');
        e.classList.add('snake');
        e.style.left = x * this.cellSize + 1 + 'px';
        e.style.bottom = y * this.cellSize + 1 + 'px';
        e.style.width = this.cellSize - 2 + 'px';
        e.style.height = this.cellSize - 2 + 'px';
        this.board.appendChild(e);
        return e;
    };
    Snake.prototype.createElements = function () {
        var elements = [];
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var block = _a[_i];
            var x = block[0], y = block[1];
            elements.push(this.createBlock([x, y]));
        }
        return elements;
    };
    Snake.prototype.checkCollisionWithWalls = function (block) {
        if (block[0] >= defaults.maxX || block[0] < 0
            || block[1] >= defaults.maxY || block[1] < 0) {
            return true;
        }
        return false;
    };
    Snake.prototype.checkCollisionWithBody = function (block) {
        for (var i = 0; i < this.body.length - 1; i++) {
            if (block[0] == this.body[i][0] && block[1] == this.body[i][1])
                return true;
        }
        return false;
    };
    Snake.prototype.fixEyes = function (direction) {
        if (!this.eyes.length) {
            this.eyes.push(document.createElement('div'));
            this.eyes.push(document.createElement('div'));
            this.eyes[0].classList.add('eye');
            this.eyes[1].classList.add('eye');
        }
        var head = this.bodyElements[this.bodyElements.length - 1];
        // While not blinking, the size is cellSize / 4
        this.eyes[0].style.width = this.cellSize / 4 + 'px';
        this.eyes[0].style.height = this.cellSize / 4 + 'px';
        this.eyes[1].style.width = this.cellSize / 4 + 'px';
        this.eyes[1].style.height = this.cellSize / 4 + 'px';
        this.eyes[0].style.left = 'unset';
        this.eyes[0].style.right = 'unset';
        this.eyes[0].style.top = 'unset';
        this.eyes[0].style.bottom = 'unset';
        this.eyes[1].style.left = 'unset';
        this.eyes[1].style.right = 'unset';
        this.eyes[1].style.top = 'unset';
        this.eyes[1].style.bottom = 'unset';
        switch (direction) {
            case 'R': {
                this.eyes[0].style.right = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[1].style.right = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[0].style.top = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[1].style.bottom = (this.cellSize - 2) * 1 / 6 + 'px';
                break;
            }
            case 'L': {
                this.eyes[0].style.left = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[1].style.left = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[0].style.top = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[1].style.bottom = (this.cellSize - 2) * 1 / 6 + 'px';
                break;
            }
            case 'U': {
                this.eyes[0].style.left = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[1].style.right = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[0].style.top = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[1].style.top = (this.cellSize - 2) * 1 / 5 + 'px';
                break;
            }
            case 'D': {
                this.eyes[0].style.left = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[1].style.right = (this.cellSize - 2) * 1 / 6 + 'px';
                this.eyes[0].style.bottom = (this.cellSize - 2) * 1 / 5 + 'px';
                this.eyes[1].style.bottom = (this.cellSize - 2) * 1 / 5 + 'px';
                break;
            }
        }
        head.appendChild(this.eyes[0]);
        head.appendChild(this.eyes[1]);
    };
    Snake.prototype.closeEyes = function (direction) {
        if (direction == 'R' || direction == 'L') {
            this.eyes[0].style.width = '2px';
            this.eyes[1].style.width = '2px';
        }
        else {
            this.eyes[0].style.height = '2px';
            this.eyes[1].style.height = '2px';
        }
    };
    Snake.prototype.move = function (direction) {
        var _a;
        var head = this.body[this.body.length - 1];
        var newHead = [head[0], head[1]];
        switch (direction) {
            case 'R':
                newHead[0]++;
                break;
            case 'L':
                newHead[0]--;
                break;
            case 'U':
                newHead[1]++;
                break;
            case 'D':
                newHead[1]--;
                break;
        }
        // Check collision with the board walls.
        if (this.checkCollisionWithWalls(newHead)) {
            this.alive = false;
            this.closeEyes(direction);
            this.onCollision();
            return;
        }
        this.body.push(newHead);
        this.bodyElements.push(this.createBlock(this.body[this.body.length - 1]));
        this.resizeBlock(this.bodyElements.length - 1, direction);
        this.fixEyes(direction);
        // At this point, size of body array and bodyElements array should be same.
        console.assert(this.body.length == this.bodyElements.length);
        // Check collision with snake body.
        if (this.checkCollisionWithBody(newHead)) {
            this.alive = false;
            this.onCollision();
            return;
        }
        if (this.eating) {
            // Do nothing, we dont erase the last block when the snake has eaten.
        }
        else {
            // Erase the last block.
            this.body.shift();
            var tail = this.bodyElements.shift();
            (_a = tail === null || tail === void 0 ? void 0 : tail.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(tail);
            // Also resize the last block to be a square.
            this.bodyElements[0].style.left = this.body[0][0] * this.cellSize + 1 + 'px';
            this.bodyElements[0].style.bottom = this.body[0][1] * this.cellSize + 1 + 'px';
            this.bodyElements[0].style.width = this.cellSize - 2 + 'px';
            this.bodyElements[0].style.height = this.cellSize - 2 + 'px';
        }
        this.eating = false;
    };
    Snake.prototype.resize = function (cellSize) {
        var last = null;
        var direction = null;
        for (var i = 0; i < this.body.length; i++) {
            var x = this.body[i][0];
            var y = this.body[i][1];
            if (last) {
                if (x > last[0])
                    direction = 'R';
                else if (x < last[0])
                    direction = 'L';
                else if (y > last[1])
                    direction = 'U';
                else
                    direction = 'D';
            }
            this.resizeBlock(i, direction);
            last = [x, y];
        }
        // Set the cellSize so that new cellSize is used from next iteration.
        this.cellSize = cellSize;
        this.fixEyes(direction || 'R');
    };
    Snake.prototype.step = function () {
        if (!this.alive)
            return;
        this.move(this.direction);
        if (this.nextDirection != null) {
            this.direction = this.nextDirection;
            this.nextDirection = null;
        }
        else {
            this.pendingUpdate = false;
        }
    };
    Snake.prototype._opposite = function (directionA, directionB) {
        if (directionA == 'U' && directionB == 'D' || directionA == 'D' && directionB == 'U')
            return true;
        if (directionA == 'L' && directionB == 'R' || directionA == 'R' && directionB == 'L')
            return true;
        return false;
    };
    Snake.prototype.keyDown = function (newDirection) {
        if (!(newDirection == 'L' || newDirection == 'R' || newDirection == 'U' || newDirection == 'D'))
            return;
        // Stop listening to key events if next direction is already defined.
        if (this.nextDirection)
            return;
        if (this._opposite(newDirection, this.direction))
            return;
        if (this.pendingUpdate) {
            // Current direction update was not yet executed, in this case,
            // we store the new direction and execute it in next update.
            this.nextDirection = newDirection;
        }
        else {
            // Directly update the direction if update was not pending
            // and mark pending update as true;
            this.direction = newDirection;
            this.pendingUpdate = true;
        }
    };
    return Snake;
}());
var Food = /** @class */ (function () {
    function Food(board) {
        if (Food.initialized) {
            throw new Error("Singleton classes can't be instantiated more than once.");
        }
        this.board = board;
        this.cellSize = defaults.cellSize;
        this.element = document.createElement('img');
        this.element.classList.add('food');
        this.element.setAttribute('src', 'try6.png');
        this.element.style.width = this.cellSize - 2 + "px";
        this.element.style.height = this.cellSize - 2 + "px";
        this.position = [0, 0];
        this.setNewPosition();
        this.render();
        this.board.appendChild(this.element);
        Food.initialized = true;
    }
    Food.prototype.setNewPosition = function (blocks) {
        if (blocks === void 0) { blocks = []; }
        this.position = this.getNewPosition(blocks);
    };
    Food.prototype.getNewPosition = function (blocks) {
        if (blocks === void 0) { blocks = []; }
        var newPos = [Math.floor(Math.random() * defaults.maxX), Math.floor(Math.random() * defaults.maxY)];
        var tries = 0;
        while (this.colliding(blocks, newPos) && tries < 800) {
            // TODO fix this to iterative to ensure fastness during late game.
            // return this.getNewPosition(blocks);
            newPos = [
                (newPos[0] + 1) % defaults.maxX,
                (newPos[1] + Math.floor((newPos[0] + 1) / defaults.maxX)) % defaults.maxY
            ];
            tries++;
        }
        if (tries == 800)
            return [];
        return newPos;
    };
    Food.prototype._colliding = function (blocks, position) {
        for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
            var block = blocks_1[_i];
            if (block[0] == position[0] && block[1] == position[1])
                return true;
        }
        return false;
    };
    Food.prototype.colliding = function (blocks, position) {
        return this._colliding(blocks, position || this.position);
    };
    Food.prototype.resize = function (cellSize) {
        this.cellSize = cellSize;
        this.render();
    };
    Food.prototype.render = function () {
        this.element.style.left = this.position[0] * this.cellSize + 1 + "px";
        this.element.style.bottom = this.position[1] * this.cellSize + 1 + "px";
        this.element.style.width = this.cellSize - 2 + "px";
        this.element.style.height = this.cellSize - 2 + "px";
    };
    return Food;
}());
var ScoreBoard = /** @class */ (function () {
    function ScoreBoard(element, cellSize) {
        ScoreBoard.DUCK = 'DUCK';
        ScoreBoard.SCORE = 'SCORE';
        ScoreBoard.TEXT = 'TEXT';
        this.element = element;
        this.cellSize = cellSize;
        this.current = '';
        this.interval = 0;
    }
    ScoreBoard.prototype.switchDisplay = function (prop) {
        switch (prop) {
            case ScoreBoard.DUCK: {
                this.element.style.background = "url(duck!.png) no-repeat";
                if (this.element.classList.contains('score'))
                    this.element.classList.remove('score');
                break;
            }
            case ScoreBoard.TEXT: {
                this.element.style.background = "";
                if (!this.element.classList.contains('score'))
                    this.element.classList.add('score');
                break;
            }
            case ScoreBoard.SCORE: {
                this.element.style.background = "";
                if (!this.element.classList.contains('score'))
                    this.element.classList.add('score');
                break;
            }
        }
        this.current = prop;
        this.element.textContent = "";
        this.resize(this.cellSize);
    };
    ScoreBoard.prototype.blinkText = function (text, times) {
        var _this = this;
        this.switchDisplay(ScoreBoard.TEXT);
        this.update(text);
        this.interval = setInterval(function () {
            if (times && times <= 0)
                return;
            _this.toggleVisibility();
        }, 550);
    };
    ScoreBoard.prototype.reset = function () {
        if (this.interval)
            clearInterval(this.interval);
    };
    ScoreBoard.prototype.hide = function () {
        this.element.style.visibility = 'hidden';
    };
    ScoreBoard.prototype.show = function () {
        this.element.style.visibility = 'visible';
    };
    ScoreBoard.prototype.toggleVisibility = function () {
        if (this.element.style.visibility == 'hidden') {
            this.show();
        }
        else {
            this.hide();
        }
    };
    ScoreBoard.prototype.update = function (value) {
        this.reset();
        console.assert(this.current == ScoreBoard.SCORE ||
            this.current == ScoreBoard.TEXT);
        this.element.textContent = String(value);
    };
    ScoreBoard.prototype.resize = function (cellSize) {
        this.cellSize = cellSize;
        switch (this.current) {
            case ScoreBoard.DUCK:
                this.element.style.height = "124px";
                this.element.style.width = "129px";
                this.element.style.margin = this.cellSize + "px";
                break;
            case ScoreBoard.SCORE:
                this.element.style.fontSize = 1.5 * cellSize + "px";
                this.element.style.margin = 1.6 * cellSize + "px";
                break;
            case ScoreBoard.TEXT:
                this.element.style.fontSize = cellSize + "px";
                this.element.style.margin = 1.7 * cellSize + "px";
                break;
        }
    };
    return ScoreBoard;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        if (Game.initialized) {
            throw new Error("Singleton classes can't be instantiated more than once");
        }
        this.state = {
            score: 0,
            paused: false,
            renderInterval: defaults.renderInterval,
            initialized: false
        };
        this.cellSize = defaults.cellSize;
        this.components = getComponents();
        this.snake = new Snake(this.components.board, defaults.startPosition, this.onCollision.bind(this));
        this.food = new Food(this.components.board);
        this.scoreBoard = new ScoreBoard(this.components.scoreBoard, defaults.cellSize);
        this.scoreBoard.blinkText('Enter');
        setTimeout(function () {
            _this.scoreBoard.reset();
            _this.scoreBoard.show();
        }, 10000);
        this.resize();
        this.nextRender = 0;
        this.gameLoop = this.loop.bind(this);
        this.keyDown = this._keyDown.bind(this);
        this._setUpEventListeners();
        Game.initialized = true;
    }
    Game.prototype.blinkEnterText = function () {
        var _this = this;
        this.scoreBoard.switchDisplay(ScoreBoard.TEXT);
        this.scoreBoard.update('Enter');
        setInterval(function () {
            _this.scoreBoard.toggleVisibility();
        }, 500);
        this.scoreBoard.show();
    };
    Game.prototype.updateScore = function () {
        this.scoreBoard.update(this.state.score);
        var renderInterval = Math.min(this.state.renderInterval, defaults.renderInterval - this.state.score);
        if (this.state.score > 40)
            renderInterval--;
        // For automation, putting min render interval as 0.
        this.state.renderInterval = Math.max(defaults.lowestRenderInterval, renderInterval);
    };
    Game.prototype.onCollision = function () {
        if (this.state.score == 0) {
            // Get duck!
            this.scoreBoard.switchDisplay(ScoreBoard.DUCK);
        }
        // Display end game.
    };
    Game.prototype._keyDown = function (event) {
        if (event.code == 'Enter' && this.state.score == 0) {
            this.start();
            return;
        }
        if (event.code == 'Space') {
            if (this.state.paused)
                this.start();
            else
                this.pause();
            return;
        }
        // Listen for arrow keydown events
        switch (event.code) {
            case 'ArrowUp':
                this.snake.keyDown('U');
                break;
            case 'ArrowDown':
                this.snake.keyDown('D');
                break;
            case 'ArrowLeft':
                this.snake.keyDown('L');
                break;
            case 'ArrowRight':
                this.snake.keyDown('R');
                break;
        }
    };
    Game.prototype._setUpEventListeners = function () {
        var _this = this;
        if (this.state.initialized) {
            document.removeEventListener('keydown', this.keyDown);
        }
        document.addEventListener('keydown', this.keyDown);
        document.body.onresize = function () { return _this.resize(); };
    };
    Game.prototype.resize = function () {
        var _a, _b, _c;
        this.cellSize = computeCellSize();
        this.components.board.style.height = this.cellSize * 20 + "px";
        this.components.board.style.width = this.cellSize * 40 + "px";
        this.components.board.style.left = (window.innerWidth - this.cellSize * 40) / (2) + "px";
        this.components.board.style.top = (window.innerHeight - this.cellSize * 20) / (2) + "px";
        (_a = this.snake) === null || _a === void 0 ? void 0 : _a.resize(this.cellSize);
        (_b = this.food) === null || _b === void 0 ? void 0 : _b.resize(this.cellSize);
        (_c = this.scoreBoard) === null || _c === void 0 ? void 0 : _c.resize(this.cellSize);
    };
    Game.prototype.step = function () {
        var _this = this;
        this.snake.step();
        setTimeout(function () {
            if (_this.food.colliding(_this.snake.body)) {
                _this.snake.eat();
                _this.state.score++;
                // Update the level line once the score updates.
                _this.updateScore();
                _this.food.setNewPosition(_this.snake.body);
                _this.food.render();
            }
            var move = get_move(_this.snake.body[_this.snake.body.length - 1], _this.snake.body, _this.food.position);
            _this.snake.keyDown(move);
        }, 0);
    };
    Game.prototype.loop = function () {
        var _this = this;
        if (!this.snake.alive)
            return;
        this.step();
        this.nextRender = setTimeout(function () { return window.requestAnimationFrame(_this.gameLoop); }, this.state.renderInterval);
    };
    Game.prototype.pause = function () {
        this.state.paused = true;
        clearTimeout(this.nextRender);
        this.nextRender = 0;
    };
    Game.prototype.start = function () {
        this.state.paused = false;
        this.scoreBoard.switchDisplay(ScoreBoard.SCORE);
        if (this.nextRender == 0) {
            this.loop();
        }
    };
    return Game;
}());
new Game();
// You're too sweet for me ツ
console.log('   %c^~^', 'color: gold');
console.log('  oRaNge');
