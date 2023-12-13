import { combinations, readLines } from "../../utils.mjs";

class Ingredient {
  constructor({ capacity, durability, flavor, texture, name, calories }) {
    this.name = name;
    this.capacity = capacity;
    this.durability = durability;
    this.flavor = flavor;
    this.texture = texture;
    this.calories = calories;
  }
}

const inputs = await readLines("./input.txt");

// const ingredients = [];
const ingredients = new Map();

console.log(inputs);

inputs.forEach((input, i) => {
  const split = input.split(" ");
  const name = split[0].slice(0, -1);
  const capacity = Number(split[2].slice(0, -1));
  const durability = Number(split[4].slice(0, -1));
  const flavor = Number(split[6].slice(0, -1));
  const texture = Number(split[8].slice(0, -1));
  const calories = Number(split[split.length - 1]);

  // ingredients.push(new Ingredient({ calories, capacity, durability, flavor, name, texture }));
  ingredients.set(i, new Ingredient({ calories, capacity, durability, flavor, name, texture }));
});

// // console.log(ingredients);

const start = performance.now();

console.log(combinations([...ingredients.keys()], 100).length);

console.log("time", (performance.now() - start) / 1000);

const allCombinations = combinations([...ingredients.keys()], 100);

let topScore = 0;

allCombinations.map(combination => {
  let capacity = 0,
    durability = 0,
    flavor = 0,
    texture = 0,
    calories = 0;

  combination.forEach(key => {
    const ingredient = ingredients.get(key);
    capacity += ingredient.capacity;
    durability += ingredient.durability;
    flavor += ingredient.flavor;
    texture += ingredient.texture;
    calories += ingredient.calories;
  });

  if (calories === 500) {
    const score = Math.max(0, capacity) * Math.max(0, durability) * Math.max(0, flavor) * Math.max(0, texture);
    topScore = Math.max(score, topScore);
  }
});

console.log("time", (performance.now() - start) / 1000);
console.log(topScore);

// let maxScore = Number.MIN_SAFE_INTEGER;

// const TIMES = 10;

// for (let i = 0; i < ingredients.length; i++) {
//   const ing = ingredients[i];

//   for (let i = 0; i <= TIMES; i++) {
//     const element = array[i];
//   }

// }
