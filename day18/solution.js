const fs = require('fs').promises;
const path = require('path');

const MAP_SIZE = 70 + 1;
const BYTES_SIZE = 1024;

const directions = [
  { dRow: -1, dCol: 0 }, // North
  { dRow: 0, dCol: 1 }, // East
  { dRow: 1, dCol: 0 }, // South
  { dRow: 0, dCol: -1 } // West
];

const printMap = map => {
  for (let row of map) {
    console.log(row.join(''));
  }
};

const isValidPosition = (map, row, col) => {
  return (
    row >= 0 &&
    row < MAP_SIZE &&
    col >= 0 &&
    col < MAP_SIZE &&
    map[row][col] !== '#'
  );
};

const serialize = (row, col) => {
  return `${row},${col}`;
};

const findShortestPath = map => {
  const start = [0, 0];

  const visited = new Set();
  visited.add(serialize(start[0], start[1]));

  const prev = new Map();
  prev.set(serialize(start[0], start[1]), null);

  const queue = [[...start]];
  while (queue.length > 0) {
    let [currRow, currCol] = queue.shift();
    let currCell = serialize(currRow, currCol);

    if (currRow === MAP_SIZE - 1 && currCol === MAP_SIZE - 1) {
      const path = [];
      while (currCell !== null) {
        path.unshift([currRow, currCol]);
        currCell = prev.get(currCell);
      }

      return path;
    }

    for (let { dRow, dCol } of directions) {
      let newRow = currRow + dRow;
      let newCol = currCol + dCol;
      let newCell = serialize(newRow, newCol);

      if (isValidPosition(map, newRow, newCol) && !visited.has(newCell)) {
        visited.add(newCell);
        queue.push([newRow, newCol]);
        prev.set(newCell, currCell);
      }
    }
  }

  return null;
};

const RAMRun = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const bytes = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(','));

  const map = Array.from({ length: MAP_SIZE }, () => {
    return Array.from({ length: MAP_SIZE }, () => '.');
  });

  for (let [x, y] of bytes.slice(0, BYTES_SIZE)) {
    map[y][x] = '#';
  }

  let minSteps = findShortestPath(map);
  let firstByte = [];

  for (let i = BYTES_SIZE; i < bytes.length; i++) {
    let [x, y] = bytes[i];
    map[y][x] = '#';

    if (findShortestPath(map) === null) {
      firstByte = [x, y];
      break;
    }
  }

  return {
    minSteps,
    firstByte
  };
};

RAMRun().then(res => {
  console.log('Minimum number of steps:', res.minSteps.length - 1);
  console.log('First blocking byte:', res.firstByte);
});
