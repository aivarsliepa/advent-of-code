import { lcmArray, readLinesSync, writeFile } from "../../utils-ts";

const modules = new Map<string, Module>();

type Command = {
  value: boolean;
  from: string;
  to: string;
};

const queue: Command[] = [];

class RXStrategy {
  public value = false;
  public counter = 0;

  constructor(public module: Module, public outputs: string[]) {}

  next({ value }: Command) {
    if (!value) {
      this.counter++;
    }
  }

  addInput(input: string) {
    // no-op
  }
}

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

let iterations = 0;
let exit = false;
class ConjunctionStrategy {
  public value = false;
  public memory: Map<string, boolean> = new Map();
  isRxInput = false;
  inputCycles = new Map<string, number>();

  constructor(public module: Module, public outputs: string[]) {
    if (this.outputs.length === 1 && this.outputs[0] === "rx") {
      this.isRxInput = true;
    }
  }

  next({ value, from }: Command) {
    this.memory.set(from, value);

    const isAllTrue = Array.from(this.memory.values()).every(v => v);
    this.value = !isAllTrue;

    for (const output of this.outputs) {
      queue.push({ value: this.value, from: this.module.key, to: output });
    }

    if (this.isRxInput) {
      if (value) {
        this.inputCycles.set(from, iterations);
        if (this.inputCycles.size === this.memory.size) {
          const lcm = lcmArray(Array.from(this.inputCycles.values()));
          console.log(lcm);
          exit = true;
        }
      }
    }
  }

  addInput(input: string) {
    this.memory.set(input, false);
  }
}

type ModuleType = "%" | "&" | "broadcaster" | "rx";

class Module {
  type: ModuleType;
  strategy: FlipFlopStrategy | ConjunctionStrategy | BroadCasterStrategy | RXStrategy;
  key: string;

  constructor(type: ModuleType, key: string, ouputs: string[]) {
    this.type = type;
    this.key = key;
    if (type === "%") {
      this.strategy = new FlipFlopStrategy(this, ouputs);
    } else if (type === "&") {
      this.strategy = new ConjunctionStrategy(this, ouputs);
    } else if (type === "rx") {
      this.strategy = new RXStrategy(this, ouputs);
    } else {
      this.strategy = new BroadCasterStrategy(this, ouputs);
    }
  }
}

const input = readLinesSync("./input.txt");

modules.set("rx", new Module("rx", "rx", []));

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

while (!exit) {
  iterations++;

  if (iterations % 1_000_000 === 0) {
    console.log("iterations", iterations);
  }

  queue.push({ value: false, to: "broadcaster", from: "input" });
  while (queue.length > 0) {
    const commands = queue.slice();
    queue.length = 0;
    commands.forEach(command => {
      modules.get(command.to)?.strategy.next(command);
    });
  }

  const rx = modules.get("rx")?.strategy as RXStrategy;
  if (rx.counter > 0) {
    console.log(rx.counter);
  }

  if (rx.counter === 1) {
    break;
  } else {
    rx.counter = 0;
  }
}

console.log(iterations);
