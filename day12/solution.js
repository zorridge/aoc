const fs = require('fs').promises;
const path = require('path');

const directions = [
  { dRow: -1, dCol: 0 }, // Up
  { dRow: 0, dCol: 1 }, // Right
  { dRow: 1, dCol: 0 }, // Down
  { dRow: 0, dCol: -1 } // Left
];

let map, visited, m, n;

const dfs = (row, col, currType) => {
  if (
    row < 0 ||
    row >= m ||
    col < 0 ||
    col >= n ||
    currType !== map[row][col]
  ) {
    return [0, 1];
  }

  if (visited[row][col] === 1) return [0, 0];
  visited[row][col] = 1;

  let totalArea = 0;
  let totalPerimeter = 0;
  for (let { dRow, dCol } of directions) {
    let [area, perimeter] = dfs(row + dRow, col + dCol, currType);

    totalArea += area;
    totalPerimeter += perimeter;
  }

  return [totalArea + 1, totalPerimeter];
};

const gardenGroups = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  map = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  m = map.length;
  n = map[0].length;

  visited = Array.from({ length: m }, () => {
    return Array.from({ length: n }, () => 0);
  });

  const fences = new Map();
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      let type = map[row][col];

      if (!fences.has(type)) fences.set(type, []);

      if (!visited[row][col]) {
        let fence = dfs(row, col, type);
        fences.set(type, [...fences.get(type), fence]);
      }
    }
  }

  let totalPrice = 0;
  for (let type of fences.values()) {
    for (let [area, perimeter] of type) {
      totalPrice += area * perimeter;
    }
  }

  return totalPrice;
};

let visitedCorners;
const countCorners = (row, col) => {
  if (visitedCorners[row][col] === 1) return 0;
  visitedCorners[row][col] = 1;

  let corners = 0;
  for (let i = 0; i < directions.length; i++) {
    let normal = directions[i];
    let orthogonal = directions[(i + 1) % 4];

    let currType = map[row][col];
    let normalType =
      map[row + normal.dRow] && map[row + normal.dRow][col + normal.dCol];
    let orthogonalType =
      map[row + orthogonal.dRow] &&
      map[row + orthogonal.dRow][col + orthogonal.dCol];
    let diagonalType =
      map[row + normal.dRow + orthogonal.dRow] &&
      map[row + normal.dRow + orthogonal.dRow][
        col + normal.dCol + orthogonal.dCol
      ];

    if (currType !== normalType && currType !== orthogonalType) {
      corners++;
    } else if (
      currType === normalType &&
      currType === orthogonalType &&
      currType !== diagonalType
    ) {
      corners++;
    }
  }

  return corners;
};

const dfsSides = (row, col, currType) => {
  if (
    row < 0 ||
    row >= m ||
    col < 0 ||
    col >= n ||
    currType !== map[row][col]
  ) {
    return [0, 0];
  }

  if (visited[row][col] === 1) return [0, 0];
  visited[row][col] = 1;

  let totalArea = 0;
  let totalSides = 0;
  for (let { dRow, dCol } of directions) {
    let [area, sides] = dfsSides(row + dRow, col + dCol, currType);
    let corners = countCorners(row, col);

    totalArea += area;
    totalSides += corners + sides;
  }

  return [totalArea + 1, totalSides];
};

const gardenGroupsSides = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  map = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));
  m = map.length;
  n = map[0].length;

  visited = Array.from({ length: m }, () => {
    return Array.from({ length: n }, () => 0);
  });

  visitedCorners = Array.from({ length: m }, () => {
    return Array.from({ length: n }, () => 0);
  });

  const fences = new Map();
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      let type = map[row][col];

      if (!fences.has(type)) fences.set(type, []);

      if (!visited[row][col]) {
        let fence = dfsSides(row, col, type);
        fences.set(type, [...fences.get(type), fence]);
      }
    }
  }

  let totalPrice = 0;
  for (let type of fences.values()) {
    for (let [area, sides] of type) {
      totalPrice += area * sides;
    }
  }

  return totalPrice;
};

gardenGroups().then(res => {
  console.log('Total price of fence (perimeter):', res);
});

gardenGroupsSides().then(res => {
  console.log('Total price of fence (sides):', res);
});
