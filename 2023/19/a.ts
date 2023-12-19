import { readLinesSync, writeFile } from "../../utils-ts";

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

const acceptedParts: Part[] = [];
const rejectedParts: Part[] = [];

class WorkFlow {
  flows: Array<(part: Part) => string | null> = [];
  constructor(defintion: string) {
    defintion.split(",").forEach(flow => this.createFlow(flow));
  }

  createFlow(flow: string) {
    if (!(flow.includes(">") || flow.includes("<"))) {
      this.flows.push(() => flow);
      return;
    }

    const [condition, outcome] = flow.split(":");
    const isHigher = condition[1] === ">";
    const key = condition[0] as keyof Part;
    const num = Number(condition.substring(2));
    this.flows.push(part => {
      if (isHigher) {
        return part[key] > num ? outcome : null;
      } else {
        return part[key] < num ? outcome : null;
      }
    });
  }

  processPart(part: Part) {
    for (let i = 0; i < this.flows.length; i++) {
      const outcome = this.flows[i](part);
      if (outcome) {
        return outcome;
      }
    }
  }

  static reject(part: Part) {
    rejectedParts.push(part);
  }

  static accept(part: Part) {
    acceptedParts.push(part);
  }
}

const input = readLinesSync("./input.txt");

const workflows = new Map<string, WorkFlow>();

let processingParts = false;
input.forEach(line => {
  if (line.trim() === "") {
    processingParts = true;
  }

  if (processingParts) {
    const [x, m, a, s] = line
      .substring(1, line.length - 1)
      .split(",")
      .map(s => Number(s.split("=")[1]));

    const part = { x, m, a, s };
    let outcome = "in";
    while (true) {
      const workflow = workflows.get(outcome)!;
      outcome = workflow.processPart(part)!;
      if (outcome === "A") {
        WorkFlow.accept(part);
        break;
      } else if (outcome === "R") {
        WorkFlow.reject(part);
        break;
      }
    }
  } else {
    const [key, rest] = line.split("{");
    workflows.set(key, new WorkFlow(rest.substring(0, rest.length - 1)));
  }
});

let sum = 0;
acceptedParts.forEach(part => {
  for (let key in part) {
    sum += part[key as keyof Part];
  }
});
console.log(sum);
