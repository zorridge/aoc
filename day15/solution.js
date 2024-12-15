const fs = require('fs').promises;
const path = require('path');

const directions = {
  '^': { dRow: -1, dCol: 0 }, // Up
  '>': { dRow: 0, dCol: 1 }, // Right
  v: { dRow: 1, dCol: 0 }, // Down
  '<': { dRow: 0, dCol: -1 } // Left
};

let map, moves, m, n;

const printMap = map => {
  for (let row of map) {
    console.log(row.join(''));
  }
};

const moveCell = (row, col, move) => {
  let { dRow, dCol } = directions[move];
  let newRow = row + dRow;
  let newCol = col + dCol;

  if (map[newRow][newCol] === '#') return [row, col];
  if (map[newRow][newCol] !== '.') moveCell(newRow, newCol, move);

  let currCell = map[row][col];
  if (map[newRow][newCol] === '.') {
    map[newRow][newCol] = currCell;
    map[row][col] = '.';
    return [newRow, newCol];
  }

  return [row, col];
};

const warehouseWoes = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  const input = data
    .trim()
    .split('\n')
    .map(line => line.trim());

  let breakIndex = input.indexOf('');
  map = input.slice(0, breakIndex).map(line => line.split(''));
  moves = input
    .slice(breakIndex + 1)
    .join('')
    .split('');

  m = map.length;
  n = map[0].length;

  let startRow, startCol;
  outer: for (let [rowIndex, row] of map.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === '@') {
        startRow = rowIndex;
        startCol = colIndex;
        break outer;
      }
    }
  }

  let currRow = startRow;
  let currCol = startCol;
  for (let move of moves) {
    [currRow, currCol] = moveCell(currRow, currCol, move);
  }
  printMap(map);

  let sum = 0;
  for (let [rowIndex, row] of map.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === 'O') {
        sum += 100 * rowIndex + colIndex;
      }
    }
  }

  return sum;
};

let wideMap;

const moveCellHorizontal = (row, col, move) => {
  let { dRow, dCol } = directions[move];
  let currCell = wideMap[row][col];

  let newRow = row + dRow;
  let newCol = col + dCol;

  if (wideMap[newRow][newCol] === '#') return [row, col];
  if (wideMap[newRow][newCol] !== '.') moveCellHorizontal(newRow, newCol, move);

  if (wideMap[newRow][newCol] === '.') {
    wideMap[newRow][newCol] = currCell;
    wideMap[row][col] = '.';
    return [newRow, newCol];
  }

  return [row, col];
};

const checkVertical = (row, col, move) => {
  let { dRow } = directions[move];

  let nextRow = row + dRow;
  let left = col;
  let right = col;

  // Extend left and right bounds to find contiguous wall
  if (wideMap[row][left] === ']') left--;
  if (wideMap[row][right] === '[') right++;

  let nextLayer = wideMap[nextRow].slice(left, right + 1);
  if (nextLayer.some(cell => cell === '#')) {
    return false; // if next row contains a wall
  }
  if (nextLayer.every(cell => cell === '.')) {
    return true; // if next row is all empty
  }

  for (let col = left; col <= right; col++) {
    let cell = wideMap[nextRow][col];
    if (cell !== '.') {
      if (!checkVertical(nextRow, col, move)) return false;
    }
  }

  return true;
};

const moveCellVertical = (row, col, move) => {
  let { dRow } = directions[move];

  let nextRow = row + dRow;
  let left = col;
  let right = col;

  // Extend left and right bounds to find contiguous wall
  if (wideMap[row][left] === ']') left--;
  if (wideMap[row][right] === '[') right++;

  for (let nextCol = left; nextCol <= right; nextCol++) {
    let cell = wideMap[nextRow][nextCol];
    if (cell === '[' || cell === ']') {
      moveCellVertical(nextRow, nextCol, move);
    }

    wideMap[nextRow][nextCol] = wideMap[row][nextCol];
    wideMap[row][nextCol] = '.';
  }

  return [nextRow, col];
};

const warehouseWoesWide = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  const input = data
    .trim()
    .split('\n')
    .map(line => line.trim());

  let breakIndex = input.indexOf('');
  map = input.slice(0, breakIndex).map(line => line.split(''));
  moves = input
    .slice(breakIndex + 1)
    .join('')
    .split('');

  wideMap = [];
  for (let row of map) {
    let wideRow = [];
    for (let cell of row) {
      if (cell === '#') {
        wideRow.push('#', '#');
      } else if (cell === 'O') {
        wideRow.push('[', ']');
      } else if (cell === '.') {
        wideRow.push('.', '.');
      } else if (cell === '@') {
        wideRow.push('@', '.');
      }
    }
    wideMap.push(wideRow);
  }

  m = wideMap.length;
  n = wideMap[0].length;

  let startRow, startCol;
  outer: for (let [rowIndex, row] of wideMap.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === '@') {
        startRow = rowIndex;
        startCol = colIndex;
        break outer;
      }
    }
  }

  let currRow = startRow;
  let currCol = startCol;
  for (let move of moves) {
    if (move === '<' || move === '>') {
      [currRow, currCol] = moveCellHorizontal(currRow, currCol, move);
    } else {
      if (checkVertical(currRow, currCol, move)) {
        [currRow, currCol] = moveCellVertical(currRow, currCol, move);
      }
    }
  }
  printMap(wideMap);

  let sum = 0;
  for (let [rowIndex, row] of wideMap.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === '[') {
        sum += 100 * rowIndex + colIndex;
      }
    }
  }

  return sum;
};

warehouseWoes().then(res => {
  console.log('Sum of GPS coordinates:', res);
});

warehouseWoesWide().then(res => {
  console.log('Sum of GPS coordinates (wide):', res);
});
