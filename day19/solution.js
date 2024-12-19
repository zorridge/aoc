const fs = require('fs').promises;
const path = require('path');

const makeDesign = (patterns, design) => {
  const dp = new Array(design.length + 1).fill(0);
  dp[0] = 1;

  for (let i = 0; i < design.length; i++) {
    if (dp[i] === 0) continue;

    for (let pattern of patterns) {
      if (design.slice(i, i + pattern.length) === pattern) {
        dp[i + pattern.length] += dp[i];
      }
    }
  }

  return dp[design.length];
};

const linenLayout = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');

  const patterns = data.trim().split('\r\n').at(0).split(', ');
  const designs = data.trim().split('\r\n').splice(2);

  let possibleDesigns = 0;
  for (let design of designs) {
    possibleDesigns += makeDesign(patterns, design);
  }

  return possibleDesigns;
};

linenLayout().then(res => {
  console.log('Numer of ways:', res);
});
