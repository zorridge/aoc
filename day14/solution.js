const fs = require('fs').promises;
const path = require('path');

const HEIGHT = 103;
const WIDTH = 101;
const HEIGHT_MID = Math.floor(HEIGHT / 2);
const WIDTH_MID = Math.floor(WIDTH / 2);
const TIME = 100;

const restroomRedoubt = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const regex = /[-]?\d+/g;
  const robots = data
    .trim()
    .split('\n')
    .map(line => line.match(regex).map(Number));

  let quadrants = new Array(4).fill(0);
  for (let robot of robots) {
    let [x, y, dx, dy] = robot;

    let finalX = (((x + dx * TIME) % WIDTH) + WIDTH) % WIDTH;
    let finalY = (((y + dy * TIME) % HEIGHT) + HEIGHT) % HEIGHT;

    if (finalX < WIDTH_MID && finalY < HEIGHT_MID) quadrants[0]++;
    else if (finalX > WIDTH_MID && finalY < HEIGHT_MID) quadrants[1]++;
    else if (finalX < WIDTH_MID && finalY > HEIGHT_MID) quadrants[2]++;
    else if (finalX > WIDTH_MID && finalY > HEIGHT_MID) quadrants[3]++;
  }

  let safetyFactor = quadrants.reduce((prod, val) => prod * val, 1);
  return safetyFactor;
};

const move = (x, y, dx, dy) => {
  let nextX = (((x + dx) % WIDTH) + WIDTH) % WIDTH;
  let nextY = (((y + dy) % HEIGHT) + HEIGHT) % HEIGHT;

  return [nextX, nextY];
};

const restroomRedoubtTree = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const regex = /[-]?\d+/g;

  let robots = data
    .trim()
    .split('\n')
    .map(line => line.match(regex).map(Number));

  let map = Array.from({ length: HEIGHT }, () => {
    return Array.from({ length: WIDTH }, () => 0);
  });

  for (let [x, y] of robots) {
    map[y][x]++;
  }

  let seconds = 0;
  while (++seconds) {
    robots = robots.map(([x, y, dx, dy]) => {
      let [nextX, nextY] = move(x, y, dx, dy);

      map[y][x]--;
      map[nextY][nextX]++;

      return [nextX, nextY, dx, dy];
    });

    if (map.every(line => line.every(count => count <= 1))) {
      return seconds;
    }
  }
};

restroomRedoubt().then(res => {
  console.log('Safety factor:', res);
});

restroomRedoubtTree().then(res => {
  console.log('Number of seconds to display tree:', res);
});
