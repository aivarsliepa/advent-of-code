import fs from "fs";
import readline from "readline";
import path from "path";
import { cwd } from "process";

export const readInput = async path => {
  const file = await fs.readFileSync(path, "utf8");
  return file;
};

export const readLines = async filePath => {
  const fileStream = fs.createReadStream(path.resolve(cwd(), filePath));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
};

export const permutate = arr => {
  if (arr.length === 1) {
    return [arr];
  }

  const permutations = [];
  for (let i = 0; i < arr.length; i++) {
    const subPermutations = permutate(arr.slice(0, i).concat(arr.slice(i + 1)));
    subPermutations.forEach(subPermutation => {
      permutations.push([arr[i]].concat(subPermutation));
    });
  }
  return permutations;
};

export const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};
