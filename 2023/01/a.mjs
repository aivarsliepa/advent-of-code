import { readLines } from '../../utils.mjs'

const digits = {
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "zero": "0",
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9"
}

const input = await readLines("./input.txt");
let total = 0;
input.forEach(line => {

  let firstMatch = null;
  let lastMatch = null;

  for (let i = 0; i < line.length; i++) {
    for (let j = i + 1; j <= i + 5; j++) {
      const substring = line.substring(i, j);
      if (digits[substring] !== undefined) {
        if (firstMatch === null) {
          firstMatch = substring;
        }
        lastMatch = substring;
      }
    }
  }


  const combined = digits[firstMatch] + digits[lastMatch];
  total += parseInt(combined);
});

console.log(total);
