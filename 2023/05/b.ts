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
    let currentRange = [{ start, end: start + length - 1 }];

    for (let j = 0; j < queue.length; j++) {
      currentRange = getNextRange(currentRange, queue[j]);
    }

    currentRange.forEach(r => {
      if (r.start < lowest) lowest = r.start;
    });
  }

  console.log(lowest);
  console.log(performance.now() - start);
});

function getNextRange(range: { start: number; end: number }[], mappings: Mapping[]): { start: number; end: number }[] {
  let newRages = [];

  for (let i = 0; i < range.length; i++) {
    const { start, end } = range[i];

    for (let mapping of mappings) {
      if (mapping.source <= end && mapping.source + mapping.range - 1 >= start) {
        // Calculate the intersection of the range with the mapping range
        let intersectionStart = Math.max(start, mapping.source);
        let intersectionEnd = Math.min(end, mapping.source + mapping.range - 1);

        // Apply the mapping to the start and end of the intersection
        newRages.push({
          start: mapping.target + (intersectionStart - mapping.source),
          end: mapping.target + (intersectionEnd - mapping.source),
        });
      }
    }
  }

  return newRages;
}
