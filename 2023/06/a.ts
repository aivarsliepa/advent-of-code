import { readLines } from "../../utils-ts";

let total = 1;

readLines("./input.txt").then(input => {
  const times = parseLine(input[0]);
  const distances = parseLine(input[1]);

  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];

    let waysToWin = 0;
    for (let j = 1; j < time; j++) {
      if ((time - j) * j > distance) {
        waysToWin++;
      }
    }

    total *= waysToWin;
  }

  console.log(total);
});

function parseLine(line: string) {
  return line
    .split(" ")
    .filter(s => !!s)
    .slice(1)
    .map(n => parseInt(n));
}
