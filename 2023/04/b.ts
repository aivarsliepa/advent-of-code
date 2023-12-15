import { readLines } from "../../utils-ts";

let totalCards = 0;
let extraCards = new Map<number, number>();

readLines("./input.txt").then(input => {
  input.forEach((line, lineIndex) => {
    let wins = 0;
    const [card, numbers] = line.split(":");
    const cardNumber = parseInt(card.split(" ").filter(ch => !!ch)[1]);
    const [winningNumbers, existingNumbers] = numbers.trim().split(" | ");
    const winningNumbersArr = winningNumbers
      .split(" ")
      .map(n => n.trim())
      .filter(n => n !== undefined && n !== "");

    const existingNumbersArr = existingNumbers
      .split(" ")
      .map(n => n.trim())
      .filter(n => n !== undefined && n !== "");

    existingNumbersArr.forEach(n => {
      if (winningNumbersArr.includes(n)) wins++;
    });

    const numberOfCards = (extraCards.get(cardNumber) || 0) + 1;
    for (let i = 1; i <= wins; i++) {
      if (!extraCards.has(cardNumber + i)) {
        extraCards.set(cardNumber + i, numberOfCards);
      } else {
        extraCards.set(cardNumber + i, extraCards.get(cardNumber + i)! + numberOfCards);
      }
    }

    totalCards += numberOfCards;
  });

  console.log(totalCards);
});
