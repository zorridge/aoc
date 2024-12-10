const fs = require('fs').promises;
const path = require('path');

const diskFragmenterBlock = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const diskMap = data.trim().split('').map(Number);

  let blocks = [];
  for (let i = 0; i < diskMap.length; i++) {
    let freq = diskMap[i];
    blocks.push(...Array(freq).fill(i % 2 === 0 ? `${i / 2}` : '.'));
  }

  let left = 0;
  let right = blocks.length - 1;

  while (true) {
    while (blocks[left] !== '.') left++;
    while (blocks[right] === '.') right--;
    if (left >= right) break;

    [blocks[left], blocks[right]] = [blocks[right], blocks[left]];
  }

  let checkSum = 0;
  for (let [index, digit] of blocks.entries()) {
    if (digit === '.') break;
    checkSum += index * Number(digit);
  }

  return checkSum;
};

const diskFramgmenterFile = async () => {
  const data = await fs.readFile(path.join(__dirname, 'input.txt'), 'utf8');
  const diskMap = data.trim().split('').map(Number);

  let blocks = [];
  let fileIds = [];
  for (let i = 0; i < diskMap.length; i++) {
    let freq = diskMap[i];
    blocks.push(...Array(freq).fill(i % 2 === 0 ? `${i / 2}` : '.'));

    if (i % 2 === 0) fileIds.unshift(`${i / 2}`);
  }

  for (let fileId of fileIds) {
    let firstIndex = blocks.indexOf(fileId);
    let lastIndex = blocks.lastIndexOf(fileId);
    let fileLength = lastIndex - firstIndex + 1;

    let freeSpaceCount = 0;
    let freeSpaceIndex = -1;
    for (let i = 0; i < blocks.length && i < firstIndex; i++) {
      if (blocks[i] === '.') {
        freeSpaceCount++;
      } else {
        freeSpaceCount = 0;
      }

      if (freeSpaceCount >= fileLength) {
        freeSpaceIndex = i - fileLength + 1;
        break;
      }
    }

    if (freeSpaceIndex === -1) continue;

    blocks.splice(
      freeSpaceIndex,
      fileLength,
      ...Array(fileLength).fill(fileId)
    );

    blocks.splice(firstIndex, fileLength, ...Array(fileLength).fill('.'));
  }

  let checkSum = 0;
  for (let [index, digit] of blocks.entries()) {
    if (digit === '.') continue;
    checkSum += index * Number(digit);
  }

  return checkSum;
};

diskFragmenterBlock().then(res => {
  console.log('Filesystem checksum (block-based):', res);
});

diskFramgmenterFile().then(res => {
  console.log('Filesystem checksum (file-based):', res);
});
