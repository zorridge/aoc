const fs = require('fs').promises;
const path = require('path');

const directions = [
  { dx: 0, dy: 1 }, // Right
  { dx: 0, dy: -1 }, // Left
  { dx: 1, dy: 0 }, // Down
  { dx: -1, dy: 0 }, // Up
  { dx: 1, dy: 1 }, // Down-Right
  { dx: -1, dy: -1 }, // Up-Left
  { dx: 1, dy: -1 }, // Down-Left
  { dx: -1, dy: 1 } // Up-Right
];

let n, m, chars;

const isValidPosition = (x, y) => {
  return x >= 0 && x < n && y >= 0 && y < m;
};

const searchFromPosition = (word, startX, startY, dx, dy) => {
  for (let k = 0; k < word.length; k++) {
    const x = startX + k * dx;
    const y = startY + k * dy;

    if (!isValidPosition(x, y) || chars[x][y] !== word[k]) {
      return false;
    }
  }

  return true;
};

const searchXMAS = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  chars = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  n = chars.length;
  m = chars[0].length;

  let wordsFound = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      for (let { dx, dy } of directions) {
        if (searchFromPosition('XMAS', i, j, dx, dy)) {
          wordsFound++;
        }
      }
    }
  }

  return wordsFound;
};

const searchX_MAS = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  chars = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  n = chars.length;
  m = chars[0].length;

  let wordsFound = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (
        (searchFromPosition('MAS', i, j, 1, 1) ||
          searchFromPosition('SAM', i, j, 1, 1)) &&
        (searchFromPosition('MAS', i + 2, j, -1, 1) ||
          searchFromPosition('SAM', i + 2, j, -1, 1))
      ) {
        wordsFound++;
      }
    }
  }

  return wordsFound;
};

searchXMAS().then(res => console.log('Number of "XMAS":', res));
searchX_MAS().then(res => console.log('Number of "X_MAS":', res));
