import fs from "fs";
import readline from "readline";
import path from "path";
import { cwd } from "process";

export const readInput = async path => {
  const file = await fs.readFileSync(path, "utf8");
  return file;
};

export const readLines = async (filePath, chunkSize = 1, skipAfterChunk = false) => {
  const fileStream = fs.createReadStream(path.resolve(cwd(), filePath));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const chunks = [];
  let currChunk = [];
  let skipping = false;
  for await (const line of rl) {
    if (skipAfterChunk && skipping) {
      skipping = false;
      continue;
    }

    currChunk.push(line);
    if (currChunk.length === chunkSize) {
      chunks.push(currChunk);
      currChunk = [];
      skipping = true;
    }
  }
  return chunks;
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

export const range = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};
