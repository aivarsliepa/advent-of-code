import { chunkArray, readLines } from "../../utils-ts";

type Mapping = {
  source: number;
  target: number;
  range: number;
};

const seedToSoil: Mapping[] = [];
const soilToFertilizer: Mapping[] = [];
const fertilizerToWater: Mapping[] = [];
const waterToLight: Mapping[] = [];
const lightToTemperature: Mapping[] = [];
const temperatureToHumidity: Mapping[] = [];
const humidityToLocation: Mapping[] = [];

const queue = [seedToSoil, soilToFertilizer, fertilizerToWater, waterToLight, lightToTemperature, temperatureToHumidity, humidityToLocation];

const start = performance.now();

readLines("./input.txt").then(input => {
  const seeds = input[0]
    .split("seeds: ")[1]
    .split(" ")
    .map(n => parseInt(n));

  let queueIndex = 0;
  for (let i = 3; i < input.length; i++) {
    const line = input[i];
    if (line.trim() === "") {
      queueIndex++;
      i++;
      continue;
    }

    const [target, source, range] = line.split(" ").map(n => parseInt(n));
    queue[queueIndex].push({ target, source, range });
  }

  const seedRanges = chunkArray(seeds, 2);
  let lowest = Infinity;

  for (let i = 0; i < seedRanges.length; i++) {
    const [start, length] = seedRanges[i];
    for (let j = start; j < start + length; j++) {
      let current = j;
      for (let k = 0; k < queue.length; k++) {
        current = getNext(current, queue[k]);
      }
      if (current < lowest) lowest = current;
    }
  }

  console.log(lowest);
  console.log(performance.now() - start);
});

function getNext(source: number, mappings: Mapping[]): number {
  const mapping = mappings.find(m => {
    return m.source <= source && m.source + m.range - 1 >= source;
  });
  if (!mapping) return source;
  return mapping.target + (source - mapping.source);
}
