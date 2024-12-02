const fs = require('fs').promises;
const path = require('path');

const findDistance = async () => {
  const leftList = [];
  const rightList = [];

  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = data.split('\n');

  for (const line of lines) {
    const [first, second] = line.split(/\s+/).map(Number);

    leftList.push(first);
    rightList.push(second);
  }

  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  let totalDistance = 0;
  for (let i = 0; i < leftList.length; i++) {
    totalDistance += Math.abs(leftList[i] - rightList[i]);
  }

  return totalDistance;
};

const findSimilarityScore = async () => {
  const leftList = [];
  const rightList = [];

  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const lines = data.split('\n');

  for (const line of lines) {
    const [first, second] = line.split(/\s+/).map(Number);

    leftList.push(first);
    rightList.push(second);
  }

  const rightListCounter = new Map();
  for (let num of rightList) {
    rightListCounter.set(num, (rightListCounter.get(num) ?? 0) + 1);
  }

  let similarityScore = 0;
  for (let num of leftList) {
    similarityScore += (rightListCounter.get(num) ?? 0) * num;
  }

  return similarityScore;
};

findDistance().then(res => console.log('Total distance:', res));
findSimilarityScore().then(res => console.log('Similarity score:', res));
