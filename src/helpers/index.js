export function codeToSixDigits(code) {
  let newCode = code;
  while(newCode.length < 6) {
    newCode = `0${newCode}`;
  }
  return newCode;
};