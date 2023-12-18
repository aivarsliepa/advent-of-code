import { readLines } from "../../utils-ts";

type Item = {
  label: string;
  length: number;
};
const hashMap = new Map<number, Array<Item>>();

readLines("./input.txt")
  .then(input => {
    for (let i = 0; i < 256; i++) {
      hashMap.set(i, []);
    }

    input[0].split(",").forEach(elem => {
      const isNegative = elem.includes("-");
      if (isNegative) {
        const label = elem.split("-")[0];
        const hash = getHashNumber(label);
        const arr = hashMap.get(hash)!;
        hashMap.set(
          hash,
          arr.filter(item => item.label !== label),
        );
      } else {
        const [label, length] = elem.split("=");
        const hash = getHashNumber(label);
        const arr = hashMap.get(hash)!;
        const item = arr.find(item => item.label === label);
        if (item) {
          item.length = parseInt(length);
        } else {
          arr.push({
            label,
            length: parseInt(length),
          });
        }
      }
    });
  })
  .then(() => {
    let score = 0;
    for (let i = 0; i < 256; i++) {
      const arr = hashMap.get(i)!;
      arr.forEach((item, j) => {
        score += (i + 1) * (j + 1) * item.length;
      });
    }
    return score;
  })
  .then(output => {
    console.log(output);
  });

function getHashNumber(str: string) {
  const hash = str.split("").reduce((acc, curr) => {
    return ((acc + curr.charCodeAt(0)) * 17) % 256;
  }, 0);
  return hash;
}
