import { readLines } from "../../utils-ts";

const ROCK = "O";
const EMPTY = ".";
const STATIC_ROCK = "#";

type Cell = typeof ROCK | typeof EMPTY | typeof STATIC_ROCK;

const grid: Cell[][] = [];

readLines("./input.txt")
  .then(input => {
    input.forEach(line => {
      grid.push(line.split("") as Cell[]);
    });
    tiltNorth(grid);
    return countWeight(grid);
  })
  .then(output => {
    console.log(output);
  });

function tiltNorth(grid: Cell[][]) {
  for (let x = 0; x < grid[0].length; x++) {
    let lastEmpty = -1;
    for (let y = 0; y < grid.length; y++) {
      const cell = grid[y][x];
      switch (cell) {
        case ROCK:
          if (lastEmpty !== -1) {
            grid[lastEmpty][x] = ROCK;
            grid[y][x] = EMPTY;
            lastEmpty++;
          }
          break;
        case EMPTY:
          if (lastEmpty === -1) {
            lastEmpty = y;
          }
          break;
        case STATIC_ROCK:
          lastEmpty = -1;
          break;
      }
    }
  }
}

function countWeight(grid: Cell[][]) {
  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === ROCK) {
        total += grid.length - y;
      }
    }
  }
  return total;
}
