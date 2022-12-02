import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

let floor = 0;

input[0].split("").forEach((char, i) => {
  if (char === "(") {
    floor++;
  } else {
    floor--;
  }

  if (floor === -1) {
    console.log(i + 1);
  }
});
