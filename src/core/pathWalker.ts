import { checkDirection } from "./directionChecker";
import { isAlphabetChar } from "@/utils/validations";
import { INTERSECTION_DIRECTIONS } from "@/constants/directions";
import type { DirectionsEnum } from "@/types/directions";
import type { Direction } from "@/types/directions";

// Add a visited set to track coordinates
function walkPath(grid: string[], startRow: number, startCol: number) {
  let currentRow = startRow;
  let currentCol = startCol;
  let alphabetCharactersInPath = "";
  let pathAsCharacters = "";
  let previousDirection = null;
  let direction = null;

  // Track visited coordinates as strings "row,col"
  const visited: Set<string> = new Set();
  visited.add(`${startRow},${startCol}`);

  // Walk through the elements, break the cycle if 'x' or not a valid direction
  while (true) {
    const currentChar = grid[currentRow][currentCol];
    console.log(currentChar);
    if (currentChar === "x") {
      pathAsCharacters += currentChar;
      break;
    }

    // Find next direction (pass visited set)
    const regularDirection = checkDirection({
      grid,
      currentRow,
      currentCol,
      visited,
      previousDirection,
    });

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
    currentRow += direction?.row ?? 0;
    currentCol += direction?.col ?? 0;

    // Mark as visited
    visited.add(`${currentRow},${currentCol}`);

    // Set previous direction so we know where to go on intersections
    previousDirection = direction;
  }

  return { alphabetCharactersInPath, pathAsCharacters, error: null };
}

function pathIntersectionHandler(
  grid: string[],
  row: number,
  col: number,
  visited: Set<string>
) {
  let intersection = { state: false, direction: null } as {
    state: boolean;
    direction: Direction | null;
  };

  const possibleDirectionsKeys = Object.keys(INTERSECTION_DIRECTIONS) as Array<
    keyof typeof DirectionsEnum
  >;

  possibleDirectionsKeys.forEach((direction) => {
    const updatedRow = row + INTERSECTION_DIRECTIONS[direction].row;
    const updatedCol = col + INTERSECTION_DIRECTIONS[direction].col;

    const validIntersectionDirection = checkDirection({
      grid,
      currentRow: updatedRow,
      currentCol: updatedCol,
      visited,
    });

    if (validIntersectionDirection) {
      intersection.state = true;
      intersection.direction = INTERSECTION_DIRECTIONS[direction];
    }
  });

  return intersection;
}

export default walkPath;
