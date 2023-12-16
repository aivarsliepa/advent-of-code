import { readLines } from "../../utils-ts";

type Node = {
  left: string;
  right: string;
};

const nodes: Record<string, Node> = {};
const regex = /\(([A-Z]+),\s([A-Z]+)\)/;
let currentNode = "AAA";

let iterations = 0;
readLines("./input.txt")
  .then(input => {
    const instructions = input[0];

    for (let i = 2; i < input.length; i++) {
      const line = input[i];
      const [node, rest] = line.split(" = ");
      const [left, right] = rest.match(regex)!.slice(1);
      nodes[node] = { left, right };
    }

    while (true) {
      for (let i = 0; i < instructions.length; i++) {
        iterations++;
        const instruction = instructions[i];
        currentNode = nodes[currentNode][instruction === "L" ? "left" : "right"];
        if (currentNode === "ZZZ") return;
      }
    }
  })
  .then(() => {
    console.log(iterations);
  });
