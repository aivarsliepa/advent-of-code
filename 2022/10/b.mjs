import { readLines } from "../../utils.mjs";

const inputs = await readLines("input.txt");

const screen = Array(6)
  .fill(0)
  .map(() => Array(40).fill("."));

let cycle = 0;
let signalValue = 1;

const getScreenPositionFromCycle = cycle => {
  if (cycle === 0) {
    return [0, 0];
  }

  const cycleIndex = cycle - 1;
  const cycleIndexInRow = cycleIndex % 40;
  const cycleRowIndex = Math.floor(cycleIndex / 40);

  const x = cycleIndexInRow;
  const y = cycleRowIndex;

  return [x, y];
};

const tick = () => {
  cycle++;

  const [x, y] = getScreenPositionFromCycle(cycle);
  if (Math.abs(x - signalValue) < 2) {
    screen[y][x] = "#";
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

console.log(screen.map(row => row.join("")));
