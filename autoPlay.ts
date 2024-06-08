


function get2dArray(r: number, c: number): Array<Array<any>> {
  let mat:Array<Array<any>> = new Array<Array<any>>(r);
  for (let i=0;i<r;i++) {
    mat[i] = new Array<any>(c);
  }
  return mat;
}


function gameToCart(A: Array<number>) {
  return [19 - A[1], A[0]];
}


class Matrix {
  rows: number;
  cols: number;
  mat: Array<Array<string>>;
  constructor(r:number, c:number) {
    this.rows = r;
    this.cols = c;
    this.mat = get2dArray(r, c);
  }
  refresh(blocks: Array<Array<number>>) {
    this.mat = get2dArray(this.rows, this.cols);
    for (const [x, y] of blocks) {
      this.mat[x][y] = 'B';
    }
  }
  valid(A: Array<number>) {
    if (A[0] >= this.rows || A[0] < 0) return false;
    if (A[1] >= this.cols || A[1] < 0) return false;

    return !this.mat[A[0]][A[1]];
  }
  // Algorithms to find path from a cell A to cell B.
  // We are assuming we have a very small grid with roughly 1000 cells.
  // n2 algorithms should also work.
  bfs(start: Array<number>) {
    // console.assert(this.valid(start));

    let q:Array<Array<number>> = [];
    q.push(start);

    while(q.length) {
      const [x, y] = q.shift() || [0, 0];
      if (this.valid([x + 1, y])) {
        q.push([x + 1, y]); this.mat[x + 1][y] = 'U';
      }
      if (this.valid([x - 1, y])) {
        q.push([x - 1, y]); this.mat[x - 1][y] = 'D';
      }
      if (this.valid([x, y + 1])) {
        q.push([x, y + 1]); this.mat[x][y + 1] = 'L';
      }
      if (this.valid([x, y - 1])) {
        q.push([x, y - 1]); this.mat[x][y - 1] = 'R';
      }
    }
  }
  _findPath(A: Array<number>, B: Array<number>): {dir: Array<string>, cells: Array<Array<number>>} | null {
    const opposite = (dir: string) => { 
      switch(dir) {
        case 'U': return 'D';
        case 'D': return 'U';
        case 'L': return 'R';
        case 'R': return 'L';
        default: return '';
      };
    };

    let [x, y] = B;
    if (!this.mat[x][y] || this.mat[x][y] == 'B') {
      // No path exists between A and B
      return null;
    }

    let solDir:Array<string> = [];
    let sol:Array<Array<number>> = [];
    while (!(x == A[0] && y == A[1])) {
      if(sol.length > 200) {
        debugger;
      }
      solDir.push(opposite(this.mat[x][y]));
      sol.push([x, y]);
      switch (this.mat[x][y]) {
        case 'U': x = x - 1; break;
        case 'D': x = x + 1; break;
        case 'R': y = y + 1; break;
        case 'L': y = y - 1; break;
      }
    }
    return {
      dir: solDir.reverse(),
      cells: sol.reverse()
    };
  }
  findPath(A: Array<number>, B: Array<number>): Array<Array<number>> | null {
    // first we do bfs to find shortest path to each cell.
    this.bfs(A);
    
    const path = this._findPath(A, B);
    if (path) return path.cells;
    else return null;
  }
}


class Test {
  board: HTMLElement;
  elementBoard: Array<Array<HTMLElement>>;
  cellSize: number;
  cleared: boolean;
  constructor(board: HTMLElement, mat: Matrix) {
    this.board = board;
    this.elementBoard = [];
    const r = mat.rows;
    const c = mat.cols;

    this.cellSize = computeCellSize();
    this.cleared = false;

    this.elementBoard = get2dArray(r, c);
    for (let i=0;i<r;i++) {
      for (let j=0;j<c;j++) {
        const el = document.createElement('div');
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
  draw(mat: Matrix) {
    this.cleared = false;
    const r = mat.rows;
    const c = mat.cols;

    for (let i=0;i<r;i++) {
      for (let j=0;j<c;j++) {
        const el = this.elementBoard[i][j];
        // el.innerText = mat.mat[i][j] || '';
        switch (mat.mat[i][j]) {
          case 'B': {
            el.style.backgroundColor = 'red'; break;
          }
          default : {
            el.style.backgroundColor = 'unset'; break;
          }
        }
      }
    }
  }
  drawPath(path: Array<Array<number>>, color: string='green') {
    this.cleared = false;
    for (const [x, y] of path) {
      this.elementBoard[x][y].style.backgroundColor = color;
    }
  }
  clear() {
    if (!this.cleared)
    for (const row of this.elementBoard) {
      for (const cell of row) {
        cell.style.backgroundColor = 'unset';
        cell.innerHTML = '';
      }
    }
    this.cleared = true;
  }
}




let m = new Matrix(20, 40);
let t = new Test(getComponents().board, m);
let virtualTail:Array<Array<number>> = [[5, 14]];
let toTail = false;
let followingRandom = false;
let random:Array<number> = [];


let debug = false;

function checkCollision(block: Array<number>, blocks: Array<Array<number>>) {
  if (!block) return;
  for (const b of blocks) {
    if (b[0] == block[0] && b[1] == block[1]) return true;
  }
  return false;
}

function getMoveTo(head:Array<number>, dest: Array<number>, blocks: Array<Array<number>>, isFood: boolean) {

  let move = '';

  let last = 0;
  for (let i=0;i<virtualTail.length;i++) {
    if (checkCollision(head, virtualTail)) last = i;
  }

  while (last < virtualTail.length - 1 && checkCollision(virtualTail[last], blocks)) {
    last++;
  }
  const tail = virtualTail[last];
  blocks = [...virtualTail.slice(last + 1), ...blocks];
  
  m.refresh(blocks);
  m.bfs(head);

  const pathToFood = m._findPath(head, dest);
  const pathToTail = m._findPath(head, tail);
  toTail = false;

  if (debug) {
    t.draw(m);
    t.drawPath(pathToFood?.cells || [], 'green');
    t.drawPath(pathToTail?.cells || [], 'blue');
    t.drawPath(virtualTail, 'gold');
  } else {
    t.clear();
  }

  if (pathToFood) {
    // Check if after getting food, do we have path to the then tail.
    const virtualSnake = [...blocks, ...pathToFood.cells].slice(-blocks.length - 1 - 5);
    m.refresh(virtualSnake.slice(1));
    m.bfs(dest);

    const pathToTail = m._findPath(dest, virtualSnake[0]);


    if (pathToTail || blocks.length < 5) {
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

function get_move(_head: Array<number>, _blocks: Array<Array<number>>, _food: Array<number>) {
  let head = _head.slice();
  let blocks = _blocks.slice();
  let food = _food.slice();

  head = gameToCart(head);
  food = gameToCart(food);
  for (let i=0;i<blocks.length;i++) {
    blocks[i] = gameToCart(blocks[i]);
  }
  if (followingRandom) {
    if (random[0] == head[0] && random[1] == head[1]) {
      followingRandom = false;
      random = [];
    } else {
      food = random;
    }
  }

  let move = getMoveTo(head, food, blocks, !followingRandom);

  if (!move || toTail) {
    // Select a random point to go for, if we can go.
    const r = [Math.floor(Math.random() * defaults.maxY), Math.floor(Math.random() * defaults.maxX)];
    const moveToRandom = getMoveTo(head, r, blocks, false);
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
setTimeout(() => {
  let keydown = new KeyboardEvent('keydown', {code: 'Enter'});
  document.dispatchEvent(keydown); 
}, 3000);