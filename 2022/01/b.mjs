import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const elfs = [0];
let index = 0;

input.forEach(line => {
  if (line === "") {
    index++;
    elfs[index] = 0;
  } else {
    elfs[index] += parseInt(line, 10);
  }
});

elfs.sort((a, b) => b - a);

const top3 = elfs.slice(0, 3);
const total = top3.reduce((acc, cur) => acc + cur, 0);

console.log(total);
