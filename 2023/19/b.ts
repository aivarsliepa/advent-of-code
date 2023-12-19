import { readLinesSync, writeFile } from "../../utils-ts";

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Range = {
  min: number;
  max: number;
};

class Ranges {
  constructor(public x: Range, public m: Range, public a: Range, public s: Range, public outcome: string | null) {}

  // number is the new boundry, included in new range, excluded in old range
  split(key: keyof Part, on: keyof Range, number: number, condition: string) {
    const newRange = this.clone();
    newRange.outcome = condition;
    newRange[key][on] = number;
    const thisOn = on === "max" ? "min" : "max";
    this[key][thisOn] = thisOn === "max" ? number - 1 : number + 1;
    return newRange;
  }

  clone() {
    return new Ranges({ ...this.x }, { ...this.m }, { ...this.a }, { ...this.s }, this.outcome);
  }
}

class WorkFlow {
  flows: Array<(range: Ranges) => Ranges | null> = [];
  constructor(defintion: string) {
    defintion.split(",").forEach(flow => this.createFlow(flow));
  }

  createFlow(flow: string) {
    if (!(flow.includes(">") || flow.includes("<"))) {
      this.flows.push(ranges => {
        ranges.outcome = flow;
        return null;
      });
      return;
    }

    const [condition, outcome] = flow.split(":");
    const isHigher = condition[1] === ">";
    const key = condition[0] as keyof Part;
    const num = Number(condition.substring(2));
    this.flows.push(ranges => {
      ranges.outcome = null;

      if (isHigher) {
        if (ranges[key].min > num) {
          ranges.outcome = outcome;
        } else if (ranges[key].max > num) {
          return ranges.split(key, "min", num + 1, outcome);
        }
      } else {
        if (ranges[key].max < num) {
          ranges.outcome = outcome;
        } else if (ranges[key].min < num) {
          return ranges.split(key, "max", num - 1, outcome);
        }
      }

      return null;
    });
  }

  processRanges(ranges: Ranges): Ranges[] {
    const newRanges: Ranges[] = [];
    for (let i = 0; i < this.flows.length; i++) {
      const outcomes = this.flows[i](ranges);
      if (outcomes) {
        newRanges.push(outcomes);
      }
      if (ranges.outcome) {
        newRanges.push(ranges);
        break;
      }
    }
    return newRanges;
  }
}

const input = readLinesSync("./input.txt");

const workflows = new Map<string, WorkFlow>();

const acceptedRanges: Ranges[] = [];

let creatingWorkflows = true;
input.forEach(line => {
  if (line.trim() === "") {
    creatingWorkflows = false;
  }

  if (creatingWorkflows) {
    const [key, rest] = line.split("{");
    workflows.set(key, new WorkFlow(rest.substring(0, rest.length - 1)));
  }
});

const ranges = new Ranges({ min: 1, max: 4000 }, { min: 1, max: 4000 }, { min: 1, max: 4000 }, { min: 1, max: 4000 }, "in");
const stack = [ranges];
while (stack.length > 0) {
  const ranges = stack.pop()!;
  const workflow = workflows.get(ranges.outcome!)!;
  const newRanges = workflow.processRanges(ranges);
  for (let i = 0; i < newRanges.length; i++) {
    if (newRanges[i].outcome === "A") {
      acceptedRanges.push(newRanges[i]);
    } else if (newRanges[i].outcome !== "R") {
      stack.push(newRanges[i]);
    }
  }
}

let totalCombinations = 0;
acceptedRanges.forEach(ranges => {
  totalCombinations +=
    (ranges.x.max - ranges.x.min + 1) * (ranges.m.max - ranges.m.min + 1) * (ranges.a.max - ranges.a.min + 1) * (ranges.s.max - ranges.s.min + 1);
});
console.log(totalCombinations);
