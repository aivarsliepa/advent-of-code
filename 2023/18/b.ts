import { readLinesSync, writeFile } from "../../utils-ts";

type Coords = {
  x: number;
  y: number;
};

const points: Coords[] = [];

const NORTH = Object.freeze({ x: 0, y: -1 });
const SOUTH = Object.freeze({ x: 0, y: 1 });
const EAST = Object.freeze({ x: 1, y: 0 });
const WEST = Object.freeze({ x: -1, y: 0 });

let currentCoords: Coords = { x: 0, y: 0 };
points.push(currentCoords);

const input = readLinesSync("./input.txt");
let boundryPoints = 0;

input.forEach((line, i) => {
  const hex = line.split(" ")[2];
  const direction = hex[hex.length - 2];
  const distance = hex.substring(2, hex.length - 2);

  const dist = parseInt(distance, 16);
  const currDirection = direction === "0" ? EAST : direction === "2" ? WEST : direction === "3" ? NORTH : SOUTH;
  boundryPoints += dist;
  currentCoords = plusDirection(currentCoords, currDirection, dist);
  points.push(currentCoords);
});

console.log(boundryPoints + calculateInteriorPoints());

function calculateInteriorPoints() {
  const area = calculateArea(points);
  const result = area - boundryPoints / 2 + 1;
  return result;
}

function calculateArea(vertices: Coords[]) {
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    let j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area / 2);
}

function plusDirection(coords: Coords, direction: Coords, distance: number) {
  return { x: coords.x + direction.x * distance, y: coords.y + direction.y * distance };
}
