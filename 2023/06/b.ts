import { readLines } from "../../utils-ts";

readLines("./input.txt").then(input => {
  const time = parseLine(input[0]);
  const distance = parseLine(input[1]);

  let waysToWin = 0;
  for (let j = 1; j < time; j++) {
    if ((time - j) * j > distance) {
      waysToWin++;
    }
  }

  console.log(waysToWin);
});

function parseLine(line: string) {
  return parseInt(
    line
      .split(" ")
      .filter(s => !!s)
      .slice(1)
      .join(""),
  );
}
