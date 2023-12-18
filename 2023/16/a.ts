import { readLinesSync } from "../../utils-ts";

const EMPTY = ".";
// mirrors
const VERTICAL = "|";
const HORIZONTAL = "-";
const FORWARD_SLASH = "/";
const BACKWARD_SLASH = "\\";

type Cell = typeof EMPTY | typeof VERTICAL | typeof HORIZONTAL | typeof FORWARD_SLASH | typeof BACKWARD_SLASH;

type Coords = {
  x: number;
  y: number;
};

const grid: Cell[][] = [];

const input = readLinesSync("./input.txt");
input.forEach(line => {
  grid.push(line.split("") as Cell[]);
});

type Light = {
  coords: Coords;
  direction: Coords;
};

const energizedCells = new Set<string>();
const getKey = (coords: Coords) => `${coords.x},${coords.y}`;
const uniqueLights = new Set<string>();
const getLightKey = (light: Light) => `${getKey(light.coords)}-${getKey(light.direction)}`;

const lights: Light[] = [
  {
    coords: { x: 0, y: 0 },
    direction: { x: 1, y: 0 },
  },
];

while (lights.length > 0) {
  const light = lights.pop()!;

  while (true) {
    if (light.coords.x < 0 || light.coords.x >= grid[0].length || light.coords.y < 0 || light.coords.y >= grid.length) {
      break;
    }

    const key = getLightKey(light);
    if (uniqueLights.has(key)) {
      break;
    }
    uniqueLights.add(key);
    energizedCells.add(getKey(light.coords));

    const cell = grid[light.coords.y][light.coords.x];
    switch (cell) {
      case EMPTY:
        moveLight(light);
        break;
      case VERTICAL:
        if (light.direction.x === 0) {
          moveLight(light);
        } else {
          splitLight(light);
        }
        break;
      case HORIZONTAL:
        if (light.direction.y === 0) {
          moveLight(light);
        } else {
          splitLight(light);
        }
        break;
      case FORWARD_SLASH:
        if (light.direction.x === 0) {
          light.direction.x = -light.direction.y;
          light.direction.y = 0;
        } else {
          light.direction.y = -light.direction.x;
          light.direction.x = 0;
        }
        moveLight(light);
        break;
      case BACKWARD_SLASH:
        if (light.direction.x === 0) {
          light.direction.x = light.direction.y;
          light.direction.y = 0;
        } else {
          light.direction.y = light.direction.x;
          light.direction.x = 0;
        }
        moveLight(light);
        break;
    }
  }
}

function moveLight(light: Light) {
  light.coords.x += light.direction.x;
  light.coords.y += light.direction.y;
}

function splitLight(light: Light) {
  if (light.direction.x === 0) {
    light.direction.x = 1;
    light.direction.y = 0;
  } else if (light.direction.y === 0) {
    light.direction.x = 0;
    light.direction.y = 1;
  }

  const newLight: Light = {
    coords: { x: light.coords.x, y: light.coords.y },
    direction: { x: -light.direction.x, y: -light.direction.y },
  };

  lights.push(newLight);
}

console.log(energizedCells.size);
