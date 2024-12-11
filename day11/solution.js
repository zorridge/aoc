const fs = require('fs').promises;
const path = require('path');

const dp = new Map();

const blink = (stone, iteration) => {
  if (dp.has(`${stone}:${iteration}`)) {
    return dp.get(`${stone}:${iteration}`);
  }

  if (iteration === 75) return 1;

  let num;
  if (stone === '0') {
    num = blink('1', iteration + 1);
  } else if (stone.length % 2 === 0) {
    let mid = Math.ceil(stone.length / 2);
    let first = Number(stone.slice(0, mid));
    let second = Number(stone.slice(mid));

    num =
      blink(first.toString(), iteration + 1) +
      blink(second.toString(), iteration + 1);
  } else {
    let newStone = Number(stone) * 2024;
    num = blink(newStone.toString(), iteration + 1);
  }

  dp.set(`${stone}:${iteration}`, num);
  return num;
};

const plutonianPebbles = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const stones = data.trim().split(' ');

  let numOfStones = 0;
  for (let stone of stones) {
    numOfStones += blink(stone, 0);
  }

  return numOfStones;
};

plutonianPebbles().then(res => {
  console.log('Number of stones:', res);
});
