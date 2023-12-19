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

const input = readLinesSync("./test-input.txt");
const distances: number[] = [];
input.forEach(line => {
  // const [direction, distance] = line.split(" ");
  // const dist = Number(distance);
  // const currDirection = direction === "R" ? EAST : direction === "L" ? WEST : direction === "U" ? NORTH : SOUTH;
  const hex = line.split(" ")[2];
  const direction = hex[hex.length - 2];
  const distance = hex.substring(2, hex.length - 2);

  const dist = parseInt(distance, 16);
  distances.push(dist);
  const currDirection = direction === "0" ? EAST : direction === "2" ? WEST : direction === "3" ? NORTH : SOUTH;

  currentCoords = plusDirection(currentCoords, currDirection, dist);
  points.push(currentCoords);
  console.log(direction, distance, dist);
});

console.log(findGCD(distances));
console.log(calculateArea(), calculateArea2(), points.length);

function calculateArea() {
  // console.log(points);

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    let j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

function gcd(a: number, b: number) {
  if (b === 0) {
    return a;
  } else {
    return gcd(b, a % b);
  }
}

function findGCD(arr: number[]) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(arr[i], result);
  }
  return result;
}

function calculateArea2(): number {
  const vertices = points.slice().sort((a, b) => a.x - b.x);

  let area = 0;
  for (let i = 0; i < vertices.length; i += 2) {
    let j = (i + 1) % points.length;
    area += Math.abs(vertices[i].y - vertices[j].y);
  }

  return area;
}

function plusDirection(coords: Coords, direction: Coords, distance: number) {
  return { x: coords.x + direction.x * distance, y: coords.y + direction.y * distance };
}
