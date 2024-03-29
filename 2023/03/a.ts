import { readLines } from "../../utils-ts";

type NumberData = {
  line: number;
  start: number;
  end: number;
  hasNearSymbol: boolean;
  number: number;
};

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
          hasNearSymbol: false,
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
        hasNearSymbol: false,
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

        if (!isCharDigit(ch) && ch !== ".") {
          return setHasSymbol(number);
        }
      }
    }

    if (line < input.length - 1) {
      const nextLine = input[line + 1];

      for (let i = startIndex; i <= endIndex; i++) {
        const ch = nextLine[i];

        if (!isCharDigit(ch) && ch !== ".") {
          return setHasSymbol(number);
        }
      }
    }

    if (start > 0) {
      const prevChar = input[line][start - 1];

      if (prevChar !== ".") {
        return setHasSymbol(number);
      }
    }

    if (end < input[0].length - 1) {
      const nextChar = input[line][end + 1];

      if (nextChar !== ".") {
        return setHasSymbol(number);
      }
    }
  });

  const sum = numbers
    .filter(number => number.hasNearSymbol)
    .reduce((acc, number) => {
      return acc + number.number;
    }, 0);

  console.log(sum);
});

function isCharDigit(char: string) {
  return !isNaN(parseInt(char));
}

function setHasSymbol(numberData: NumberData) {
  numberData.hasNearSymbol = true;
}
