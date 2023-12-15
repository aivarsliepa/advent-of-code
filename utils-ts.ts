import fs from "fs";
import readline from "readline";
import path from "path";
import { cwd } from "process";

export const readInput = async (path: string) => {
  const file = await fs.readFileSync(path, "utf8");
  return file;
};

export async function readLines(filePath: string, chunkSize?: undefined, skipAfterChunk?: boolean): Promise<string[]>;
export async function readLines(filePath: string, chunkSize: 1, skipAfterChunk?: boolean): Promise<string[]>;
export async function readLines(filePath: string, chunkSize: number, skipAfterChunk?: boolean): Promise<string[][]>;
export async function readLines(filePath: string, chunkSize = 1, skipAfterChunk = false) {
  const fileStream = fs.createReadStream(path.resolve(cwd(), filePath));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const chunks: string[][] = [];
  let currChunk: string[] = [];
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

  if (chunkSize === 1) {
    return chunks.flat();
  }

  return chunks;
}

export const permutate = <T>(arr: T[]) => {
  if (arr.length === 1) {
    return [arr];
  }

  const permutations: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const subPermutations = permutate(arr.slice(0, i).concat(arr.slice(i + 1)));
    subPermutations.forEach(subPermutation => {
      permutations.push([arr[i]].concat(subPermutation));
    });
  }
  return permutations;
};

export const chunkArray = <T>(arr: T[], chunkSize: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

export const range = (start: number, end: number) => {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

export const writeFile = (filePath: string, data: string) => {
  fs.writeFileSync(path.resolve(cwd(), filePath), data);
};

// const getStringArrKey = arr => {
//   return arr.slice().sort().join("");
// };

/**
 * This will return [a, b] and [b, a] as seperate combination.
 * If placement is not important, then need to improve this function.
 */
// export const combinations = (arr, length) => {
//   if (length === 1) {
//     return arr;
//   }

//   const combos = [];
//   for (let i = 0; i < arr.length; i++) {
//     const subCombos = combinations(arr, length - 1);

//     subCombos.forEach(subCombo => {
//       combos.push([arr[i]].concat(subCombo));
//     });
//   }

//   return combos;
// };

// export const combinations = <T>(arr: T[], length: number) => {
//   const results = [];
//   combinationRoutine(results, [], arr, length, {});
//   return results;
// };

// export const combinationRoutine = (results, combination, sourceArr, length, memo) => {
//   if (combination.length === length) {
//     results.push(combination);
//     return;
//   }

//   sourceArr.forEach(elem => {
//     const subCombination = combination.concat([elem]);

//     const key = getStringArrKey(subCombination);
//     if (key in memo) return;
//     memo[key] = true;

//     combinationRoutine(results, subCombination, sourceArr, length, memo);
//   });
// };
