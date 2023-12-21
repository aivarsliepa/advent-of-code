import { readLinesSync, writeFile } from "../../utils-ts";
import * as math from "mathjs";

const ITERATIONS = 502;

type Coords = {
  x: number;
  y: number;
};

type GlobalCoords = {
  coords: Coords;
  grid: Coords;
};

const NORTH = Object.freeze({ x: 0, y: -1 });
const SOUTH = Object.freeze({ x: 0, y: 1 });
const EAST = Object.freeze({ x: 1, y: 0 });
const WEST = Object.freeze({ x: -1, y: 0 });

const grid: boolean[][] = [];

const input = readLinesSync("./input.txt");

const positions: GlobalCoords[] = [];
const uniquePositions = new Set<string>();

input.forEach((line, y) => {
  grid[y] = [];
  for (let x = 0; x < line.length; x++) {
    if (line[x] === "#") {
      grid[y][x] = false;
    } else {
      grid[y][x] = true;
      if (line[x] === "S") {
        const coords = {
          coords: { x, y },
          grid: { x: 0, y: 0 },
        };
        positions.push(coords);
        uniquePositions.add(getKey(coords));
      }
    }
  }
});

// infinite reapeating grid
function getNeighbours(globalCoords: GlobalCoords) {
  return [NORTH, SOUTH, EAST, WEST].map(dir => plusDirection2(globalCoords, dir)).filter(coords => grid[coords.coords.y][coords.coords.x]);
}

function plusDirection(globalCoords: GlobalCoords, direction: Coords): GlobalCoords {
  const newGlobalCoords: GlobalCoords = {
    coords: { x: globalCoords.coords.x + direction.x, y: globalCoords.coords.y + direction.y },
    grid: globalCoords.grid,
  };
  if (newGlobalCoords.coords.x < 0) {
    newGlobalCoords.coords.x = grid[0].length - 1;
    newGlobalCoords.grid.x--;
  } else if (newGlobalCoords.coords.x >= grid[0].length) {
    newGlobalCoords.coords.x = 0;
    newGlobalCoords.grid.x++;
  }

  if (newGlobalCoords.coords.y < 0) {
    newGlobalCoords.coords.y = grid.length - 1;
    newGlobalCoords.grid.y--;
  } else if (newGlobalCoords.coords.y >= grid.length) {
    newGlobalCoords.coords.y = 0;
    newGlobalCoords.grid.y++;
  }

  return newGlobalCoords;
}

function plusDirection2(globalCoords: GlobalCoords, direction: Coords): GlobalCoords {
  const gridWidth = grid[0].length;
  const gridHeight = grid.length;

  let newX = globalCoords.coords.x + direction.x;
  let newY = globalCoords.coords.y + direction.y;

  const newGlobalCoords: GlobalCoords = {
    coords: {
      x: newX >= 0 ? newX % gridWidth : gridWidth - 1,
      y: newY >= 0 ? newY % gridHeight : gridHeight - 1,
    },
    grid: {
      x: globalCoords.grid.x + (newX < 0 ? -1 : newX >= gridWidth ? 1 : 0),
      y: globalCoords.grid.y + (newY < 0 ? -1 : newY >= gridHeight ? 1 : 0),
    },
  };

  return newGlobalCoords;
}

function getKey(coords: GlobalCoords) {
  return `${coords.grid.x},${coords.grid.y},${coords.coords.x},${coords.coords.y}`;
}

const cycleDetection = new Map<string, number>();

const positionIncreaseCycles = new Map<number, number>();

const increases = new Set<number>();

let cycleDetected = false;

let previousPositions = 0;

const data: Coords[] = [];

for (let i = 1; i < ITERATIONS; i++) {
  const pos = positions.slice();
  positions.length = 0;
  uniquePositions.clear();

  for (const p of pos) {
    const n = getNeighbours(p);
    for (const np of n) {
      const key = getKey(np);
      if (uniquePositions.has(key)) continue;
      positions.push(np);
      uniquePositions.add(key);
    }
  }

  if ([300, 400, 500].includes(i)) {
    data.push({ x: i + 1, y: positions.length });
  }

  // if (i === 100_000) {
  console.log(i + 1, positions.length);
  // const diff = positions.length - previousPositions;

  // if (increases.has(diff)) {
  //   console.log("cycle detected", diff);
  //   cycleDetected = true;
  // }
  // increases.add(diff);

  // if (cycleDetected) {
  //   const count = positionIncreaseCycles.get(diff) || 0;
  //   positionIncreaseCycles.set(diff, count + 1);
  // }
  // previousPositions = positions.length;

  // detectCycles();
  // writeFile("./output.txt", positions.length.toString());
  // }
}

// printHighestCycles();

// printHighestIncreaseCycles();

function detectCycles() {
  const gridPositions = new Map<string, GlobalCoords[]>();
  for (const p of positions) {
    const key = `${p.grid.x},${p.grid.y}`;
    const arr = gridPositions.get(key) || [];
    arr.push(p);
    gridPositions.set(key, arr);
  }

  Array.from(gridPositions.values())
    .map(serializeGridCoords)
    .forEach(s => {
      const count = cycleDetection.get(s) || 0;
      cycleDetection.set(s, count + 1);
    });
}

// console.log(positions.length);

function printHighestCycles() {
  const sorted = Array.from(cycleDetection.entries()).sort((a, b) => b[1] - a[1]);
  console.log(sorted.slice(0, 30));
}

function printHighestIncreaseCycles() {
  console.log(positionIncreaseCycles.size);
  const sorted = Array.from(positionIncreaseCycles.entries()).sort((a, b) => b[1] - a[1]);
  console.log(sorted);
}

// function serializePositions(positions: GlobalCoords[]) {
//   const serialized = positions.map(p => `${p.coords.x},${p.coords.y}`).join(";");
//   return serialized;
// }

function serializeGridCoords(positions: GlobalCoords[]) {
  const gridKey = `${positions[0].grid.x},${positions[0].grid.y}|`;
  const sorted = positions
    .slice()
    .sort((a, b) => a.coords.x - b.coords.x)
    .sort((a, b) => a.coords.y - b.coords.y);
  const serialized = sorted.map(p => `${p.coords.x},${p.coords.y}`).join(";");
  return gridKey + serialized;
}

// ---------
const X = math.matrix(data.map(({ x }) => [x * x, x, 1]));
const Y = math.matrix(data.map(({ y }) => y));
const solution = math.lusolve(X, Y);
const [a, b, c] = solution.toArray().map(Number);

console.log(`The quadratic polynomial is: y = ${a}x^2 + ${b}x + ${c}`);

const targetX = 26_501_365;
console.log(a * targetX * targetX + b * targetX + c);
