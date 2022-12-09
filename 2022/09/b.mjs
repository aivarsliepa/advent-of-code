import { readLines } from "../../utils.mjs";

const inputs = await readLines("input.txt");

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

const nodes = Array(10)
  .fill(0)
  .map(() => new Node(0, 0));

const tailPositions = new Set();
tailPositions.add("0,0");

const moveUp = () => {
  nodes[0].y++;
  moveNextNodeIfNotClose(0);
};

const moveDown = () => {
  nodes[0].y--;
  moveNextNodeIfNotClose(0);
};

const moveLeft = () => {
  nodes[0].x--;
  moveNextNodeIfNotClose(0);
};

const moveRight = () => {
  nodes[0].x++;
  moveNextNodeIfNotClose(0);
};

const moveNextNodeIfNotClose = index => {
  const currNode = nodes[index];
  const nextNode = nodes[index + 1];
  if (!nextNode) {
    tailPositions.add(`${currNode.x},${currNode.y}`);
    return;
  }

  const deltaX = currNode.x - nextNode.x;
  const deltaY = currNode.y - nextNode.y;

  if (Math.abs(deltaX) === 2 || Math.abs(deltaY) === 2) {
    nextNode.x += Math.sign(deltaX) * 1;
    nextNode.y += Math.sign(deltaY) * 1;
  }

  moveNextNodeIfNotClose(index + 1);
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
