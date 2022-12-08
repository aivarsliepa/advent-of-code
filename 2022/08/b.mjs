import { readLines, range } from "../../utils.mjs";

const inputs = await readLines("input.txt");

const maxY = inputs.length - 1;
const maxX = inputs[0].length - 1;

const directionScore = (arr, func) => {
  const index = arr.findIndex(func);
  return index === -1 ? arr.length : index + 1;
};

let highestScore = 0;
for (let i = 0; i <= maxY; i++) {
  for (let j = 0; j <= maxX; j++) {
    highestScore = Math.max(highestScore, score(i, j));
  }
}

function score(currY, currX) {
  if (currY === 0 || currX === 0 || currY === maxY || currX === maxX) {
    return 0;
  }

  const height = Number(inputs[currY][currX]);

  const isYSameOrHigher = (y) => Number(inputs[y][currX]) >= height;
  const isXSameOrHigher = (x) => Number(inputs[currY][x]) >= height;

  const down = directionScore(range(currY + 1, maxY), isYSameOrHigher);
  const right = directionScore(range(currX + 1, maxX), isXSameOrHigher);
  const up = directionScore(range(0, currY - 1).reverse(), isYSameOrHigher);
  const left = directionScore(range(0, currX - 1).reverse(), isXSameOrHigher);

  return down * right * up * left;
}

console.log(highestScore);
