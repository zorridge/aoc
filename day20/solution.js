const fs = require('fs').promises;
const path = require('path');

const directions = [
  { dRow: -1, dCol: 0 }, // North
  { dRow: 0, dCol: 1 }, // East
  { dRow: 1, dCol: 0 }, // South
  { dRow: 0, dCol: -1 } // West
];

const printMap = map => {
  for (let row of map) {
    console.log(row.join('\t| '));
  }
};

const isValidPosition = (map, row, col) => {
  return (
    row >= 0 &&
    row < map.length &&
    col >= 0 &&
    col < map[0].length &&
    map[row][col] !== '#'
  );
};

const serialize = (row, col) => {
  return `${row},${col}`;
};

const getManhattanDistance = (r1, c1, r2, c2) => {
  return Math.abs(r2 - r1) + Math.abs(c2 - c1);
};

const createDistanceMatrix = (map, startRow, startCol) => {
  const distances = Array.from(map, () => {
    return Array.from(map[0], () => Infinity);
  });

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
      if (map[row][col] === '#') {
        distances[row][col] = -1;
      }
    }
  }

  distances[startRow][startCol] = 0;

  const queue = [[startRow, startCol, 0]];

  while (queue.length > 0) {
    let [currRow, currCol, currDist] = queue.shift();

    for (let { dRow, dCol } of directions) {
      let newRow = currRow + dRow;
      let newCol = currCol + dCol;
      let newDist = currDist + 1;

      if (
        isValidPosition(map, newRow, newCol) &&
        distances[newRow][newCol] === Infinity
      ) {
        distances[newRow][newCol] = newDist;
        queue.push([newRow, newCol, newDist]);
      }
    }
  }

  return distances;
};

const raceCondition = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const map = data
    .trim()
    .split('\r\n')
    .map(line => line.split(''));

  let start, end;
  for (let [rowIndex, row] of map.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === 'S') start = [rowIndex, colIndex];
      if (cell === 'E') end = [rowIndex, colIndex];
    }
  }

  const startDistances = createDistanceMatrix(map, start[0], start[1]);
  const endDistances = createDistanceMatrix(map, end[0], end[1]);

  let shortestDistance = startDistances[end[0]][end[1]];

  let numCheats = [];
  for (let row = 1; row < map.length - 1; row++) {
    for (let col = 1; col < map[0].length - 1; col++) {
      if (map[row][col] === '#') continue;

      for (let newRow = row - 20; newRow <= row + 20; newRow++) {
        for (let newCol = col - 20; newCol <= col + 20; newCol++) {
          if (
            isValidPosition(map, newRow, newCol) &&
            getManhattanDistance(row, col, newRow, newCol) <= 20
          ) {
            let newDistance =
              startDistances[row][col] +
              endDistances[newRow][newCol] +
              getManhattanDistance(row, col, newRow, newCol);
            let diff = shortestDistance - newDistance;

            if (diff > 0) numCheats.push(diff);
          }
        }
      }
    }
  }

  return numCheats.filter(n => n >= 100).length;
};

raceCondition().then(res => {
  console.log('Number of cheats:', res);
});
