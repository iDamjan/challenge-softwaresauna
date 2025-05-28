import { checkHorizontalChar } from "../utils/validations";

import { checkVerticalChar, isValidAndUnvisited } from "../utils/validations";
import { DIRECTIONS } from "../constants/directions";

// Update checkDirection to use visited set
export function checkDirection(
  grid,
  currentRow,
  currentCol,
  visited = new Set()
) {
  const possibleDirections = {
    UP: { canGo: false, handler: checkVerticalChar },
    DOWN: { canGo: false, handler: checkVerticalChar },
    LEFT: { canGo: false, handler: checkHorizontalChar },
    RIGHT: { canGo: false, handler: checkHorizontalChar },
  };

  // Go through all possible directions and check if its valid and unvisited
  Object.keys(possibleDirections).forEach((direction) => {
    possibleDirections[direction].canGo = isValidAndUnvisited(
      currentRow + DIRECTIONS[direction].row,
      currentCol + DIRECTIONS[direction].col,
      visited,
      grid,
      possibleDirections[direction].handler
    );
  });

  // Add validation to array
  const validDirections = [];
  if (possibleDirections.RIGHT.canGo) validDirections.push(DIRECTIONS.RIGHT);
  if (possibleDirections.LEFT.canGo) validDirections.push(DIRECTIONS.LEFT);
  if (possibleDirections.UP.canGo) validDirections.push(DIRECTIONS.UP);
  if (possibleDirections.DOWN.canGo) validDirections.push(DIRECTIONS.DOWN);

  if (validDirections.length === 1) {
    return validDirections[0];
  }

  return validDirections.length > 0 ? validDirections[0] : null;
}
