import { readLines } from "../../utils-ts";

readLines("./input.txt")
  .then(input => {
    const strings = input[0].split(",");
    return strings.map(getHashNumber).reduce((acc, curr) => acc + curr, 0);
  })
  .then(output => {
    console.log(output);
  });

function getHashNumber(str: string) {
  const hash = str.split("").reduce((acc, curr) => {
    return ((acc + curr.charCodeAt(0)) * 17) % 256;
  }, 0);
  return hash;
}
