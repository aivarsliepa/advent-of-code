import { readLines, writeFile } from "../../utils-ts";

const inputToPipeTypes = {
  L: "└",
  J: "┘",
  "7": "┐",
  F: "┌",
} as const;

readLines("./input.txt")
  .then(input => {
    return input.map(line => {
      return line
        .split("")
        .map(char => (char in inputToPipeTypes ? inputToPipeTypes[char as keyof typeof inputToPipeTypes] : char))
        .join("");
    });
  })
  .then(output => {
    writeFile("./output.txt", output.join("\n"));
  });
