import { readLinesSync, writeFile } from "../../utils-ts";

const grid: number[][] = [];
const MAX_STRAIGHT_MOVES = 3;

const input = readLinesSync("./test-input.txt");
input.forEach(line => {
  grid.push(line.split("").map(Number));
});

// console.log(grid);

type Coords = {
  x: number;
  y: number;
};

type ScoreData = {
  straightMoves: number;
  direction: Coords;
  score: number;
};

const cellScores: ScoreData[][][] = [];
for (let y = 0; y < grid.length; y++) {
  cellScores[y] = [];
  for (let x = 0; x < grid[0].length; x++) {
    cellScores[y][x] = [];
  }
}

const scores = new Map<string, number>();
const getScoreKey = (coords: Coords, direction: Coords, straightMoves: number) => `${getKey(coords)}-${getKey(direction)}-${straightMoves}`;

const targetScore = grid[grid.length - 1][grid[0].length - 1];
for (let i = 1; i <= 3; i++) {
  const toRight = getScoreKey({ x: grid[0].length - 1, y: grid.length - 1 }, { x: 1, y: 0 }, i);
  scores.set(toRight, targetScore);
  const down = getScoreKey({ x: grid[0].length - 1, y: grid.length - 1 }, { x: 0, y: 1 }, i);
  scores.set(down, targetScore);
}

// getNeighbors({ x: grid[0].length - 1, y: grid.length - 1 }).forEach(calculateScore);

let calculating = new Set<string>();
let path = new Set<string>();

function calculateScore(coords: Coords, direction: Coords, straightMoves: number, log = false) {
  if (coords.x < 0 || coords.x >= grid[0].length || coords.y < 0 || coords.y >= grid.length) {
    return Infinity;
  }

  const key = getScoreKey(coords, direction, straightMoves);
  if (scores.has(key)) {
    return scores.get(key)!;
  }

  if (calculating.has(key)) {
    return Infinity;
    // throw new Error("circular dependency");
  }
  calculating.add(key);

  const cellScores: number[] = [];
  if (straightMoves < MAX_STRAIGHT_MOVES) {
    const nextCoords = { x: coords.x + direction.x, y: coords.y + direction.y };
    cellScores.push(calculateScore(nextCoords, direction, straightMoves + 1, log));
  }

  const deg90 = { x: -direction.y, y: direction.x };
  const deg270 = { x: direction.y, y: -direction.x };
  cellScores.push(calculateScore({ x: coords.x + deg90.x, y: coords.y + deg90.y }, deg90, 1, log));
  cellScores.push(calculateScore({ x: coords.x + deg270.x, y: coords.y + deg270.y }, deg270, 1, log));

  const score = Math.min(...cellScores) + grid[coords.y][coords.x];

  scores.set(key, score);
  calculating.delete(key);

  return score;
}

const right = calculateScore({ x: 1, y: 0 }, { x: 1, y: 0 }, 1, true);
const down = calculateScore({ x: 0, y: 1 }, { x: 0, y: 1 }, 1);

console.log(right, down);

function getKey(coords: Coords) {
  return `${coords.x},${coords.y}`;
}

function getNeighbors(coords: Coords) {
  const neighbors: Coords[] = [];
  if (coords.x > 0) {
    neighbors.push({ x: coords.x - 1, y: coords.y });
  }
  if (coords.x < grid[0].length - 1) {
    neighbors.push({ x: coords.x + 1, y: coords.y });
  }
  if (coords.y > 0) {
    neighbors.push({ x: coords.x, y: coords.y - 1 });
  }
  if (coords.y < grid.length - 1) {
    neighbors.push({ x: coords.x, y: coords.y + 1 });
  }
  return neighbors;
}

const smallestScores: number[][] = [];
for (let y = 0; y < grid.length; y++) {
  const row: number[] = [];
  smallestScores.push(row);
  for (let x = 0; x < grid[0].length; x++) {
    const cellScores = [];
    for (let i = 1; i <= 3; i++) {
      let key = getScoreKey({ x, y }, { x: 1, y: 0 }, i);
      if (scores.has(key)) {
        cellScores.push(scores.get(key)!);
      }
      key = getScoreKey({ x, y }, { x: 0, y: 1 }, i);
      if (scores.has(key)) {
        cellScores.push(scores.get(key)!);
      }
      key = getScoreKey({ x, y }, { x: -1, y: 0 }, i);
      if (scores.has(key)) {
        cellScores.push(scores.get(key)!);
      }
      key = getScoreKey({ x, y }, { x: 0, y: -1 }, i);
      if (scores.has(key)) {
        cellScores.push(scores.get(key)!);
      }
    }
    row.push(Math.min(...cellScores));
  }
}

writeFile("./output.txt", smallestScores.map(row => row.join("\t")).join("\n"));
