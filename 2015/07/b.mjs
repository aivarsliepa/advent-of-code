import { ReplaySubject, of, combineLatest, map, firstValueFrom, repeat, distinctUntilChanged } from "rxjs";
import { readLines } from "../../utils.mjs";

const getValue = maybeWire => {
  const num = Number(maybeWire);
  return Number.isNaN(num) ? getWire(maybeWire).getValue() : of(maybeWire).pipe(repeat(1));
};

const commands = {
  AND: (wireA, wireB) => {
    return combineLatest([getValue(wireA), getValue(wireB)]).pipe(map(([a, b]) => a & b));
  },
  OR: (wireA, wireB) => {
    return combineLatest([getValue(wireA), getValue(wireB)]).pipe(map(([a, b]) => a | b));
  },
  NOT: wireA => {
    return getValue(wireA).pipe(map(a => ~a));
  },
  LSHIFT: (wireA, wireB) => {
    return combineLatest([getValue(wireA), getValue(wireB)]).pipe(map(([a, b]) => a << b));
  },
  RSHIFT: (wireA, wireB) => {
    return combineLatest([getValue(wireA), getValue(wireB)]).pipe(map(([a, b]) => a >> b));
  },
};

const normalize = val => (val < 0 ? val + 65536 : val);

class Wire {
  constructor(id) {
    this.id = id;
    this.subject = new ReplaySubject(1);
    this.subscription = null;
    this.subject.asObservable().toPromise();
    this.instruction = null;
  }

  getValue = () => {
    return this.subject.asObservable().pipe(distinctUntilChanged());
  };

  setAndLogValue = val => {
    this.subject.next(val);
  };

  setValue = instruction => {
    this.subscription?.unsubscribe();
    this.instruction = instruction;

    const inputs = instruction.split(" ");

    if (inputs.length === 1) {
      this.subscription = getValue(inputs[0]).pipe(map(normalize)).subscribe(this.setAndLogValue);
    } else if (inputs.length === 2) {
      const [command, wire] = inputs;
      this.subscription = commands[command](wire).pipe(map(normalize)).subscribe(this.setAndLogValue);
    } else if (inputs.length === 3) {
      const [wireA, command, wireB] = inputs;
      this.subscription = commands[command](wireA, wireB).pipe(map(normalize)).subscribe(this.setAndLogValue);
    }
  };
}

const input = await readLines("./input.txt");

const wires = {};

const getWire = id => {
  if (!wires[id]) {
    wires[id] = new Wire(id);
  }

  return wires[id];
};

input.forEach(line => {
  const [instruction, id] = line.split(" -> ");
  getWire(id).setValue(instruction);
});

const val = await firstValueFrom(getWire("a").getValue());
console.log("a", val);
console.log("override b");
getWire("b").setValue(val.toString());
console.log("a", await firstValueFrom(getWire("a").getValue()));
