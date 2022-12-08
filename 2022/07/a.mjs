import { readLines } from "../../utils.mjs";

class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
}

class Directory {
  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.children = new Map();
  }

  add(child) {
    if (!this.children.has(child.name)) this.children.set(child.name, child);
  }

  getChildDir(name) {
    if (!this.children.has(name)) {
      this.children.set(name, new Directory(name, this));
    }

    return this.children.get(name);
  }
}

const root = new Directory("/", null, []);
const inputs = await readLines("./input.txt");

let currentDir = root;

inputs.forEach(input => {
  if (input === "$ ls") {
    return; // do nothing
  }

  if (input.startsWith("$ cd")) {
    const [, , target] = input.split(" ");
    if (target === "..") {
      currentDir = currentDir.parent;
    } else {
      currentDir = currentDir.getChildDir(target);
    }
    return;
  }

  const [left, name] = input.split(" ");
  if (left === "dir") {
    currentDir.add(new Directory(name, currentDir));
  } else {
    currentDir.add(new File(name, Number(left)));
  }
});

const sizeThreshold = 100000;
let totalSizeWithinThreshold = 0;

function getDirSize(dir) {
  let size = 0;
  for (const child of dir.children.values()) {
    if (child instanceof File) {
      size += child.size;
    } else {
      size += getDirSize(child);
    }
  }

  if (size <= sizeThreshold) {
    totalSizeWithinThreshold += size;
  }

  return size;
}

getDirSize(root);
console.log(totalSizeWithinThreshold);
