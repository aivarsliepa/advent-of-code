import { readLines } from "../../utils-ts";

let score = 0;

readLines("./input.txt")
  .then(input => {
    const pattern: string[] = [];

    for (let i = 0; i < input.length; i++) {
      if (input[i].trim().length === 0) {
        findMirror(pattern);
        pattern.length = 0;
        continue;
      }
      pattern.push(input[i]);
    }
    findMirror(pattern);
  })
  .then(output => {
    console.log(score);
  });

let patternIndex = 0;
function findMirror(pattern: string[]) {
  patternIndex++;

  const oldVertical = findVerticalMirror(pattern);
  const oldHorizontal = findHorizontalMirror(pattern);

  for (let i = 0; i < pattern.length; i++) {
    for (let j = 0; j < pattern[0].length; j++) {
      const char = pattern[i][j];
      const newChar = char === "#" ? "." : "#";
      pattern[i] = pattern[i].substring(0, j) + newChar + pattern[i].substring(j + 1);
      const vertical = findVerticalMirror(pattern, oldVertical);
      const horizontal = findHorizontalMirror(pattern, oldHorizontal);
      if (vertical) {
        score += vertical;
        return;
      }
      if (horizontal) {
        score += horizontal * 100;
        return;
      }
      pattern[i] = pattern[i].substring(0, j) + char + pattern[i].substring(j + 1);
    }
  }
}

function findVerticalMirror(pattern: string[], ignoreIndex?: number): number | undefined {
  for (let i = 1; i < pattern[0].length; i++) {
    let isMirror = true;
    if (i === ignoreIndex) {
      continue;
    }

    for (let j = 0; j < pattern.length; j++) {
      const leftString = pattern[j].substring(0, i).split("").reverse().join("");
      const rightString = pattern[j].substring(i);
      if (leftString.length > rightString.length) {
        if (!leftString.startsWith(rightString)) {
          isMirror = false;
          break;
        }
      } else {
        if (!rightString.startsWith(leftString)) {
          isMirror = false;
          break;
        }
      }
    }

    if (isMirror) {
      return i;
    }
  }

  return undefined;
}

function findHorizontalMirror(pattern: string[], ignoreIndex?: number) {
  const strings: string[] = [];
  for (let i = 0; i < pattern[0].length; i++) {
    let str = "";
    for (let j = 0; j < pattern.length; j++) {
      str += pattern[j][i];
    }
    strings.push(str);
  }

  return findVerticalMirror(strings, ignoreIndex);
}
