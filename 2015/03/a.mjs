import { readLines } from "../../utils.mjs";

const input = (await readLines("./input.txt"))[0];

let x = 0;
let y = 0;

let houses = new Set();
houses.add(`${x},${y}`);

input.split("").forEach(char => {
  switch (char) {
    case ">":
      x++;
      break;
    case "<":
      x--;
      break;
    case "^":
      y++;
      break;
    case "v":
      y--;
      break;
  }

  houses.add(`${x},${y}`);
});

console.log(houses.size);
