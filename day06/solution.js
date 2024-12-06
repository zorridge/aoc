const fs = require('fs').promises;
const path = require('path');

const directions = [
  { dx: -1, dy: 0 }, // Up
  { dx: 0, dy: 1 }, // Right
  { dx: 1, dy: 0 }, // Down
  { dx: 0, dy: -1 } // Left
];

const dirs = ['^', '>', 'v', '<'];

const findRoute = (map, currRow, currCol, currDir) => {
  const m = map.length;
  const n = map[0].length;
  const obstacles = new Set();

  let distinctPos = 0;
  while (true) {
    if (
      currRow === 0 ||
      currRow === m - 1 ||
      currCol === 0 ||
      currCol === n - 1
    )
      return distinctPos + 1;

    if (map[currRow][currCol] !== '*') {
      map[currRow][currCol] = '*';
      distinctPos++;
    }

    let { dx, dy } = directions[currDir];
    let nextRow = currRow + dx;
    let nextCol = currCol + dy;

    if (map[nextRow][nextCol] === '#') {
      currDir = (currDir + 1) % 4;

      if (obstacles.has(`${nextRow},${nextCol},${currDir}`)) return 0;
      obstacles.add(`${nextRow},${nextCol},${currDir}`);
    } else {
      currCol = nextCol;
      currRow = nextRow;
    }
  }
};

const guardGallivant = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const map = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  const m = map.length;
  const n = map[0].length;

  let currRow,
    currCol,
    currDir = 0;

  outer: for (currRow = 0; currRow < m; currRow++) {
    for (currCol = 0; currCol < n; currCol++) {
      if (map[currRow][currCol] !== '.' && map[currRow][currCol] !== '#') {
        currDir = dirs.indexOf(map[currRow][currCol]);
        break outer;
      }
    }
  }

  return findRoute(map, currRow, currCol, currDir);
};

const guardGallivantLoop = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const map = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  const m = map.length;
  const n = map[0].length;

  let currRow,
    currCol,
    currDir = 0;

  outer: for (currRow = 0; currRow < m; currRow++) {
    for (currCol = 0; currCol < n; currCol++) {
      if (map[currRow][currCol] !== '.' && map[currRow][currCol] !== '#') {
        currDir = dirs.indexOf(map[currRow][currCol]);
        break outer;
      }
    }
  }

  let loops = 0;
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      let mapCopy = map.map(row => [...row]);
      mapCopy[row][col] = '#';
      if (findRoute(mapCopy, currRow, currCol, currDir) === 0) loops++;
    }
  }

  return loops;
};

guardGallivant().then(res => console.log('Distinct positions visited:', res));
guardGallivantLoop().then(res => console.log('Potential loops:', res));
