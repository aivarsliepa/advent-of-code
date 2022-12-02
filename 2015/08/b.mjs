import { readLines } from "../../utils.mjs";

const input = await readLines("./input.txt");

let totalCharactersOriginal = 0;
let totalCharactersEncoded = 0;

input.forEach(line => {
  totalCharactersOriginal += line.length;

  let encoded = line.replace(/\\/g, "\\\\");
  encoded = encoded.replace(/"/g, '\\"');
  totalCharactersEncoded += encoded.length + 2;
});

console.log(totalCharactersEncoded - totalCharactersOriginal);
