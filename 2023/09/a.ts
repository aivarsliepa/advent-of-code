import { readLines } from "../../utils-ts";

readLines("./input.txt")
  .then(input => {
    const histories = input.map(line => line.split(" ").map(Number));
    const predictions = histories.map(getPrediction);
    return predictions.reduce((acc, curr) => acc + curr, 0);
  })
  .then(output => {
    console.log(output);
  });

function getPrediction(history: number[]): number {
  const list = [history];

  while (true) {
    const last = list[list.length - 1];
    list.push([]);
    let areAllZeroes = true;
    for (let i = 0; i < last.length - 1; i++) {
      const diff = last[i + 1] - last[i];
      list[list.length - 1].push(diff);
      if (diff !== 0) areAllZeroes = false;
    }
    if (areAllZeroes) break;
  }

  for (let i = list.length - 1; i >= 0; i--) {
    if (i === list.length - 1) {
      list[i].push(0);
    } else {
      const prevIndex = i + 1;
      const prevLast = list[prevIndex][list[prevIndex].length - 1];
      const newValue = prevLast + list[i][list[i].length - 1];
      list[i].push(newValue);
    }
  }

  return list[0][list[0].length - 1];
}
