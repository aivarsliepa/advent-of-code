import { readLines } from "../../utils-ts";

let memoHits = 0;
let wrongCombinations = 0;

readLines("./test-input.txt")
  .then(input => {
    return input
      .map((line, i) => {
        const start = performance.now();
        const [str, groupsStr] = line.split(" ");
        const newGroupsStr = new Array(5).fill(groupsStr).join(",");
        const newString = new Array(5).fill(str).join("?");
        const groups = newGroupsStr.split(",").map(Number);
        console.log(newString, newGroupsStr);
        wrongCombinations = 0;
        const result = countCombinations(newString, groups);
        const diff = performance.now() - start;
        console.log(result, performance.now() - start, i, memoHits, wrongCombinations);

        return result;
      })
      .reduce((acc, curr) => acc + curr, 0);
  })
  .then(output => {
    console.log(output);
  });

function countCombinations(str: string, groups: number[], strIndex = 0, groupIndex = 0, count = 0, memo: Record<string, number> = {}): number {
  if (groupIndex === groups.length && count > 0) {
    wrongCombinations++;
    return 0;
  }

  let didFinishGroup = false;
  if (count === groups[groupIndex]) {
    didFinishGroup = true;
    groupIndex++;
    count = 0;
  }

  if (strIndex === str.length) {
    if (groupIndex === groups.length) {
      return 1;
    }

    wrongCombinations++;
    return 0;
  }

  const key = `${strIndex}-${groupIndex}-${count}`;
  if (key in memo) {
    memoHits++;
    return memo[key];
  }

  const currentGroupLength = groups[groupIndex];
  const char = str[strIndex];
  const shouldBePound = count > 0 && count < currentGroupLength;
  const shouldBeDot = didFinishGroup;
  if (shouldBeDot && char === "#") {
    wrongCombinations++;
    return 0;
  }
  if (shouldBePound && char === ".") {
    wrongCombinations++;
    return 0;
  }

  let total = 0;
  const nextStrIndex = strIndex + 1;
  if (char === "?") {
    if (!shouldBeDot) {
      // pound
      total += countCombinations(str, groups, nextStrIndex, groupIndex, count + 1, memo);
    }
    if (!shouldBePound) {
      // dot
      total += countCombinations(str, groups, nextStrIndex, groupIndex, 0, memo);
    }
  } else if (char === ".") {
    total += countCombinations(str, groups, nextStrIndex, groupIndex, 0, memo);
  } else if (char === "#") {
    total += countCombinations(str, groups, nextStrIndex, groupIndex, count + 1, memo);
  }

  memo[key] = total;
  return total;
}
