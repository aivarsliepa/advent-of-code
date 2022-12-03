import { chunkArray, readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

let total = 0;

const getPriority = ch => {
  if (ch.toLowerCase() === ch) {
    return ch.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }

  return ch.charCodeAt(0) - "A".charCodeAt(0) + 27;
};

chunkArray(inputs, 3).forEach(group => {
  const first = new Set(group[0]);
  const second = new Set(group[1]);

  const badge = group[2].split("").find(ch => first.has(ch) && second.has(ch));
  total += getPriority(badge);
});

console.log(total);
