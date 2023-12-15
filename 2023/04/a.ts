import { readLines } from "../../utils-ts";

let total = 0;

readLines("./input.txt").then(input => {
  input.forEach((line, lineIndex) => {
    let wins = 0;
    const numbers = line.split(":")[1].trim();
    const [winningNumbers, existingNumbers] = numbers.split(" | ");
    const winningNumbersArr = winningNumbers
      .split(" ")
      .map(n => n.trim())
      .filter(n => n !== undefined && n !== "");

    const existingNumbersArr = existingNumbers
      .split(" ")
      .map(n => n.trim())
      .filter(n => n !== undefined && n !== "");

    existingNumbersArr.forEach(n => {
      if (winningNumbersArr.includes(n)) wins++;
    });

    if (wins) {
      if (wins === 1) {
        total++;
      } else {
        total += 2 ** (wins - 1);
      }
    }
  });

  console.log(total);
});
