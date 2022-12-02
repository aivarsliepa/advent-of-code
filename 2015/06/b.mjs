import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

const parseInstruction = instruction => {
  const action = instruction.startsWith("turn on") ? "on" : instruction.startsWith("turn off") ? "off" : "toggle";
  const [x1, y1] = instruction.split(" ")[action === "toggle" ? 1 : 2].split(",").map(Number);
  const [x2, y2] = instruction.split(" ")[action === "toggle" ? 3 : 4].split(",").map(Number);
  return { action, x1, y1, x2, y2 };
};

const grid = Array(1000)
  .fill(0)
  .map(() => Array(1000).fill(0));

input.forEach(instruction => {
  const { action, x1, y1, x2, y2 } = parseInstruction(instruction);
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      switch (action) {
        case "on":
          grid[x][y]++;
          break;
        case "off":
          grid[x][y] = Math.max(0, grid[x][y] - 1);
          break;
        case "toggle":
          grid[x][y] += 2;
          break;
      }
    }
  }
});

const total = grid.reduce((acc, row) => acc + row.reduce((acc, cell) => acc + cell, 0), 0);

console.log(total);
