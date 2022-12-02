import md5 from "md5";

const input = "iwrupvqb";

let i = 0;
while (true) {
  if (md5(`${input}${i}`).startsWith("00000")) {
    console.log(i);
    break;
  }
  i++;
}
