import { readLines } from "../../utils.mjs";

const inputs = await readLines("input.txt");

let tailX = 0,
  tailY = 0,
  headX = 0,
  headY = 0;

const tailPositions = new Set();
tailPositions.add("0,0");

const moveUp = () => {
  headY++;
  moveTailIfNotCloseToHead();
};

const moveDown = () => {
  headY--;
  moveTailIfNotCloseToHead();
};

const moveLeft = () => {
  headX--;
  moveTailIfNotCloseToHead();
};

const moveRight = () => {
  headX++;
  moveTailIfNotCloseToHead();
};

const moveTailIfNotCloseToHead = () => {
  const deltaX = headX - tailX;
  const deltaY = headY - tailY;

  if (Math.abs(deltaX) === 2 || Math.abs(deltaY) === 2) {
    tailX += Math.sign(deltaX) * 1;
    tailY += Math.sign(deltaY) * 1;
  }

  tailPositions.add(`${tailX},${tailY}`);
};

inputs.forEach(input => {
  const [direction, times] = input.split(" ");
  for (let i = 0; i < Number(times); i++) {
    switch (direction) {
      case "U":
        moveUp();
        break;
      case "D":
        moveDown();
        break;
      case "L":
        moveLeft();
        break;
      case "R":
        moveRight();
        break;
    }
  }
});

console.log(tailPositions.size);
