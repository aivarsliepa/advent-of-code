import { readLines } from "../../utils-ts";
import { memoize } from "lodash";

type Hand = {
  cards: string;
  bid: number;
};

const hands: Hand[] = [];

readLines("./input.txt").then(input => {
  input.forEach(line => {
    const [hand, bid] = line.split(" ");
    hands.push({ cards: hand, bid: parseInt(bid) });
  });

  hands.sort((a, b) => {
    const typeA = getHandType(a.cards);
    const typeB = getHandType(b.cards);
    if (typeA !== typeB) return typeA - typeB;

    for (let i = 0; i < a.cards.length; i++) {
      if (a.cards[i] !== b.cards[i]) {
        return compareCards(a.cards[i], b.cards[i]);
      }
    }

    return 0;
  });

  let total = 0;
  for (let i = 0; i < hands.length; i++) {
    total += hands[i].bid * (i + 1);
  }

  console.log(total);
});

const getHandType = memoize((cards: string) => {
  const counts = new Map<string, number>();
  cards.split("").forEach(card => {
    const count = counts.get(card);
    counts.set(card, count ? count + 1 : 1);
  });

  if (counts.size === 5) return 1; // high card
  if (counts.size === 4) return 2; // one pair
  if (counts.size === 3) {
    const max = Math.max(...counts.values());
    if (max === 2) return 3; // two pairs
    return 4; // three of a kind
  }
  if (counts.size === 2) {
    const max = Math.max(...counts.values());
    if (max === 3) return 5; // full house
    return 6; // four of a kind
  }
  return 7; // five of a kind
});

function compareCards(a: string, b: string) {
  const values = "23456789TJQKA";
  return values.indexOf(a) - values.indexOf(b);
}
