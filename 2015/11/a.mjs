let password = "vzbxxyzz";

function nextChar(char) {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

function nextPassword() {
  const chars = password.split("");
  for (let i = password.length - 1; i >= 0; i--) {
    if (chars[i] === "z") {
      chars[i] = "a";
    } else {
      chars[i] = nextChar(chars[i]);
      break;
    }
  }

  password = chars.join("");
}

function hasForbiddenChars() {
  return password.includes("i") || password.includes("o") || password.includes("l");
}

function hasIncreasingLetters() {
  for (let i = 2; i < password.length; i++) {
    if (password[i - 2].charCodeAt(0) + 1 === password[i - 1].charCodeAt(0) && password[i - 1].charCodeAt(0) + 1 === password[i].charCodeAt(0)) {
      return true;
    }
  }
}

function hasPairs() {
  let pairs = 0;
  const pairsNeeded = 2;

  for (let i = 0; i < password.length - 1; i++) {
    if (password[i] === password[i + 1]) {
      pairs++;
      i++;
    }

    if (pairs === pairsNeeded) {
      return true;
    }
  }
}

function isValidPassowrd() {
  return !hasForbiddenChars() && hasIncreasingLetters() && hasPairs();
}

nextPassword();
while (!isValidPassowrd()) {
  nextPassword();
}

console.log(password);
