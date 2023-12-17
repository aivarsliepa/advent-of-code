import { readLines } from "../../utils-ts";

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
        const result = getCombinations(newString, groups, new Set());
        const diff = performance.now() - start;
        if (diff > 1000) {
          console.log(str, groups, result.size, performance.now() - start, i);
        }
        return result.size;
      })
      .reduce((acc, curr) => acc + curr, 0);
  })
  .then(output => {
    console.log(output);
  });

function getCombinations(line: string, groups: number[], result: Set<string>) {
  let queue: string[] = [line];
  const poundsNeeded = groups.reduce((acc, curr) => acc + curr, 0);
  const dotsNeeded = line.length - poundsNeeded;

  while (queue.length > 0) {
    let currentLine = queue.shift() as string;

    if (currentLine.includes("?")) {
      const questionMarks = currentLine.match(/\?/g)?.length || 0;
      const pounds = currentLine.match(/\#/g)?.length || 0;
      const dots = currentLine.match(/\./g)?.length || 0;

      if (dots < dotsNeeded && dotsNeeded - dots <= questionMarks) {
        queue.push(currentLine.replace("?", "."));
      }
      if (pounds < poundsNeeded && poundsNeeded - pounds <= questionMarks) {
        queue.push(currentLine.replace("?", "#"));
      }
    } else {
      let groupI = 0;
      let hasToBeSpace = false;
      for (let i = 0; i < currentLine.length; i++) {
        if (hasToBeSpace) {
          if (currentLine[i] !== ".") {
            break;
          } else {
            hasToBeSpace = false;
          }
        }

        const groupLength = groups[groupI];

        if (currentLine[i] === "#") {
          if (groupI >= groups.length || currentLine.substring(i, i + groupLength) !== "#".repeat(groupLength)) {
            break;
          }
          groupI++;
          hasToBeSpace = true;
          i += groupLength - 1;
        }

        if (i === currentLine.length - 1 && groupI === groups.length) {
          result.add(currentLine);
        }
      }
    }
  }

  return result;
}
