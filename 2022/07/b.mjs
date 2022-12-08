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

const totalSpace = 70000000;
const spaceNeeded = 30000000;

const root = new Directory("/", null, []);
const inputs = await readLines("./input.txt");

let currentDir = null;

inputs.forEach(input => {
  if (input === "$ ls") {
    return; // do nothing
  }

  if (input.startsWith("$ cd")) {
    const [, , target] = input.split(" ");
    if (target === "/") {
      currentDir = root;
    } else if (target === "..") {
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

const dirSizes = {};
function setDirSizes(dir, prefix) {
  let size = 0;
  for (const child of dir.children.values()) {
    if (child instanceof File) {
      size += child.size;
    } else {
      size += setDirSizes(child, prefix + dir.name + "/");
    }
  }

  dirSizes[prefix + dir.name] = {
    size,
    name: dir.name,
  };

  return size;
}

setDirSizes(root, "");

const spaceDiff = spaceNeeded - (totalSpace - dirSizes["/"].size);
const smallestToDelete = Object.values(dirSizes)
  .sort((a, b) => a.size - b.size)
  .find(dir => dir.size >= spaceDiff);

console.log(smallestToDelete);
