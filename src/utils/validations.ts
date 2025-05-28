export function checkValidChar(row, col, pathsArray, directionChecker) {
  // If coordinates goes out of bounds the path is no longer valid
  if (row < 0 || row >= pathsArray.length) return false;
  if (col < 0 || col >= pathsArray[row].length) return false;

  const symbol = pathsArray[row][col];
  return directionChecker(symbol);
}

export function checkVerticalChar(char: string) {
  // vertical character can be only pipe (|), plus (+), or A-Z
  const regex = /^[a-zA-Z\|+]+$/;
  return regex.test(char);
}

export function checkHorizontalChar(char: string) {
  const regex = /^[a-zA-Z\-x+]+$/;
  return regex.test(char);
}

export function isAlphabetChar(char: string) {
  const regex = /^[a-zA-Z]+$/;
  return regex.test(char);
}

export function isValidAndUnvisited(
  row,
  col,
  visited,
  pathsArray,
  directionChecker
) {
  if (visited.has(`${row},${col}`)) return false;
  return checkValidChar(row, col, pathsArray, directionChecker);
}
