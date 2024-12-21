const fs = require('fs').promises;
const path = require('path');

const directions = {
  '^': { dRow: -1, dCol: 0 }, // Up
  '>': { dRow: 0, dCol: 1 }, // Right
  v: { dRow: 1, dCol: 0 }, // Down
  '<': { dRow: 0, dCol: -1 } // Left
};

const NumericKeypad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['#', '0', 'A']
];

const DirectionalKeypad = [
  ['#', '^', 'A'],
  ['<', 'v', '>']
];

const getKeypadIndex = (keypad, element) => {
  for (let [rowIndex, row] of keypad.entries()) {
    for (let [colIndex, cell] of row.entries()) {
      if (cell === element) return [rowIndex, colIndex];
    }
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

const findShortestPath = (map, start, end) => {
  const visited = new Map();
  visited.set(serialize(start[0], start[1]), null);

  const prev = new Map();
  prev.set(serialize(start[0], start[1]), null);

  const queue = [[...start]];
  while (queue.length > 0) {
    let [currRow, currCol] = queue.shift();
    let currCell = serialize(currRow, currCol);

    if (currRow === end[0] && currCol === end[1]) {
      const path = [];
      while (prev.get(currCell) !== null) {
        path.unshift(visited.get(currCell));
        currCell = prev.get(currCell);
      }

      path.push('A');
      return path;
    }

    for (let [dirName, dir] of Object.entries(directions)) {
      let newRow = currRow + dir.dRow;
      let newCol = currCol + dir.dCol;
      let newCell = serialize(newRow, newCol);

      if (isValidPosition(map, newRow, newCol) && !visited.has(newCell)) {
        visited.set(newCell, dirName);
        queue.push([newRow, newCol]);
        prev.set(newCell, currCell);
      }
    }
  }

  return null;
};

const findAllShortestPaths = (map, start, end) => {
  const visited = new Set();
  visited.add(serialize(start[0], start[1]));

  const prev = new Map();
  prev.set(serialize(start[0], start[1]), []);

  const dist = new Map();
  dist.set(serialize(start[0], start[1]), 0);

  const queue = [[...start]];
  let shortestDist = Infinity;

  while (queue.length > 0) {
    let [currRow, currCol] = queue.shift();
    let currCell = serialize(currRow, currCol);
    let currDist = dist.get(currCell);

    if (currDist > shortestDist) continue;

    if (currRow === end[0] && currCol === end[1]) {
      shortestDist = currDist;
      continue;
    }

    for (let [dirName, dir] of Object.entries(directions)) {
      let newRow = currRow + dir.dRow;
      let newCol = currCol + dir.dCol;
      let newCell = serialize(newRow, newCol);

      if (!isValidPosition(map, newRow, newCol)) continue;

      let newDist = currDist + 1;

      if (!visited.has(newCell) || dist.get(newCell) === newDist) {
        if (!prev.has(newCell)) {
          prev.set(newCell, []);
          queue.push([newRow, newCol]);
          visited.add(newCell);
        }

        prev.get(newCell).push({
          cell: currCell,
          direction: dirName
        });

        dist.set(newCell, newDist);
      }
    }
  }

  if (!prev.has(serialize(end[0], end[1]))) {
    return null;
  }

  const allPaths = [];

  const buildPath = (currCell, path) => {
    if (prev.get(currCell).length === 0) {
      path.unshift('A'); // Add arrival marker
      allPaths.push([...path].reverse());
      path.shift(); // Remove arrival marker for backtracking
      return;
    }

    for (let prevCell of prev.get(currCell)) {
      path.push(prevCell.direction);
      buildPath(prevCell.cell, path);
      path.pop();
    }
  };

  buildPath(serialize(end[0], end[1]), []);
  return allPaths;
};

const combineSequences = (seq1, seq2) => {
  let combined = [];

  for (let s1 of seq1) {
    for (let s2 of seq2) {
      let newSeq = [...s1, ...s2];
      combined.push(newSeq);
    }
  }

  return combined;
};

const filterNestedSequences = sequences => {
  if (sequences.length === 0) return sequences;

  const minLength = Math.min(
    ...sequences.map(seq => {
      if (seq.length === 0) return Infinity;
      return seq[0].length;
    })
  );

  return sequences.filter(seq => seq.length > 0 && seq[0].length === minLength);
};

const findNextSequences = (currSequences, depth) => {
  if (depth === 2) return currSequences;

  let nextSequences = [];
  for (let sequence of currSequences) {
    let cellToCellSequences = [];

    let currIndex = 0;
    while (currIndex < sequence.length - 1) {
      let start = getKeypadIndex(DirectionalKeypad, sequence[currIndex]);
      let end = getKeypadIndex(DirectionalKeypad, sequence[currIndex + 1]);

      cellToCellSequences.push(
        findAllShortestPaths(DirectionalKeypad, start, end)
      );

      currIndex++;
    }

    let combinedSequences = cellToCellSequences[0];
    for (let i = 1; i < cellToCellSequences.length; i++) {
      combinedSequences = combineSequences(
        combinedSequences,
        cellToCellSequences[i]
      );
    }

    nextSequences.push(combinedSequences.map(seq => 'A' + seq.join('')));
  }

  nextSequences = filterNestedSequences(nextSequences).flat();
  return findNextSequences(nextSequences, depth + 1);
};

const keypadConundrum = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const codes = data.trim().split('\r\n');

  // Numeric keypad robot
  console.log('\n=== NUMERIC KEYPAD ===\n');
  let numericSequences = [];
  for (let code of codes) {
    let cellToCellSequences = [];

    let start = getKeypadIndex(NumericKeypad, 'A');
    let end = [];
    let currIndex = 0;

    while (currIndex < code.length) {
      end = getKeypadIndex(NumericKeypad, code[currIndex]);
      cellToCellSequences.push(findAllShortestPaths(NumericKeypad, start, end));
      start = end;
      currIndex++;
    }

    let combinedSequences = cellToCellSequences[0];
    for (let i = 1; i < cellToCellSequences.length; i++) {
      combinedSequences = combineSequences(
        combinedSequences,
        cellToCellSequences[i]
      );
    }

    numericSequences.push(combinedSequences.map(seq => 'A' + seq.join('')));
  }

  // Directional keypad robots
  console.log('\n=== DIRECTIONAL KEYPAD ===\n');
  let directionalSequences = [];
  for (let sequences of numericSequences) {
    let directionalSequence = findNextSequences(sequences, 0);
    directionalSequences.push(directionalSequence);
  }

  let complexitySum = 0;
  for (let [index, sequences] of directionalSequences.entries()) {
    let code = codes[index];

    complexitySum += (sequences[0].length - 1) * parseInt(code.slice(0, -1));
  }

  return complexitySum;
};

keypadConundrum().then(res => {
  console.log('Sum of complexities:', res);
});
