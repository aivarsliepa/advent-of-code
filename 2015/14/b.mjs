import { readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

const raindeers = [];

class Raindeer {
  constructor({ name, speed, speedTime, restTime }) {
    this.name = name;
    this.speed = speed;
    this.speedTime = speedTime;
    this.restTime = restTime;

    this.speedTimer = 0;
    this.restTimer = 0;
    this.score = 0;
    this.distance = 0;

    this.state = "move";
  }
}

inputs.forEach(input => {
  const split = input.split(" ");
  const name = split[0];
  const speed = Number(split[3]);
  const speedTime = Number(split[6]);
  const restTime = Number(split[split.length - 2]);

  raindeers.push(new Raindeer({ name, speed, restTime, speedTime }));
});

for (let i = 1; i <= 2503; i++) {
  raindeers.forEach(r => {
    if (r.state === "move") {
      r.distance += r.speed;
      r.speedTimer++;

      if (r.speedTimer === r.speedTime) {
        r.state = "rest";
        r.speedTimer = 0;
      }
    } else {
      r.restTimer++;
      if (r.restTimer === r.restTime) {
        r.state = "move";
        r.restTimer = 0;
      }
    }
  });

  const topDistance = Math.max(...raindeers.map(r => r.distance));

  raindeers.forEach(r => {
    if (r.distance === topDistance) {
      r.score++;
    }
  });
}

console.log(raindeers.sort((r1, r2) => r2.score - r1.score)[0]);
