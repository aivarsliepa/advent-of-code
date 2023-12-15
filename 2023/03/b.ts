import { readLines } from "../../utils-ts";

type NumberData = {
  line: number;
  start: number;
  end: number;
  gears: [number, number][]; // [line, index]
  number: number;
};

const GEAR = "*";
const numbers: NumberData[] = [];

readLines("./input.txt").then(input => {
  input.forEach((line, lineI) => {
    let currentStart = -1;
    line.split("").forEach((char, i) => {
      const isDigit = isCharDigit(char);
      if (isDigit && currentStart === -1) {
        currentStart = i;
      } else if (!isDigit && currentStart !== -1) {
        numbers.push({
          line: lineI,
          start: currentStart,
          end: i - 1,
          gears: [],
          number: parseInt(line.slice(currentStart, i)),
        });
        currentStart = -1;
      }
    });

    if (currentStart !== -1) {
      numbers.push({
        line: lineI,
        start: currentStart,
        end: line.length - 1,
        gears: [],
        number: parseInt(line.slice(currentStart, line.length)),
      });
    }
  });

  numbers.forEach(number => {
    const { line, start, end } = number;

    const startIndex = Math.max(start - 1, 0);
    const endIndex = Math.min(end + 1, input[0].length - 1);

    if (line > 0) {
      const prevLine = input[line - 1];

      for (let i = startIndex; i <= endIndex; i++) {
        const ch = prevLine[i];

        if (ch === GEAR) {
          number.gears.push([line - 1, i]);
        }
      }
    }

    if (line < input.length - 1) {
      const nextLine = input[line + 1];

      for (let i = startIndex; i <= endIndex; i++) {
        const ch = nextLine[i];

        if (ch === GEAR) {
          number.gears.push([line + 1, i]);
        }
      }
    }

    if (start > 0) {
      const prevChar = input[line][start - 1];

      if (prevChar === GEAR) {
        number.gears.push([line, start - 1]);
      }
    }

    if (end < input[0].length - 1) {
      const nextChar = input[line][end + 1];

      if (nextChar === GEAR) {
        number.gears.push([line, end + 1]);
      }
    }
  });

  type Gear = {
    line: number;
    index: number;
    numbers: number[];
  };

  const gears: Gear[] = [];

  numbers.forEach(number => {
    number.gears.forEach(([line, index]) => {
      let gearData = gears.find(g => g.line === line && g.index === index);
      if (!gearData) {
        gearData = {
          line,
          index,
          numbers: [],
        };
        gears.push(gearData);
      }

      gearData.numbers.push(number.number);
    });
  });

  const sum = gears
    .filter(g => g.numbers.length === 2)
    .reduce((acc, gear) => {
      return acc + gear.numbers[0] * gear.numbers[1];
    }, 0);

  console.log(sum);
});

function isCharDigit(char: string) {
  return !isNaN(parseInt(char));
}
