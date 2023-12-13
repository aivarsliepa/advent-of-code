import { readLines } from "../../utils.mjs";

const inputs = await readLines("./test-input.txt");

const grid = [];

let start = [];
let end = [];

// console.log(inputs);

const offset = "a".charCodeAt(0);

inputs.forEach((input, y) => {
  const row = [];
  input.split("").forEach((char, x) => {
    if (char === "S") {
      start = [x, y];
      row.push("a".charCodeAt(0) - offset);
    } else if (char === "E") {
      end = [x, y];
      row.push("z".charCodeAt(0) - offset);
    } else {
      row.push(char.charCodeAt(0) - offset);
    }
  });
  grid.push(row);
});

const key = (x, y) => `${x},${y}`;

const memo = {};
function findShortestPath(path = [current]) {
  const [x, y] = path[path.length - 1];
  const memoized = memo[key(x, y)];
  if (memoized && memoized.length < path.length) {
    return memoized;
  }

  const [endX, endY] = end;
  if (x === endX && y === endY) {
    memo[key(x, y)] = path;
    return path;
  }

  const up = grid[y - 1][x];
}
