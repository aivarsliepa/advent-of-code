import { readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt");

let fullyContainNumber = 0;
let anyOverlapNumber = 0;

function fullyContains(startA, endA, startB, endB) {
  return startA <= startB && endA >= endB;
}

function anyOverlap(startA, endA, startB, endB) {
  return (startA <= startB && startB <= endA) || (startA <= endB && endB <= endA);
}

inputs.forEach(input => {
  const [left, right] = input.split(",");
  const [leftStart, leftEnd] = left.split("-").map(Number);
  const [rightStart, rightEnd] = right.split("-").map(Number);

  if (fullyContains(leftStart, leftEnd, rightStart, rightEnd) || fullyContains(rightStart, rightEnd, leftStart, leftEnd)) {
    fullyContainNumber++;
  }

  if (anyOverlap(leftStart, leftEnd, rightStart, rightEnd) || anyOverlap(rightStart, rightEnd, leftStart, leftEnd)) {
    anyOverlapNumber++;
  }
});

console.log({ fullyContainNumber, anyOverlapNumber });
