import { readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

let total = 0;

const getPriority = ch => {
  if (ch.toLowerCase() === ch) {
    return ch.charCodeAt(0) - "a".charCodeAt(0) + 1;
  }

  return ch.charCodeAt(0) - "A".charCodeAt(0) + 27;
};

for (const input of inputs) {
  const left = new Set(input.slice(0, input.length / 2));
  const right = input.slice(input.length / 2);
  const common = right.split("").find(ch => left.has(ch));

  const priority = getPriority(common);
  total += priority;
}

console.log(total);
