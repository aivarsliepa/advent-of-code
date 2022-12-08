import { readLines } from "../../utils.mjs";

const input = (await readLines("./input.txt"))[0];

const packetLength = 14;

for (let i = 0; i < input.length - packetLength; i++) {
  if (new Set(input.slice(i, i + packetLength)).size === packetLength) {
    console.log(i + packetLength);
    break;
  }
}
