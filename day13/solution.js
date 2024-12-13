const fs = require('fs').promises;
const path = require('path');

const solveLinearSystem = (a1, b1, c1, a2, b2, c2) => {
  const mainDet = a1 * b2 - a2 * b1;
  if (mainDet === 0n) return { x: 0, y: 0 };

  const xNum = c1 * b2 - c2 * b1;
  const yNum = a1 * c2 - a2 * c1;
  const x = xNum / mainDet;
  const y = yNum / mainDet;

  if (!Number.isInteger(x) || !Number.isInteger(y)) return { x: 0, y: 0 };

  return { x, y };
};

const clawContraption = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = data
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  let configs = [];
  for (let i = 0; i < lines.length; i += 3) {
    let buttonA = lines[i];
    let buttonB = lines[i + 1];
    let prize = lines[i + 2];

    const regex = /X[+=](\d+), Y[+=](\d+)/;
    let [_buttonA, buttonAX, buttonAY] = buttonA.match(regex);
    let [_buttonB, buttonBX, buttonBY] = buttonB.match(regex);
    let [_prize, prizeX, prizeY] = prize.match(regex);

    configs.push({
      A: [buttonAX, buttonAY].map(Number),
      B: [buttonBX, buttonBY].map(Number),
      prize: [prizeX, prizeY].map(Number)
    });
  }

  let totalCost = 0;
  for (let config of configs) {
    let { x, y } = solveLinearSystem(
      config.A[0],
      config.B[0],
      config.prize[0],
      config.A[1],
      config.B[1],
      config.prize[1]
    );

    totalCost += x * 3 + y;
  }

  return totalCost;
};

const clawContraptionLarge = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = data
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '');

  let configs = [];
  for (let i = 0; i < lines.length; i += 3) {
    let buttonA = lines[i];
    let buttonB = lines[i + 1];
    let prize = lines[i + 2];

    const regex = /X[+=](\d+), Y[+=](\d+)/;
    let [_buttonA, buttonAX, buttonAY] = buttonA.match(regex);
    let [_buttonB, buttonBX, buttonBY] = buttonB.match(regex);
    let [_prize, prizeX, prizeY] = prize.match(regex);

    configs.push({
      A: [buttonAX, buttonAY].map(Number),
      B: [buttonBX, buttonBY].map(Number),
      prize: [prizeX, prizeY].map(e => Number(e) + 10000000000000)
    });
  }

  let totalCost = 0;
  for (let config of configs) {
    let { x, y } = solveLinearSystem(
      config.A[0],
      config.B[0],
      config.prize[0],
      config.A[1],
      config.B[1],
      config.prize[1]
    );

    totalCost += x * 3 + y;
  }

  return totalCost;
};

clawContraption().then(res => {
  console.log('Number of tokens required:', res);
});

clawContraptionLarge().then(res => {
  console.log('Number of tokens required (10000000000000):', res);
});

// const serialize = (x, y) => `${x},${y}`;

// const findMinimumCost = config => {
//   const buttonA = config.A;
//   const buttonB = config.B;
//   const prize = config.prize;

//   const costMap = new Map();
//   costMap.set('0,0', 0);
//   const queue = [[0, 0, 0]];

//   while (queue.length) {
//     queue.sort((a, b) => a[2] - b[2]);
//     let [x, y, currCost] = queue.shift();

//     if (x > prize[0] || y > prize[1]) continue;
//     if (x === prize[0] && y === prize[1]) return currCost;

//     let key = serialize(x, y);
//     if ((costMap.get(key) ?? Infinity) < currCost) continue;

//     let nextAX = x + buttonA[0];
//     let nextAY = y + buttonA[1];
//     let nextACost = currCost + 3;
//     let nextAKey = serialize(nextAX, nextAY);

//     if ((costMap.get(nextAKey) ?? Infinity) > nextACost) {
//       costMap.set(nextAKey, nextACost);
//       queue.push([nextAX, nextAY, nextACost]);
//     }

//     let nextBX = x + buttonB[0];
//     let nextBY = y + buttonB[1];
//     let nextBCost = currCost + 1;
//     let nextBKey = serialize(nextBX, nextBY);

//     if ((costMap.get(nextBKey) ?? Infinity) > nextBCost) {
//       costMap.set(nextBKey, nextBCost);
//       queue.push([nextBX, nextBY, nextBCost]);
//     }
//   }

//   return 0;
// };
