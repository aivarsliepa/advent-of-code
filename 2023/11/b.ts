import { readLines, writeFile } from "../../utils-ts";

type Coords = { x: number; y: number };
const galaxies = new Map<string, Coords>();

const EXPAND_C = 1_000_000 - 1;

readLines("./input.txt")
  .then(input => {
    for (let y = 0; y < input.length; y++) {
      const line = input[y];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        if (char === "#") {
          const key = `${y},${x}`;
          galaxies.set(key, { x, y });
        }
      }
    }

    expandSpace(input.map(line => line.split("")));

    const keys = Array.from(galaxies.keys());
    const distances = new Map<string, number>();
    for (let i = 0; i < keys.length; i++) {
      const a = galaxies.get(keys[i])!;
      for (let j = i + 1; j < keys.length; j++) {
        const b = galaxies.get(keys[j])!;
        const distance = getShortestDistance(a, b);
        distances.set(`${keys[i]}-${keys[j]}`, distance);
      }
    }

    return Array.from(distances.values()).reduce((acc, curr) => acc + curr, 0);
  })
  .then(output => {
    console.log(output);
  });

function expandSpace(input: string[][]) {
  const emptyRowIndexes: number[] = [];
  const emptyColIndexes: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    if (row.every(char => char === ".")) {
      emptyRowIndexes.push(i);
    }
  }

  for (let i = 0; i < input[0].length; i++) {
    const col = input.map(row => row[i]);
    if (col.every(char => char === ".")) {
      emptyColIndexes.push(i);
    }
  }

  for (let i = 0; i < emptyColIndexes.length; i++) {
    const index = emptyColIndexes[i] + i * EXPAND_C;
    Array.from(galaxies.values()).forEach(coords => {
      if (coords.x >= index) {
        coords.x += EXPAND_C;
      }
    });
  }

  for (let i = 0; i < emptyRowIndexes.length; i++) {
    const index = emptyRowIndexes[i] + i * EXPAND_C;
    Array.from(galaxies.values()).forEach(coords => {
      if (coords.y >= index) {
        coords.y += EXPAND_C;
      }
    });
  }
}

function getShortestDistance(a: Coords, b: Coords): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
