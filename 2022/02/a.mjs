import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const mapping = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

const points = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

// a - opponent
// b - player
const pointsForWinOrDraw = (a, b) => {
  if (a === b) {
    return 3;
  }

  if (b === "rock" && a === "scissors") {
    return 6;
  }

  if (b === "paper" && a === "rock") {
    return 6;
  }

  if (b === "scissors" && a === "paper") {
    return 6;
  }

  return 0;
};

const result = input
  .map(line => {
    const [a, b] = line.split(" ").map(code => mapping[code]);
    return pointsForWinOrDraw(a, b) + points[b];
  })
  .reduce((acc, cur) => acc + cur, 0);

console.log(result);
