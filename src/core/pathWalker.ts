import { checkDirection } from "./directionChecker";
import {
  isAlphabetChar,
  isValidIntermediatePosition,
} from "@/utils/validations";
import { INTERSECTION_DIRECTIONS } from "@/constants/directions";
import type { DirectionsEnum, WalkingResult } from "@/types/directions";
import type { Direction } from "@/types/directions";

// Add a visited set to track coordinates
function walkPath(
  grid: string[],
  startRow: number,
  startCol: number
): WalkingResult {
  const walkingCoordinates = {
    currentRow: startRow,
    currentCol: startCol,
  };

  // Collected information variables
  let alphabetCharactersInPath = "";
  let pathAsCharacters = "";
  let previousDirection = null;

  // Track visited coordinates as strings "row,col"
  const visited: Set<string> = new Set();
  visited.add(`${startRow},${startCol}`);

  // Walk through the elements, break the cycle if 'x' or not a valid direction
  while (true) {
    const currentChar =
      grid[walkingCoordinates.currentRow][walkingCoordinates.currentCol];

    if (currentChar === "x") {
      pathAsCharacters += currentChar;
      break;
    }

    const direction = handleDirection(
      grid,
      walkingCoordinates.currentRow,
      walkingCoordinates.currentCol,
      visited,
      previousDirection
    );

    if (!direction) {
      return {
        alphabetCharactersInPath,
        pathAsCharacters,
        error: "No valid direction found",
      };
    }

    // Collect information - letters and path characters
    if (isAlphabetChar(currentChar)) {
      alphabetCharactersInPath += currentChar;
    }
    pathAsCharacters += currentChar;

    // Move to next position
    walkingCoordinates.currentRow += direction?.row ?? 0;
    walkingCoordinates.currentCol += direction?.col ?? 0;

    // Mark as visited
    visited.add(
      `${walkingCoordinates.currentRow},${walkingCoordinates.currentCol}`
    );

    // Set previous direction so we know where to go on intersections
    previousDirection = direction;
  }

  return { alphabetCharactersInPath, pathAsCharacters, error: null };
}

// ---------------  LOCAL FUNCTIONS ---------------
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

  for (const direction of possibleDirectionsKeys) {
    const intermediateRow = row + INTERSECTION_DIRECTIONS[direction].row;
    const intermediateCol = col + INTERSECTION_DIRECTIONS[direction].col;

    // Check if the intermediate position (1 step away) is valid and contains a valid path character
    const validIntermediatePosition = isValidIntermediatePosition(grid, {
      row: intermediateRow,
      col: intermediateCol,
    });

    if (!validIntermediatePosition) {
      continue;
    }
    // Now check the actual destination (2 steps away)
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
  }

  return intersection;
}

function handleDirection(
  grid: string[],
  row: number,
  col: number,
  visited: Set<string>,
  previousDirection: Direction | null
) {
  // Find next direction (pass visited set)
  const regularDirection = checkDirection({
    grid,
    currentRow: row,
    currentCol: col,
    visited,
    previousDirection,
  });

  if (!regularDirection) {
    // If there is no valid direction check for intersections
    const intersection = pathIntersectionHandler(grid, row, col, visited);
    if (!intersection.state) {
      return null;
    } else {
      return intersection.direction;
    }
  } else {
    return regularDirection;
  }
}

export default walkPath;
