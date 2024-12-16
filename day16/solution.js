const fs = require('fs').promises;
const path = require('path');

const { PriorityQueue } = require('@datastructures-js/priority-queue');

const directions = [
  { dRow: -1, dCol: 0 }, // North
  { dRow: 0, dCol: 1 }, // East
  { dRow: 1, dCol: 0 }, // South
  { dRow: 0, dCol: -1 } // West
];

const turnCW = dir => {
  return (dir + 1 + 4) % 4;
};

const turnACW = dir => {
  return (dir - 1 + 4) % 4;
};

const isValidMove = (map, row, col) => {
  return (
    row >= 0 &&
    row < map.length &&
    col >= 0 &&
    col < map[0].length &&
    map[row][col] !== '#'
  );
};

const reindeerMaze = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const map = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

  let start, end;
  for (let [rowIndex, row] of map.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === 'S') start = [rowIndex, colIndex];
      if (cell === 'E') end = [rowIndex, colIndex];
    }
  }

  const lowestPaths = new Set();

  const minPQ = new PriorityQueue((a, b) => a.cost - b.cost);
  minPQ.enqueue({
    row: start[0],
    col: start[1],
    dir: 1,
    cost: 0,
    path: new Set()
  });

  const visited = new Map();

  let lowestCost = Infinity;
  while (!minPQ.isEmpty()) {
    let { row, col, dir, cost, path } = minPQ.dequeue();

    if (cost > lowestCost) break;

    // Prune self-loop
    let pathStateKey = `${row},${col}`;
    if (path.has(pathStateKey)) continue;
    path.add(pathStateKey);

    // Prune higher cost states
    let mapStateKey = `${row},${col},${dir}`;
    if (!visited.has(mapStateKey)) visited.set(mapStateKey, cost);
    if (cost > visited.get(mapStateKey)) continue;

    if (row === end[0] && col === end[1]) {
      if (cost < lowestCost) lowestCost = cost;

      if (cost === lowestCost) {
        path.forEach(cell => lowestPaths.add(cell));
      }

      continue;
    }

    let { dRow, dCol } = directions[dir];
    let newRow = row + dRow;
    let newCol = col + dCol;
    if (isValidMove(map, newRow, newCol)) {
      minPQ.enqueue({
        row: newRow,
        col: newCol,
        dir: dir,
        cost: cost + 1,
        path: new Set(path)
      });
    }

    let dirCW = turnCW(dir);
    let { dRow: dRowCW, dCol: dColCW } = directions[dirCW];
    let newRowCW = row + dRowCW;
    let newColCW = col + dColCW;
    if (isValidMove(map, newRowCW, newColCW)) {
      minPQ.enqueue({
        row: newRowCW,
        col: newColCW,
        dir: dirCW,
        cost: cost + 1000 + 1,
        path: new Set(path)
      });
    }

    let dirACW = turnACW(dir);
    let { dRow: dRowACW, dCol: dColACW } = directions[dirACW];
    let newRowACW = row + dRowACW;
    let newColACW = col + dColACW;
    if (isValidMove(map, newRowACW, newColACW)) {
      minPQ.enqueue({
        row: newRowACW,
        col: newColACW,
        dir: dirACW,
        cost: cost + 1000 + 1,
        path: new Set(path)
      });
    }
  }

  return {
    lowestCost,
    uniquePathCells: lowestPaths.size
  };
};

reindeerMaze().then(res => {
  console.log('Lowest score:', res.lowestCost);
  console.log('Unique cells:', res.uniquePathCells);
});
