import { permutate, readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

const records = new Map();

inputs.forEach(input => {
  const words = input.split(" ");
  const name = words[0];
  const happiniess = words[2] === "gain" ? Number(words[3]) : -words[3];
  const otherName = words.pop("").slice(0, -1);

  if (!records.has(name)) {
    records.set(name, new Map());
  }

  records.get(name).set(otherName, happiniess);
});

const allSeatings = permutate([...records.keys()])
  .map(seating => {
    let totalHappiness = 0;

    for (let i = 0; i < seating.length - 1; i++) {
      const personA = seating[i];
      const personB = seating[i + 1];

      totalHappiness += records.get(personA).get(personB);
      totalHappiness += records.get(personB).get(personA);
    }

    const first = seating[0];
    const last = seating[seating.length - 1];

    totalHappiness += records.get(first).get(last);
    totalHappiness += records.get(last).get(first);

    return totalHappiness;
  })
  .sort((a, b) => b - a);

console.log(allSeatings[0]);
