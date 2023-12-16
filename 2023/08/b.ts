import { readLines } from "../../utils-ts";

type Node = {
  left: string;
  right: string;
};

const nodes: Record<string, Node> = {};
const regex = /\(([0-9A-Z]+),\s([0-9A-Z]+)\)/;

const currentNodes: string[] = [];
const iterations: number[] = [];

readLines("./input.txt")
  .then(input => {
    const instructions = input[0];

    for (let i = 2; i < input.length; i++) {
      const line = input[i];
      const [node, rest] = line.split(" = ");
      const [left, right] = rest.match(regex)!.slice(1);
      nodes[node] = { left, right };

      if (node[2] === "A") {
        currentNodes.push(node);
      }
    }

    for (let j = 0; j < currentNodes.length; j++) {
      iterations[j] = 0;
      let currentNode = currentNodes[j];
      while (currentNode[2] !== "Z") {
        for (let i = 0; i < instructions.length; i++) {
          iterations[j]++;
          const instruction = instructions[i] === "L" ? "left" : "right";
          currentNode = nodes[currentNode][instruction];
        }
      }
    }
  })
  .then(() => {
    console.log(iterations);
    console.log(lcmArray(iterations));
  });

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(numbers: number[]): number {
  let multiple = 1;
  numbers.forEach(n => {
    multiple = lcm(multiple, n);
  });
  return multiple;
}
