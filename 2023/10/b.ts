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

const grid: Array<Array<PipeType | ".">> = [];
const isLoopPipe: Array<Array<boolean>> = [];

const loopPipes: Coords[] = [];
const vertices: Coords[] = [];

readLines("./input.txt")
  .then(input => {
    for (let i = 0; i < input.length; i++) {
      grid.push([]);
      isLoopPipe.push([]);
    }

    for (let y = 0; y < input.length; y++) {
      const line = input[y];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        if (char === ".") {
          grid[y][x] = char;
        } else if (char === "S") {
          startPoint = { x, y };
          grid[y][x] = startType;
        } else {
          grid[y][x] = inputToPipeTypes[char];
        }
      }
    }

    let currentCoords = startPoint;
    let lastCoords = { x: 0, y: 0 };
    do {
      isLoopPipe[currentCoords.y][currentCoords.x] = true;
      loopPipes.push(currentCoords);
      const pipe = grid[currentCoords.y][currentCoords.x];
      if (pipe !== "NS" && pipe !== "WE") {
        vertices.push(currentCoords);
      }

      const nextCoords = getNextCoords(currentCoords, lastCoords);
      lastCoords = currentCoords;
      currentCoords = nextCoords;
    } while (currentCoords.x !== startPoint.x || currentCoords.y !== startPoint.y);

    return countInsideLoop();
  })
  .then(output => {
    console.log(output);
  });

function getNextCoords(coords: Coords, prevCoords: Coords): Coords {
  const pipe = grid[coords.y][coords.x];

  switch (pipe) {
    case "NS":
      if (prevCoords.y < coords.y) {
        return { x: coords.x, y: coords.y + 1 };
      }
      return { x: coords.x, y: coords.y - 1 };
    case "WE":
      if (prevCoords.x < coords.x) {
        return { x: coords.x + 1, y: coords.y };
      }
      return { x: coords.x - 1, y: coords.y };
    case "NE":
      if (prevCoords.y < coords.y) {
        return { x: coords.x + 1, y: coords.y };
      }
      return { x: coords.x, y: coords.y - 1 };
    case "NW":
      if (prevCoords.y < coords.y) {
        return { x: coords.x - 1, y: coords.y };
      }
      return { x: coords.x, y: coords.y - 1 };
    case "SE":
      if (prevCoords.y > coords.y) {
        return { x: coords.x + 1, y: coords.y };
      }
      return { x: coords.x, y: coords.y + 1 };
    case "SW":
      if (prevCoords.y > coords.y) {
        return { x: coords.x - 1, y: coords.y };
      }
      return { x: coords.x, y: coords.y + 1 };
  }

  throw new Error("Invalid pipe type");
}

function countInsideLoop() {
  let total = 0;
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (!isLoopPipe[y][x]) {
        if (isInsideFromNorth({ x, y }) && isInsideFromSouth({ x, y }) && isInsideFromWest({ x, y }) && isInsideFromEast({ x, y })) {
          total++;
        }
      }
    }
  }
  return total;
}

function isInsideFromNorth(coords: Coords) {
  let inside = false;
  let corner: string | undefined;
  for (let y = 0; y < coords.y; y++) {
    const cell = grid[y][coords.x];
    if (!isLoopPipe[y][coords.x]) {
      continue;
    }

    if (cell == "WE") {
      inside = !inside;
    } else if (cell.includes("W") || cell.includes("E")) {
      if (corner) {
        if (!cell.includes(corner)) {
          inside = !inside;
        }
        corner = undefined;
      } else {
        corner = cell.includes("W") ? "W" : "E";
      }
    }
  }
  return inside;
}

function isInsideFromSouth(coords: Coords) {
  let inside = false;
  let corner: string | undefined;
  for (let y = coords.y; y < grid.length; y++) {
    const cell = grid[y][coords.x];
    if (!isLoopPipe[y][coords.x]) {
      continue;
    }

    if (cell == "WE") {
      inside = !inside;
    } else if (cell.includes("W") || cell.includes("E")) {
      if (corner) {
        if (!cell.includes(corner)) {
          inside = !inside;
        }
        corner = undefined;
      } else {
        corner = cell.includes("W") ? "W" : "E";
      }
    }
  }
  return inside;
}

function isInsideFromWest(coords: Coords) {
  let inside = false;
  let corner: string | undefined;
  for (let x = 0; x < coords.x; x++) {
    const cell = grid[coords.y][x];
    if (!isLoopPipe[coords.y][x]) {
      continue;
    }

    if (cell == "NS") {
      inside = !inside;
    } else if (cell.includes("N") || cell.includes("S")) {
      if (corner) {
        if (!cell.includes(corner)) {
          inside = !inside;
        }
        corner = undefined;
      } else {
        corner = cell.includes("N") ? "N" : "S";
      }
    }
  }
  return inside;
}

function isInsideFromEast(coords: Coords) {
  let inside = false;
  let corner: string | undefined;
  for (let x = coords.x; x < grid[coords.y].length; x++) {
    const cell = grid[coords.y][x];
    if (!isLoopPipe[coords.y][x]) {
      continue;
    }
    if (cell == "NS") {
      inside = !inside;
    } else if (cell.includes("N") || cell.includes("S")) {
      if (corner) {
        if (!cell.includes(corner)) {
          inside = !inside;
        }
        corner = undefined;
      } else {
        corner = cell.includes("N") ? "N" : "S";
      }
    }
  }
  return inside;
}
