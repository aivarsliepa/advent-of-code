import { readLinesSync, writeFile } from "../../utils-ts";

const input = readLinesSync("./input.txt");

input.forEach((line, y) => {
  console.log(line);
});
