import { readLines } from "../../utils.mjs";

const calcArea = (l, w, h) => 2 * l * w + 2 * w * h + 2 * h * l;

const smallestSide = (l, w, h) => {
  const sides = [l * w, w * h, h * l];
  return Math.min(...sides);
};

const totalArea = (l, w, h) => {
  return calcArea(l, w, h) + smallestSide(l, w, h);
};

const input = await readLines("./input.txt");

const total = input
  .map(line => {
    const [l, w, h] = line.split("x").map(Number);
    return totalArea(l, w, h);
  })
  .reduce((acc, cur) => acc + cur, 0);

console.log(total);
