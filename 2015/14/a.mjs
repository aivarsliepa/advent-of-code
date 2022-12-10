import { readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

const raindeers = {};

inputs.forEach(input => {
  const split = input.split(" ");
  const name = split[0];
  const speed = Number(split[3]);
  const speedTime = Number(split[6]);
  const restTime = Number(split[split.length - 2]);

  raindeers[name] = {
    speed,
    speedTime,
    restTime,
  };
});

let maxDistance = 0;
let winnerName = "";

const raceTime = 2503;

for (const name in raindeers) {
  const { speed, speedTime, restTime } = raindeers[name];

  const intervalTime = speedTime + restTime;
  const intervals = Math.floor(raceTime / intervalTime);

  const lastPart = raceTime - intervalTime * intervals;

  const distance = intervals * speed * speedTime + Math.min(speedTime, lastPart) * speed;

  if (distance > maxDistance) {
    winnerName = name;
    maxDistance = distance;
  }
}

console.log({ maxDistance, winnerName });
