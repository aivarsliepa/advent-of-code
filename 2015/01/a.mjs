import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

let floor = 0;

input[0].split("").forEach(char => {
  if (char === "(") {
    floor++;
  } else {
    floor--;
  }
});

console.log(floor);
