import { readLines } from "../../utils.mjs";

const input = (await readLines("./input.txt"))[0];

for (let i = 0; i < input.length - 4; i++) {
  if (new Set(input.slice(i, i + 4)).size === 4) {
    console.log(i + 4);
    break;
  }
}
