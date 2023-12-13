import { readLines } from '../../utils.mjs'

const input = await readLines("./input.txt");

const RED = 12;
const GREEN = 13;
const BLUE = 14;

let possibleGames = 0;

input.forEach(line => {
  let isImpossible = false;

  const [game, other] = line.split(":");
  const gameNumber = parseInt(game.split(" ")[1]);
  other.split(";").map(set => set.trim()).forEach(sets => {
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

    if (RED < currentReds || GREEN < currentGreens || BLUE < currentBlues) {
      isImpossible = true;
    }
  });

  if (!isImpossible) {
    possibleGames += gameNumber
  }
});

console.log(possibleGames);
