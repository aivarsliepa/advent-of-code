import { permutate, readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

const distances = {};
const cities = new Set();

inputs.forEach(input => {
  const [from, , to, , distance] = input.split(" ");
  cities.add(from);
  cities.add(to);

  distances[from] = distances[from] || {};
  distances[to] = distances[to] || {};
  distances[from][to] = Number(distance);
  distances[to][from] = Number(distance);
});

let shortestPath = Infinity;
let longestPath = 0;

const citiesArray = Array.from(cities);
const permutations = permutate(citiesArray);

permutations.forEach(permutation => {
  let pathLength = 0;

  for (let i = 0; i < permutation.length - 1; i++) {
    const from = permutation[i];
    const to = permutation[i + 1];
    pathLength += distances[from][to];
  }

  if (pathLength < shortestPath) {
    shortestPath = pathLength;
  }

  if (pathLength > longestPath) {
    longestPath = pathLength;
  }
});

console.log(shortestPath, longestPath);
