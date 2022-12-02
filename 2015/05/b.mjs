import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

function isNiceString(str) {
  let hasDoubleLetter = false;

  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] === str[i + 2]) {
      hasDoubleLetter = true;
      break;
    }
  }

  if (!hasDoubleLetter) {
    return false;
  }

  const pairs = new Map();

  for (let i = 0; i < str.length - 1; i++) {
    const pair = str[i] + str[i + 1];
    if (pairs.has(pair)) {
      pairs.get(pair).push(i);
    } else {
      pairs.set(pair, [i]);
    }
  }

  for (const [pair, indices] of pairs) {
    if (indices.length < 2) continue;
    const indexesSorted = indices.sort((a, b) => a - b);
    if (indexesSorted[indexesSorted.length - 1] - indexesSorted[0] > 1) {
      return true;
    }
  }

  return false;
}

const niceStrings = input.filter(isNiceString);

console.log(niceStrings.length);
