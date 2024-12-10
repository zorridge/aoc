const fs = require('fs').promises;
const path = require('path');

let m, n, antinodeSet;

const isAntinodeValid = (row, col) => {
  return row >= 0 && row < m && col >= 0 && col < n;
};

const resonantCollinearity = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const antennaMap = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

  m = antennaMap.length;
  n = antennaMap[0].length;

  const counter = new Map();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let antenna = antennaMap[i][j];

      if (antenna === '.') continue;

      if (!counter.has(antenna)) {
        counter.set(antenna, []);
      }

      counter.get(antenna).push(`${i},${j}`);
    }
  }

  let uniqueLocations = 0;
  antinodeSet = new Set();
  for (let antennas of counter.values()) {
    for (let [i, first] of antennas.entries()) {
      let [firstRow, firstCol] = first.split(',').map(Number);

      for (let j = i + 1; j < antennas.length; j++) {
        let [secondRow, secondCol] = antennas[j].split(',').map(Number);

        let dRow = secondRow - firstRow;
        let dCol = secondCol - firstCol;

        let firstAntinodeRow = firstRow - dRow;
        let firstAntinodeCol = firstCol - dCol;

        let secondAntinodeRow = secondRow + dRow;
        let secondAntinodeCol = secondCol + dCol;

        if (
          !antinodeSet.has(`${firstAntinodeRow},${firstAntinodeCol}`) &&
          isAntinodeValid(firstAntinodeRow, firstAntinodeCol)
        ) {
          uniqueLocations++;
        }

        if (
          !antinodeSet.has(`${secondAntinodeRow},${secondAntinodeCol}`) &&
          isAntinodeValid(secondAntinodeRow, secondAntinodeCol)
        ) {
          uniqueLocations++;
        }

        antinodeSet.add(`${firstAntinodeRow},${firstAntinodeCol}`);
        antinodeSet.add(`${secondAntinodeRow},${secondAntinodeCol}`);
      }
    }
  }

  return uniqueLocations;
};

const resonantCollinearityHarmonics = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const antennaMap = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(''));

  m = antennaMap.length;
  n = antennaMap[0].length;

  const counter = new Map();
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let antenna = antennaMap[i][j];

      if (antenna === '.') continue;

      if (!counter.has(antenna)) {
        counter.set(antenna, []);
      }

      counter.get(antenna).push(`${i},${j}`);
    }
  }

  let uniqueLocations = 0;
  antinodeSet = new Set();
  for (let antennas of counter.values()) {
    for (let [i, first] of antennas.entries()) {
      let [firstRow, firstCol] = first.split(',').map(Number);

      for (let j = i + 1; j < antennas.length; j++) {
        let [secondRow, secondCol] = antennas[j].split(',').map(Number);

        let dRow = secondRow - firstRow;
        let dCol = secondCol - firstCol;

        let firstAntinodeRow = firstRow - dRow;
        let firstAntinodeCol = firstCol - dCol;
        while (isAntinodeValid(firstAntinodeRow, firstAntinodeCol)) {
          if (!antinodeSet.has(`${firstAntinodeRow},${firstAntinodeCol}`)) {
            uniqueLocations++;
            antinodeSet.add(`${firstAntinodeRow},${firstAntinodeCol}`);
          }

          firstAntinodeRow -= dRow;
          firstAntinodeCol -= dCol;
        }

        let secondAntinodeRow = secondRow + dRow;
        let secondAntinodeCol = secondCol + dCol;
        while (isAntinodeValid(secondAntinodeRow, secondAntinodeCol)) {
          if (!antinodeSet.has(`${secondAntinodeRow},${secondAntinodeCol}`)) {
            uniqueLocations++;
            antinodeSet.add(`${secondAntinodeRow},${secondAntinodeCol}`);
          }

          secondAntinodeRow += dRow;
          secondAntinodeCol += dCol;
        }
      }
    }
  }

  for (let antennas of counter.values()) {
    for (let antenna of antennas) {
      if (!antinodeSet.has(antenna)) uniqueLocations++;
    }
  }

  return uniqueLocations;
};

resonantCollinearity().then(res => {
  console.log('Number of antinode positions:', res);
});

resonantCollinearityHarmonics().then(res => {
  console.log('Number of antinode positions with resonant harmonics:', res);
});
