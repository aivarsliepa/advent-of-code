import { readLines } from "../../utils.mjs";

const input = (await readLines("./input.txt"))[0];

let santaX = 0;
let santaY = 0;

let roboX = 0;
let roboY = 0;

let houses = new Set();
houses.add(`${santaX},${santaY}`);

input.split("").forEach((char, i) => {
  if (i % 2 === 0) {
    switch (char) {
      case ">":
        santaX++;
        break;
      case "<":
        santaX--;
        break;
      case "^":
        santaY++;
        break;
      case "v":
        santaY--;
        break;
    }
  } else {
    switch (char) {
      case ">":
        roboX++;
        break;
      case "<":
        roboX--;
        break;
      case "^":
        roboY++;
        break;
      case "v":
        roboY--;
        break;
    }
  }

  houses.add(`${santaX},${santaY}`);
  houses.add(`${roboX},${roboY}`);
});

console.log(houses.size);
