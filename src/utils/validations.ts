import type { Direction } from "@/types/directions";

export function checkValidChar(
  row: number,
  col: number,
  pathsArray: string[],
  directionChecker: (char: string) => boolean
) {
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
  row: number,
  col: number,
  visited: Set<string>,
  grid: string[],
  directionChecker: (char: string) => boolean
) {
  if (visited.has(`${row},${col}`)) return false;
  return checkValidChar(row, col, grid, directionChecker);
}

export function isValidIntermediatePosition(
  grid: string[],
  position: Direction
): boolean {
  // Check bounds
  if (
    position.row < 0 ||
    position.row >= grid.length ||
    position.col < 0 ||
    position.col >= grid[position.row].length
  ) {
    return false;
  }

  // Check if character is a valid path character
  const char = grid[position.row][position.col];
  return /^[a-zA-Z\|\-\+x]$/.test(char);
}
