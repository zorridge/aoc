const fs = require('fs').promises;
const path = require('path');

const directions = [
  { dRow: -1, dCol: 0 }, // Up
  { dRow: 0, dCol: 1 }, // Right
  { dRow: 1, dCol: 0 }, // Down
  { dRow: 0, dCol: -1 } // Left
];

let m, n, topographicMap;

const dfs = (visited, prev, row, col) => {
  if (row < 0 || row >= m || col < 0 || col >= n) return 0;
  if (topographicMap[row][col] - prev !== 1) return 0;
  if (visited[row][col]) return 0;
  visited[row][col] = 1;

  if (topographicMap[row][col] === 9) return 1;

  let score = 0;
  for (let { dRow, dCol } of directions) {
    score += dfs(visited, topographicMap[row][col], row + dRow, col + dCol);
  }

  return score;
};

const hoofItScore = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  topographicMap = data
    .trim()
    .split('\n')
    .map(line => line.trim().split('').map(Number));
  m = topographicMap.length;
  n = topographicMap[0].length;

  let totalScore = 0;
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (topographicMap[row][col] === 0) {
        let visited = Array.from({ length: m }, () => {
          return Array.from({ length: n }, () => 0);
        });

        totalScore += dfs(visited, -1, row, col);
      }
    }
  }

  return totalScore;
};

const dfsRepeat = (prev, row, col) => {
  if (row < 0 || row >= m || col < 0 || col >= n) return 0;
  if (topographicMap[row][col] - prev !== 1) return 0;

  if (topographicMap[row][col] === 9) return 1;

  let rating = 0;
  for (let { dRow, dCol } of directions) {
    rating += dfsRepeat(topographicMap[row][col], row + dRow, col + dCol);
  }

  return rating;
};

const hoofItRating = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  topographicMap = data
    .trim()
    .split('\n')
    .map(line => line.trim().split('').map(Number));
  m = topographicMap.length;
  n = topographicMap[0].length;

  let totalRating = 0;
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (topographicMap[row][col] === 0) {
        totalRating += dfsRepeat(-1, row, col);
      }
    }
  }

  return totalRating;
};

hoofItScore().then(res => {
  console.log('Total trailhead score:', res);
});

hoofItRating().then(res => {
  console.log('Total trailhead rating:', res);
});
