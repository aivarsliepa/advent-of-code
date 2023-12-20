import { readLinesSync, writeFile } from "../../utils-ts";

const modules = new Map<string, Module>();

type Command = {
  value: boolean;
  from: string;
  to: string;
};

const queue: Command[] = [];

class BroadCasterStrategy {
  public value = false;

  constructor(public module: Module, public outputs: string[]) {}

  next({ value }: Command) {
    this.value = value;
    for (const output of this.outputs) {
      queue.push({ value: this.value, from: this.module.key, to: output });
    }
  }

  addInput(input: string) {
    // no-op
  }
}

class FlipFlopStrategy {
  public value = false;

  constructor(public module: Module, public outputs: string[]) {}

  next({ value }: Command) {
    if (value) {
      return;
    }

    this.value = !this.value;
    for (const output of this.outputs) {
      queue.push({ value: this.value, from: this.module.key, to: output });
    }
  }

  addInput(input: string) {
    // no-op
  }
}

class ConjunctionStrategy {
  public value = false;
  public memory: Map<string, boolean> = new Map();

  constructor(public module: Module, public outputs: string[]) {}

  next({ value, from }: Command) {
    this.memory.set(from, value);

    const isAllTrue = Array.from(this.memory.values()).every(v => v);
    this.value = !isAllTrue;

    for (const output of this.outputs) {
      queue.push({ value: this.value, from: this.module.key, to: output });
    }
  }

  addInput(input: string) {
    this.memory.set(input, false);
  }
}

type ModuleType = "%" | "&" | "broadcaster";

class Module {
  type: ModuleType;
  strategy: FlipFlopStrategy | ConjunctionStrategy | BroadCasterStrategy;
  key: string;

  constructor(type: ModuleType, key: string, ouputs: string[]) {
    this.type = type;
    this.key = key;
    if (type === "%") {
      this.strategy = new FlipFlopStrategy(this, ouputs);
    } else if (type === "&") {
      this.strategy = new ConjunctionStrategy(this, ouputs);
    } else {
      this.strategy = new BroadCasterStrategy(this, ouputs);
    }
  }
}

const input = readLinesSync("./input.txt");

// init modules
input.forEach(line => {
  const [inputStr, outputsStr] = line.split(" -> ");
  const outputs = outputsStr.split(", ");
  if (inputStr === "broadcaster") {
    modules.set(inputStr, new Module("broadcaster", inputStr, outputs));
  } else {
    const type = inputStr[0] as ModuleType;
    const key = inputStr.slice(1);
    modules.set(key, new Module(type, key, outputs));
  }
});

// add inputs
input.forEach(line => {
  const [inputStr, outputsStr] = line.split(" -> ");
  const outputs = outputsStr.split(", ");
  const key = inputStr === "broadcaster" ? inputStr : inputStr.slice(1);
  for (const output of outputs) {
    modules.get(output)?.strategy.addInput(key);
  }
});

let trueCount = 0;
let falseCount = 0;
const CYCLES = 1_000;
for (let i = 0; i < CYCLES; i++) {
  queue.push({ value: false, to: "broadcaster", from: "input" });
  while (queue.length > 0) {
    const commands = queue.slice();
    queue.length = 0;
    commands.forEach(command => {
      if (command.value) {
        trueCount++;
      } else {
        falseCount++;
      }

      modules.get(command.to)?.strategy.next(command);
    });
  }
}

console.log(trueCount, falseCount, trueCount * falseCount);
