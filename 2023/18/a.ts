import { readLinesSync, writeFile } from "../../utils-ts";

type Coords = {
  x: number;
  y: number;
};

const NORTH = Object.freeze({ x: 0, y: -1 });
const SOUTH = Object.freeze({ x: 0, y: 1 });
const EAST = Object.freeze({ x: 1, y: 0 });
const WEST = Object.freeze({ x: -1, y: 0 });

const key = (coords: Coords) => `${coords.x},${coords.y}`;
let currentCoords: Coords = { x: 0, y: 0 };

const cellsMarked = new Set<string>([key(currentCoords)]);

let lowestX = 0;
let lowestY = 0;
let highestX = 0;
let highestY = 0;

const input = readLinesSync("./input.txt");
input.forEach(line => {
  const [direction, distance] = line.split(" ");
  const dist = Number(distance);
  const currDirection = direction === "R" ? EAST : direction === "L" ? WEST : direction === "U" ? NORTH : SOUTH;
  for (let i = 0; i < dist; i++) {
    currentCoords = plusDirection(currentCoords, currDirection);
    lowestX = Math.min(lowestX, currentCoords.x);
    lowestY = Math.min(lowestY, currentCoords.y);
    highestX = Math.max(highestX, currentCoords.x);
    highestY = Math.max(highestY, currentCoords.y);
    cellsMarked.add(key(currentCoords));
  }
});

function plusDirection(coords: Coords, direction: Coords) {
  return { x: coords.x + direction.x, y: coords.y + direction.y };
}

const grid: boolean[][] = [];

const dx = 0 - lowestX;
const dy = 0 - lowestY;

for (let y = 0; y <= highestY + dy; y++) {
  grid[y] = [];
  for (let x = 0; x <= highestX + dx; x++) {
    grid[y][x] = cellsMarked.has(key({ x: x - dx, y: y - dy }));
  }
}

let start: Coords = { x: 0, y: 0 };
for (let x = 0; x < grid[0].length; x++) {
  if (grid[1][x] && !grid[1][x + 1]) {
    start = { x: x + 1, y: 1 };
    break;
  }
}

const queue: Coords[] = [start];
while (queue.length > 0) {
  const coords = queue.pop()!;
  grid[coords.y][coords.x] = true;

  getNeighbours(coords).forEach(neighbour => {
    const { x, y } = neighbour;
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
      return;
    }
    if (grid[y][x]) {
      return;
    }
    queue.push(neighbour);
  });
}

function getNeighbours(coords: Coords) {
  return [NORTH, SOUTH, EAST, WEST].map(dir => plusDirection(coords, dir));
}

writeFile(
  "./output.txt",
  grid
    .map(row => row.map(cell => (cell ? "#" : ".")).join(""))
    .map(row => row + "\n")
    .join(""),
);

console.log(grid.reduce((sum, row) => sum + row.filter(cell => cell).length, 0));
