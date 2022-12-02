import fs from "fs"
import readline from "readline"
import path from "path"
import { cwd } from "process";

export const readInput = async (path) => {
  const file = await fs.readFileSync(path, "utf8");
  return file;
};
  

export const readLines = async (filePath) => {
  const fileStream = fs.createReadStream(path.resolve(cwd(), filePath));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const lines = [];
  for await (const line of rl) {
    lines.push(line);
  }
  return lines;
};