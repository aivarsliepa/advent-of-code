import { readLines } from "../../utils.mjs";

const inputs = await readLines("./input.txt", 6, true);

class Monkey {
  constructor({ items, operation, divisableBy, falsey, truthy }) {
    this.items = items;
    this.operation = operation;
    this.divisableBy = divisableBy;
    this.falsey = falsey;
    this.truthy = truthy;

    this.timesInspected = 0;
  }
}

const monkeys = [];

inputs.forEach(input => {
  const [, startingItems, op, test, trueCondition, falseConditoin] = input.map(i => i.trim());

  const items = startingItems.split("items: ")[1].split(",").map(Number);
  const operation = op.split("Operation: ")[1].split("= ")[1];
  const divisableBy = test.split(" ").slice(-1).map(Number).pop();
  const falsey = falseConditoin.split(" ").slice(-1).map(Number).pop();
  const truthy = trueCondition.split(" ").slice(-1).map(Number).pop();

  monkeys.push(new Monkey({ items, operation, divisableBy, falsey, truthy }));
});

const processMonkey = monkey => {
  monkey.items.forEach(item => {
    monkey.timesInspected++;

    const op = `
      let old = ${item};
      ${monkey.operation};
    `;

    let newValue = eval(op);
    newValue = Math.floor(newValue / 3);

    if (newValue % monkey.divisableBy === 0) {
      monkeys[monkey.truthy].items.push(newValue);
    } else {
      monkeys[monkey.falsey].items.push(newValue);
    }
  });

  monkey.items = [];
};

for (let i = 0; i < 20; i++) {
  monkeys.forEach(processMonkey);
}

const [a, b] = monkeys.map(m => m.timesInspected).sort((a, b) => b - a);
console.log(a * b);
