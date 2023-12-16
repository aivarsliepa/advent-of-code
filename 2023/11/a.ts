import { readLines, writeFile } from "../../utils-ts";

type Coords = { x: number; y: number };
const galaxies = new Map<string, Coords>();

readLines("./input.txt")
  .then(input => {
    const expanded = expandSpace(input.map(line => line.split("")));
    for (let y = 0; y < expanded.length; y++) {
      const line = expanded[y];
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        if (char === "#") {
          const key = `${y},${x}`;
          galaxies.set(key, { x, y });
        }
      }
    }

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

function expandSpace(input: string[][]): string[][] {
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
    const index = emptyColIndexes[i] + i;
    input.forEach(row => {
      row.splice(index, 0, ".");
    });
  }

  for (let i = 0; i < emptyRowIndexes.length; i++) {
    const index = emptyRowIndexes[i] + i;
    input.splice(
      index,
      0,
      input[0].map(() => "."),
    );
  }

  return input;
}

function getShortestDistance(a: Coords, b: Coords): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
