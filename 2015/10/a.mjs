const input = "1321131112";

let output = input;

for (let i = 0; i < 50; i++) {
  let newOutput = "";

  let currentChar = output[0];
  let currentCharCount = 1;

  for (let j = 1; j < output.length; j++) {
    if (output[j] === currentChar) {
      currentCharCount++;
    } else {
      newOutput += currentCharCount + currentChar;
      currentChar = output[j];
      currentCharCount = 1;
    }
  }

  newOutput += currentCharCount + currentChar;

  output = newOutput;
}

console.log(output.length);
