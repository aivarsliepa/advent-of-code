import { readLines } from '../../utils.mjs'

const input = await readLines("./input.txt");

let total = 0;

input.forEach(line => {
  let minReds = 0;
  let minGreens = 0;
  let minBlues = 0;

  line.split(":")[1].split(";").map(set => set.trim()).forEach(sets => {
    let currentReds = 0;
    let currentGreens = 0;
    let currentBlues = 0;

    sets.split(",").map(set => set.trim()).forEach(set => {
      const [count, color] = set.split(" ");
      if (color === "red") {
        currentReds += parseInt(count);
      } else if (color === "green") {
        currentGreens += parseInt(count);
      } else if (color === "blue") {
        currentBlues += parseInt(count);
      }
    });

    minReds = Math.max(minReds, currentReds);
    minGreens = Math.max(minGreens, currentGreens);
    minBlues = Math.max(minBlues, currentBlues);
  });

  total += minReds * minGreens * minBlues;
});

console.log(total);
