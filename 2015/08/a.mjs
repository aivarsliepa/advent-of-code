import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

let totalCharacters = 0;
let charactersInMemory = 0;

input.forEach(line => {
  totalCharacters += line.length;

  const output = line.slice(1, -1);
  let relevantLength = 0;

  for (let i = 0; i < output.length; i++) {
    if (output[i] === "\\") {
      if (output[i + 1] === "x") {
        relevantLength += 1;
        i += 3;
      } else {
        relevantLength += 1;
        i += 1;
      }
    } else {
      relevantLength += 1;
    }
  }

  charactersInMemory += relevantLength;
});

console.log(totalCharacters - charactersInMemory);
