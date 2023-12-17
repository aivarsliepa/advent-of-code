import { readLines, writeFile } from "../../utils-ts";

const ROCK = "O";
const EMPTY = ".";
const STATIC_ROCK = "#";

type Cell = typeof ROCK | typeof EMPTY | typeof STATIC_ROCK;

const grid: Cell[][] = [];

const CYCLES = 1_000_000_000;

const patterns = new Map<string, number>();

readLines("./input.txt")
  .then(input => {
    input.forEach(line => {
      grid.push(line.split("") as Cell[]);
    });

    for (let i = 0; i < CYCLES; i++) {
      tiltNorth(grid);
      tiltWest(grid);
      tiltSouth(grid);
      tiltEast(grid);

      const pattern = grid.map(line => line.join("")).join("");
      if (patterns.has(pattern)) {
        const cycle = i - patterns.get(pattern)!;
        const remaining = CYCLES - i - 1;
        i += Math.floor(remaining / cycle) * cycle;
      } else {
        patterns.set(pattern, i);
      }
    }

    return countWeight(grid);
  })
  .then(output => {
    writeFile("./output.txt", grid.map(line => line.join("")).join("\n"));
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

function tiltSouth(grid: Cell[][]) {
  for (let x = 0; x < grid[0].length; x++) {
    let lastEmpty = -1;
    for (let y = grid.length - 1; y >= 0; y--) {
      const cell = grid[y][x];
      switch (cell) {
        case ROCK:
          if (lastEmpty !== -1) {
            grid[lastEmpty][x] = ROCK;
            grid[y][x] = EMPTY;
            lastEmpty--;
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

function tiltWest(grid: Cell[][]) {
  for (let y = 0; y < grid.length; y++) {
    let lastEmpty = -1;
    for (let x = 0; x < grid[y].length; x++) {
      const cell = grid[y][x];
      switch (cell) {
        case ROCK:
          if (lastEmpty !== -1) {
            grid[y][lastEmpty] = ROCK;
            grid[y][x] = EMPTY;
            lastEmpty++;
          }
          break;
        case EMPTY:
          if (lastEmpty === -1) {
            lastEmpty = x;
          }
          break;
        case STATIC_ROCK:
          lastEmpty = -1;
          break;
      }
    }
  }
}

function tiltEast(grid: Cell[][]) {
  for (let y = 0; y < grid.length; y++) {
    let lastEmpty = -1;
    for (let x = grid[y].length - 1; x >= 0; x--) {
      const cell = grid[y][x];
      switch (cell) {
        case ROCK:
          if (lastEmpty !== -1) {
            grid[y][lastEmpty] = ROCK;
            grid[y][x] = EMPTY;
            lastEmpty--;
          }
          break;
        case EMPTY:
          if (lastEmpty === -1) {
            lastEmpty = x;
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
