import { readLines } from "../../utils.mjs";

// [T]     [D]         [L]
// [R]     [S] [G]     [P]         [H]
// [G]     [H] [W]     [R] [L]     [P]
// [W]     [G] [F] [H] [S] [M]     [L]
// [Q]     [V] [B] [J] [H] [N] [R] [N]
// [M] [R] [R] [P] [M] [T] [H] [Q] [C]
// [F] [F] [Z] [H] [S] [Z] [T] [D] [S]
// [P] [H] [P] [Q] [P] [M] [P] [F] [D]
//  1   2   3   4   5   6   7   8   9

const stacks = {
  1: "PFMQWGRT".split(""),
  2: "HFR".split(""),
  3: "PZRVGHSD".split(""),
  4: "QHPBFWG".split(""),
  5: "PSMJH".split(""),
  6: "MZTHSRPL".split(""),
  7: "PTHNML".split(""),
  8: "FDQR".split(""),
  9: "DSCNLPH".split(""),
};

const inputs = await readLines("./input.txt");

inputs.forEach(input => {
  const [, count, , from, , to] = input.split(" ").map(Number);

  for (let i = 0; i < count; i++) {
    stacks[to].push(stacks[from].pop());
  }
});

let output = "";
for (const key in stacks) {
  output += stacks[key].pop();
}

console.log(output);
