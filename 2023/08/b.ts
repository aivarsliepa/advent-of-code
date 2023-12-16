import { readLines } from "../../utils-ts";

type Node = {
  left: string;
  right: string;
};

const nodes: Record<string, Node> = {};
const regex = /\(([0-9A-Z]+),\s([0-9A-Z]+)\)/;

const currentNodes: string[] = [];

let iterations = 0;
let nodesTillEnd = 0;
readLines("./test3-input.txt")
  .then(input => {
    const instructions = input[0];

    for (let i = 2; i < input.length; i++) {
      const line = input[i];
      const [node, rest] = line.split(" = ");
      const [left, right] = rest.match(regex)!.slice(1);
      nodes[node] = { left, right };

      if (node[2] === "A") {
        currentNodes.push(node);
        nodesTillEnd++;
      }
    }

    while (true) {
      for (let i = 0; i < instructions.length; i++) {
        iterations++;
        const instruction = instructions[i] === "L" ? "left" : "right";

        for (let j = 0; j < currentNodes.length; j++) {
          const node = currentNodes[j];
          const nextNode = nodes[node][instruction];
          currentNodes[j] = nextNode;

          if (node[2] === "Z" && nextNode[2] !== "Z") {
            nodesTillEnd++;
          } else if (node[2] !== "Z" && nextNode[2] === "Z") {
            nodesTillEnd--;
          }
        }

        if (nodesTillEnd === 0) return;
      }
    }
  })
  .then(() => {
    console.log(iterations);
  });
