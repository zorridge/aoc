const fs = require('fs').promises;
const path = require('path');

const checkEquation = (target, values, currIndex, currSum) => {
  if (currIndex === values.length && currSum === target) return true;
  if (currIndex >= values.length || currSum > target) return false;

  let currValue = values[currIndex];
  if (currIndex === 0) {
    return checkEquation(target, values, currIndex + 1, currValue);
  } else {
    if (checkEquation(target, values, currIndex + 1, currSum + currValue)) {
      return true;
    }

    if (checkEquation(target, values, currIndex + 1, currSum * currValue)) {
      return true;
    }
  }
};

const checkEquationConcat = (target, values, currIndex, currSum) => {
  if (currIndex === values.length && currSum === target) return true;
  if (currIndex >= values.length || currSum > target) return false;

  let currValue = values[currIndex];
  if (currIndex === 0) {
    return checkEquationConcat(target, values, currIndex + 1, currValue);
  } else {
    if (
      checkEquationConcat(target, values, currIndex + 1, currSum + currValue)
    ) {
      return true;
    }

    if (
      checkEquationConcat(target, values, currIndex + 1, currSum * currValue)
    ) {
      return true;
    }

    if (
      checkEquationConcat(
        target,
        values,
        currIndex + 1,
        parseInt('' + currSum + currValue)
      )
    ) {
      return true;
    }
  }
};

const bridgeRepair = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const equationStrings = data
    .trim()
    .split('\n')
    .map(line => line.trim());

  const equations = equationStrings.map(equation => {
    const [target, values] = equation.split(':');
    return {
      target: parseInt(target),
      values: values.trim().split(' ').map(Number)
    };
  });

  let calibrationResult = 0;
  for (let equation of equations) {
    if (checkEquation(equation.target, equation.values, 0, 0)) {
      calibrationResult += equation.target;
    }
  }

  let calibrationResultConcat = 0;
  for (let equation of equations) {
    if (checkEquationConcat(equation.target, equation.values, 0, 0)) {
      calibrationResultConcat += equation.target;
    }
  }

  return [calibrationResult, calibrationResultConcat];
};

bridgeRepair().then(res => {
  console.log('Total calibration result:', res[0]);
  console.log('Total calibration result with concat:', res[1]);
});
