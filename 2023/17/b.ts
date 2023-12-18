import { readLinesSync, writeFile } from "../../utils-ts";

const lowestScores = new Map<string, number>();

class PriorityQueue {
  public queue: { priority: number; value: MoveData }[] = [];

  public get length() {
    return this.queue.length;
  }

  public enqueue(value: MoveData, priority: number) {
    if (priority === Infinity) return;
    const key = getMoveKey(value.coords, value.direction, value.straightMoves);
    if (lowestScores.has(key) && lowestScores.get(key)! <= priority) return;
    lowestScores.set(key, priority);

    const newItem = { value, priority };
    if (this.queue.length === 0) {
      this.queue.push(newItem);
    } else {
      let start = 0;
      let end = this.queue.length - 1;

      while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        if (this.queue[mid].priority === priority) {
          this.queue.splice(mid, 0, newItem);
          return;
        } else if (this.queue[mid].priority < priority) {
          start = mid + 1;
        } else {
          end = mid - 1;
        }
      }

      this.queue.splice(start, 0, newItem);
    }
  }

  public dequeue() {
    return this.queue.shift();
  }
}

type Coords = {
  x: number;
  y: number;
};

type MoveData = {
  straightMoves: number;
  direction: Coords;
  coords: Coords;
};

const NORTH = Object.freeze({ x: 0, y: -1 });
const SOUTH = Object.freeze({ x: 0, y: 1 });
const EAST = Object.freeze({ x: 1, y: 0 });
const WEST = Object.freeze({ x: -1, y: 0 });

const getMoveKey = (coords: Coords, direction: Coords, straightMoves: number) => `${getKey(coords)}-${getKey(direction)}-${straightMoves}`;
function getKey(coords: Coords) {
  return `${coords.x},${coords.y}`;
}

const MAX_STRAIGHT_MOVES = 10;
const MIN_STRAIGHT_MOVES = 4;
const grid: number[][] = [];

const input = readLinesSync("./input.txt");
input.forEach(line => {
  grid.push(line.split("").map(Number));
});

const queue = new PriorityQueue();
const START = { x: 0, y: 0 };
const TARGET = { x: grid[0].length - 1, y: grid.length - 1 };

queue.enqueue({ straightMoves: 1, direction: EAST, coords: plusDirection(START, EAST) }, grid[0][1]);
queue.enqueue({ straightMoves: 1, direction: SOUTH, coords: plusDirection(START, SOUTH) }, grid[1][0]);

function getPriority(coords: Coords) {
  if (coords.x < 0 || coords.x >= grid[0].length || coords.y < 0 || coords.y >= grid.length) {
    return Infinity;
  }
  return grid[coords.y][coords.x];
}

const start = performance.now();

let iterations = 0;
function findShortestPath() {
  while (queue.length > 0) {
    iterations++;
    const move = queue.dequeue()!;
    const { priority, value: data } = move;

    if (data.coords.x === TARGET.x && data.coords.y === TARGET.y && data.straightMoves >= MIN_STRAIGHT_MOVES) {
      return priority;
    }

    if (data.straightMoves < MAX_STRAIGHT_MOVES) {
      const nextMove = { coords: plusDirection(data.coords, data.direction), straightMoves: data.straightMoves + 1, direction: data.direction };

      queue.enqueue(nextMove, priority + getPriority(nextMove.coords));
    }

    if (data.straightMoves < MIN_STRAIGHT_MOVES) continue;
    const deg90Direction = deg90(data.direction);
    const deg90Move = { coords: plusDirection(data.coords, deg90Direction), straightMoves: 1, direction: deg90Direction };

    queue.enqueue(deg90Move, priority + getPriority(deg90Move.coords));

    const deg270Direction = deg270(data.direction);
    const deg270Move = { coords: plusDirection(data.coords, deg270Direction), straightMoves: 1, direction: deg270Direction };

    queue.enqueue(deg270Move, priority + getPriority(deg270Move.coords));
  }
}

function getAllPossibleMovesToThisCell(coords: Coords): MoveData[] {
  const moves: MoveData[] = [];
  const maxSouth = Math.min(coords.y, MAX_STRAIGHT_MOVES);
  const maxNorth = Math.min(grid.length - coords.y - 1, MAX_STRAIGHT_MOVES);
  const maxEast = Math.min(coords.x, MAX_STRAIGHT_MOVES);
  const maxWest = Math.min(grid[0].length - coords.x - 1, MAX_STRAIGHT_MOVES);
  for (let i = 1; i <= maxNorth; i++) {
    moves.push({ coords, direction: NORTH, straightMoves: i });
  }
  for (let i = 1; i <= maxSouth; i++) {
    moves.push({ coords, direction: SOUTH, straightMoves: i });
  }
  for (let i = 1; i <= maxWest; i++) {
    moves.push({ coords, direction: WEST, straightMoves: i });
  }
  for (let i = 1; i <= maxEast; i++) {
    moves.push({ coords, direction: EAST, straightMoves: i });
  }
  return moves;
}

function plusDirection(coords: Coords, direction: Coords) {
  return { x: coords.x + direction.x, y: coords.y + direction.y };
}

function deg90(direction: Coords) {
  if (direction === NORTH) {
    return EAST;
  }
  if (direction === EAST) {
    return SOUTH;
  }
  if (direction === SOUTH) {
    return WEST;
  }
  if (direction === WEST) {
    return NORTH;
  }
  throw new Error("invalid direction");
}

function deg270(direction: Coords) {
  if (direction === NORTH) {
    return WEST;
  }
  if (direction === WEST) {
    return SOUTH;
  }
  if (direction === SOUTH) {
    return EAST;
  }
  if (direction === EAST) {
    return NORTH;
  }
  throw new Error("invalid direction");
}

console.log(findShortestPath());
console.log(performance.now() - start);
