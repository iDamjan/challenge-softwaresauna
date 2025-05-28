import { checkDirection } from "./directionChecker";
import { isAlphabetChar } from "../utils/validations";
import { INTERSECTION_DIRECTIONS } from "../constants/directions";

// Add a visited set to track coordinates
function walkPath(grid, startRow, startCol) {
  let currentRow = startRow;
  let currentCol = startCol;
  let alphabetCharactersInPath = "";
  let pathAsCharacters = "";

  let direction = null;

  // Track visited coordinates as strings "row,col"
  const visited = new Set();
  visited.add(`${startRow},${startCol}`);

  // Walk through the elements, break the cycle if 'x' or not a valid direction
  while (true) {
    const currentChar = grid[currentRow][currentCol];

    if (currentChar === "x") {
      pathAsCharacters += currentChar;
      break;
    }

    // Find next direction (pass visited set)
    const regularDirection = checkDirection(
      grid,
      currentRow,
      currentCol,
      visited
    );

    if (!regularDirection) {
      // If there is no valid direction check for intersections
      const intersection = pathIntersectionHandler(
        grid,
        currentRow,
        currentCol,
        visited
      );

      if (!intersection.state) {
        return {
          alphabetCharactersInPath,
          pathAsCharacters,
          error: "No valid direction found",
        };
      } else {
        direction = intersection.direction;
      }
    } else {
      direction = regularDirection;
    }

    // Collect letters
    if (isAlphabetChar(currentChar)) {
      alphabetCharactersInPath += currentChar;
    }
    pathAsCharacters += grid[currentRow][currentCol];

    // Move to next position
    currentRow += direction.row;
    currentCol += direction.col;

    // Mark as visited
    visited.add(`${currentRow},${currentCol}`);
  }

  return { alphabetCharactersInPath, pathAsCharacters, error: null };
}

function pathIntersectionHandler(grid, row, col, visited) {
  let intersection = { state: false, direction: null };

  Object.keys(INTERSECTION_DIRECTIONS).forEach((direction) => {
    const updatedRow = row + INTERSECTION_DIRECTIONS[direction].row;
    const updatedCol = col + INTERSECTION_DIRECTIONS[direction].col;

    const validIntersectionDirection = checkDirection(
      grid,
      updatedRow,
      updatedCol,
      visited
    );

    if (validIntersectionDirection) {
      intersection.state = true;
      intersection.direction = INTERSECTION_DIRECTIONS[direction];
    }
  });

  return intersection;
}

export default walkPath;
