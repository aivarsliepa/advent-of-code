import { readLines } from "../../utils.mjs";

const inputs = await readLines("input.txt");

let cycle = 0;
let signalValue = 1;
let total = 0;

const tick = () => {
  cycle++;

  if (cycle === 20 || cycle === 60 || cycle === 100 || cycle === 140 || cycle === 180 || cycle === 220) {
    total += signalValue * cycle;
  }
};

inputs.forEach(input => {
  if (input === "noop") {
    tick();
    return;
  }

  const [, value] = input.split(" ");
  tick();
  tick();
  signalValue += Number(value);
});

console.log(total);
