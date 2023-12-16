import { readLines } from "../../utils-ts";

type PipeType = "NS" | "WE" | "NE" | "NW" | "SE" | "SW";
type Coords = { x: number; y: number };

const inputToPipeTypes: Record<string, PipeType> = {
  "|": "NS",
  "-": "WE",
  L: "NE",
  J: "NW",
  "7": "SW",
  F: "SE",
};

const testInputStartType = "SE";
const inputStartType = "SW";

let startPoint: Coords = { x: 0, y: 0 };
const startType: PipeType = inputStartType; // set this manually based on input

const grid: PipeType[][] = [];

readLines("./input.txt")
  .then(input => {
    for (let i = 0; i < input.length; i++) {
      grid.push([]);
    }

    for (let y = 0; y < input.length; y++) {
      const line = input[y];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        if (char === ".") continue;
        if (char === "S") {
          startPoint = { x, y };
          grid[y][x] = startType;
        } else {
          grid[y][x] = inputToPipeTypes[char];
        }
      }
    }

    let currentCoords = startPoint;
    let steps = 0;
    let lastCoords = { x: 0, y: 0 };
    do {
      steps++;
      const nextCoords = getNextCoords(currentCoords, lastCoords);
      lastCoords = currentCoords;
      currentCoords = nextCoords;
    } while (currentCoords.x !== startPoint.x || currentCoords.y !== startPoint.y);

    return Math.floor(steps / 2);
  })
  .then(output => {
    console.log(output);
  });

function getNextCoords(coords: Coords, prevCoords: Coords): Coords {
  const pipe = grid[coords.y][coords.x];

  switch (pipe) {
    case "NS":
      return prevCoords.y < coords.y ? { x: coords.x, y: coords.y + 1 } : { x: coords.x, y: coords.y - 1 };
    case "WE":
      return prevCoords.x < coords.x ? { x: coords.x + 1, y: coords.y } : { x: coords.x - 1, y: coords.y };
    case "NE":
      return prevCoords.y < coords.y ? { x: coords.x + 1, y: coords.y } : { x: coords.x, y: coords.y - 1 };
    case "NW":
      return prevCoords.y < coords.y ? { x: coords.x - 1, y: coords.y } : { x: coords.x, y: coords.y - 1 };
    case "SE":
      return prevCoords.y > coords.y ? { x: coords.x + 1, y: coords.y } : { x: coords.x, y: coords.y + 1 };
    case "SW":
      return prevCoords.y > coords.y ? { x: coords.x - 1, y: coords.y } : { x: coords.x, y: coords.y + 1 };
  }
}
