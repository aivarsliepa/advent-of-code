import { readLines, range } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

const maxI = inputs.length - 1;
const maxJ = inputs[0].length - 1;

let visibleTrees = 0;
for (let i = 0; i <= maxI; i++) {
  for (let j = 0; j <= maxJ; j++) {
    if (isVisible(i, j)) visibleTrees++;
  }
}

function isVisible(currI, currJ) {
  if (currI === 0 || currJ === 0 || currI === maxI || currJ === maxJ) {
    return true;
  }

  const height = Number(inputs[currI][currJ]);
  const isILower = (i) => Number(inputs[i][currJ]) < height;
  const isJLower = (j) => Number(inputs[currI][j]) < height;

  if (range(0, currI - 1).every(isILower)) {
    return true;
  }

  if (range(currI + 1, maxI).every(isILower)) {
    return true;
  }

  if (range(0, currJ - 1).every(isJLower)) {
    return true;
  }

  if (range(currJ + 1, maxJ).every(isJLower)) {
    return true;
  }

  return false;
}

console.log(visibleTrees);
