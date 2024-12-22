const fs = require('fs').promises;
const path = require('path');

const fn = num => {
  num = num ^ ((num << 6) & 0xffffff);
  num = num ^ ((num >> 5) & 0xffffff);
  return num ^ ((num << 11) & 0xffffff);
};

const monkeyMarket = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const initialNumbers = data.trim().split('\r\n').map(Number);

  let sum = 0;
  let patterns = new Map();

  for (let initialNumber of initialNumbers) {
    let secretNumbers = [initialNumber];

    let secretNumber = initialNumber;
    for (let i = 0; i < 2000; i++) {
      secretNumber = fn(secretNumber);
      secretNumbers.push(secretNumber);
    }
    sum += secretNumbers.at(-1);

    let diffs = [];
    for (let i = 0; i < secretNumbers.length - 1; i++) {
      diffs.push((secretNumbers[i + 1] % 10) - (secretNumbers[i] % 10));
    }

    let seen = new Set();
    for (let i = 0; i < secretNumbers.length - 4; i++) {
      let pattern = diffs.slice(i, i + 4).join(',');

      if (!seen.has(pattern)) {
        seen.add(pattern);
        patterns.set(
          pattern,
          (patterns.get(pattern) ?? 0) + (secretNumbers[i + 4] % 10)
        );
      }
    }
  }

  return {
    sum,
    max: Math.max(...patterns.values())
  };
};

monkeyMarket().then(res => {
  console.log('Sum of secret numbers:', res.sum);
  console.log('Max bananas:', res.max);
});
