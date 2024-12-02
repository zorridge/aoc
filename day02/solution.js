const fs = require('fs').promises;
const path = require('path');

const isReportIncreasing = report => {
  for (let i = 1; i < report.length; i++) {
    if (report[i - 1] >= report[i]) return false;
    if (report[i] - report[i - 1] > 3) return false;
  }

  return true;
};

const isReportDecreasing = report => {
  for (let i = 1; i < report.length; i++) {
    if (report[i - 1] <= report[i]) return false;
    if (report[i - 1] - report[i] > 3) return false;
  }

  return true;
};

const findSafeReports = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const reports = data
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number));

  let numSafeReports = 0;
  for (let report of reports) {
    if (isReportIncreasing(report) || isReportDecreasing(report)) {
      numSafeReports++;
    }
  }

  return numSafeReports;
};

const findSafeReportsWithDampener = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const reports = data
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number));

  let numSafeReports = 0;
  for (let report of reports) {
    for (let i = 0; i < report.length; i++) {
      let auxReport = [...report];
      auxReport.splice(i, 1);

      if (isReportIncreasing(auxReport) || isReportDecreasing(auxReport)) {
        numSafeReports++;
        break;
      }
    }
  }

  return numSafeReports;
};

findSafeReports().then(res => console.log('Number of safe reports:', res));
findSafeReportsWithDampener().then(res =>
  console.log('Number of safe reports with dampener:', res)
);
