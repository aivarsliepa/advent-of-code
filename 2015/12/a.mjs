import { readLines } from "../../utils.mjs";

const input = JSON.parse((await readLines("./input.txt"))[0]);

let sum = 0;

function traverse(node) {
  if (Array.isArray(node)) {
    node.forEach(child => traverse(child));
  } else if (Number.isInteger(node)) {
    sum += node;
  } else if (typeof node === "object") {
    for (const key in node) {
      traverse(node[key]);
    }
  }
}

traverse(input, 0);

console.log(sum);
