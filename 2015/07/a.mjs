import { readLines } from "../../utils.mjs";

const getValue = async maybeWire => {
  const num = Number(maybeWire);
  return Number.isNaN(num) ? getWire(maybeWire).getValue() : num;
};

const commands = {
  AND: async (wireA, wireB) => (await getValue(wireA)) & (await getValue(wireB)),
  OR: async (wireA, wireB) => (await getValue(wireA)) | (await getValue(wireB)),
  NOT: async wireA => ~(await getValue(wireA)),
  LSHIFT: async (wireA, wireB) => (await getValue(wireA)) << (await getValue(wireB)),
  RSHIFT: async (wireA, wireB) => (await getValue(wireA)) >> (await getValue(wireB)),
};

class Wire {
  constructor() {
    this.value = new Promise(resolve => {
      this._valueResolve = resolve;
    });
  }

  getValue = async () => {
    return this.value;
  };

  setValue = async instruction => {
    const inputs = instruction.split(" ");

    let value;
    if (inputs.length === 1) {
      value = await getValue(inputs[0]);
    } else if (inputs.length === 2) {
      const [command, wire] = inputs;
      value = await commands[command](wire);
    } else if (inputs.length === 3) {
      const [wireA, command, wireB] = inputs;
      value = await commands[command](wireA, wireB);
    }

    if (value < 0) {
      value += 65536;
    }

    this._valueResolve(value);
  };
}

const input = await readLines("./input.txt");

const wires = {};

const getWire = id => {
  if (!wires[id]) {
    wires[id] = new Wire();
  }

  return wires[id];
};

input.forEach(line => {
  const [instruction, id] = line.split(" -> ");
  getWire(id).setValue(instruction);
});

console.log(await wires.a.getValue());
