import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const naughtyStrings = new Set(["ab", "cd", "pq", "xy"]);
const vowels = new Set(["a", "e", "i", "o", "u"]);

function isNiceString(str) {
  let hasDoubleLetter = false;
  let vowelCount = 0;

  for (let i = 0; i < str.length - 1; i++) {
    if (naughtyStrings.has(str[i] + str[i + 1])) {
      return false;
    }

    if (str[i] === str[i + 1]) {
      hasDoubleLetter = true;
    }

    if (vowels.has(str[i])) {
      vowelCount++;
    }
  }

  if (vowels.has(str[str.length - 1])) {
    vowelCount++;
  }

  return hasDoubleLetter && vowelCount >= 3;
}

const niceStrings = input.filter(isNiceString);

console.log(niceStrings.length);
