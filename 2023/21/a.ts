import { readLinesSync, writeFile } from "../../utils-ts";

type Coords = {
  x: number;
  y: number;
};

const NORTH = Object.freeze({ x: 0, y: -1 });
const SOUTH = Object.freeze({ x: 0, y: 1 });
const EAST = Object.freeze({ x: 1, y: 0 });
const WEST = Object.freeze({ x: -1, y: 0 });

const grid: boolean[][] = [];

const input = readLinesSync("./input.txt");

const positions: Coords[] = [];
const uniquePositions = new Set<string>();

input.forEach((line, y) => {
  grid[y] = [];
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") {
      grid[y][x] = false;
    } else {
      grid[y][x] = true;
      if (line[x] === "S") {
        positions.push({ x, y });
        uniquePositions.add(getKey({ x, y }));
      }
    }
  }
});

const neighbours: Record<number, Record<number, Coords[]>> = {};

for (let y = 0; y < grid.length; y++) {
  neighbours[y] = {};
  for (let x = 0; x < grid[y].length; x++) {
    neighbours[y][x] = getNeighbours({ x, y });
  }
}

function getNeighbours(coords: Coords) {
  return [NORTH, SOUTH, EAST, WEST].map(dir => plusDirection(coords, dir)).filter(({ x, y }) => !!grid[y]?.[x]);
}

function plusDirection(coords: Coords, direction: Coords) {
  return { x: coords.x + direction.x, y: coords.y + direction.y };
}

function getKey(coords: Coords) {
  return `${coords.x},${coords.y}`;
}

const ITERATIONS = 64;

for (let i = 0; i < ITERATIONS; i++) {
  const pos = positions.slice();
  positions.length = 0;
  uniquePositions.clear();

  for (const p of pos) {
    const n = neighbours[p.y][p.x];
    for (const np of n) {
      const key = getKey(np);
      if (uniquePositions.has(key)) continue;
      positions.push({ x: np.x, y: np.y });
      uniquePositions.add(key);
    }
  }
  console.log(i, positions.length);
}

console.log(positions.length);
