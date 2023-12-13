// Sprinkles: capacity 2, durability 0, flavor -2, texture 0, calories 3
// Butterscotch: capacity 0, durability 5, flavor -3, texture 0, calories 3
// Chocolate: capacity 0, durability 0, flavor 5, texture -1, calories 8
// Candy: capacity 0, durability -1, flavor 0, texture 5, calories 8

const inputs = [
  [2, 0, -2, 0, 3],
  [0, 5, -3, 0, 3],
  [0, 0, 5, -1, 8],
  [0, -1, 0, 5, 8],
];

let maxScore = 0;
let combinations = 0;

const start = performance.now();

for (let i = 0; i <= 100; i++) {
  for (let j = 0; j <= 100 - i; j++) {
    for (let k = 0; k <= 100 - i - j; k++) {
      combinations++;
      const h = 100 - i - j - k;
      const a = inputs[0][0] * i + inputs[1][0] * j + inputs[2][0] * k + inputs[3][0] * h;
      const b = inputs[0][1] * i + inputs[1][1] * j + inputs[2][1] * k + inputs[3][1] * h;
      const c = inputs[0][2] * i + inputs[1][2] * j + inputs[2][2] * k + inputs[3][2] * h;
      const d = inputs[0][3] * i + inputs[1][3] * j + inputs[2][3] * k + inputs[3][3] * h;
      const e = inputs[0][4] * i + inputs[1][4] * j + inputs[2][4] * k + inputs[3][4] * h;

      if (a <= 0 || b <= 0 || c <= 0 || d <= 0) {
        continue;
      }

      maxScore = Math.max(maxScore, a * b * c * d);
    }
  }
}

console.log(`time ${(performance.now() - start) / 1000}`);
console.log(maxScore);
console.log("combinations", combinations);
