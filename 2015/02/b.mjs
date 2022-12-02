import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const calcRibbon = (l, w, h) => {
  const sides = [l, w, h];
  sides.sort((a, b) => a - b);
  return 2 * sides[0] + 2 * sides[1] + l * w * h;
};

const total = input
  .map(line => {
    const [l, w, h] = line.split("x").map(Number);
    return calcRibbon(l, w, h);
  })
  .reduce((acc, cur) => acc + cur, 0);

console.log(total);
