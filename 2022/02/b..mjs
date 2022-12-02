import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const mapping = {
  A: "rock",
  B: "paper",
  C: "scissors",
  X: "lose",
  Y: "draw",
  Z: "win",
};

const points = {
  rock: 1,
  paper: 2,
  scissors: 3,
  win: 6,
  draw: 3,
  lose: 0,
};

const mapCorrectMove = (shape, outcome) => {
  if (outcome === "win") {
    if (shape === "rock") {
      return "paper";
    }

    if (shape === "paper") {
      return "scissors";
    }

    if (shape === "scissors") {
      return "rock";
    }
  }

  if (outcome === "lose") {
    if (shape === "rock") {
      return "scissors";
    }

    if (shape === "paper") {
      return "rock";
    }

    if (shape === "scissors") {
      return "paper";
    }
  }

  return shape;
};

const calcPoints = input => {
  const [a, b] = input.split(" ").map(code => mapping[code]);
  return points[b] + points[mapCorrectMove(a, b)];
};

const result = input.map(calcPoints).reduce((acc, cur) => acc + cur, 0);

console.log(result);
