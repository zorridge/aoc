const fs = require('fs').promises;
const path = require('path');

const multiply = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const memory = data.trim();

  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const mulMatches = [...memory.matchAll(mulRegex)].map(match => ({
    first: match[1],
    second: match[2],
    index: match.index
  }));

  const insRegex = /do\(\)|don't\(\)/g;
  const insMatches = [...memory.matchAll(insRegex)].map(match => ({
    instruction: match[0],
    index: match.index
  }));

  let mulResult = 0;
  let mulPtr = 0;
  let isDo = true;

  for (const insMatch of insMatches) {
    while (
      mulPtr < mulMatches.length &&
      mulMatches[mulPtr].index < insMatch.index
    ) {
      if (isDo) {
        mulResult += mulMatches[mulPtr].first * mulMatches[mulPtr].second;
      }
      mulPtr++;
    }

    isDo = insMatch.instruction === 'do()';
  }

  while (mulPtr < mulMatches.length) {
    if (isDo) {
      mulResult += mulMatches[mulPtr].first * mulMatches[mulPtr].second;
    }
    mulPtr++;
  }

  return mulResult;
};

multiply().then(res => console.log('Result of the multiplications:', res));
