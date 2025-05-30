import { checkHorizontalChar } from "@/utils/validations";
import { checkVerticalChar, isValidAndUnvisited } from "@/utils/validations";
import { DIRECTIONS } from "@/constants/directions";
import type {
  CheckDirection,
  Direction,
  DirectionsEnum,
  PossibleDirections,
} from "@/types/directions";

const POSSIBLE_DIRECTIONS: PossibleDirections = {
  UP: { greenLight: false, handler: checkVerticalChar },
  DOWN: { greenLight: false, handler: checkVerticalChar },
  LEFT: { greenLight: false, handler: checkHorizontalChar },
  RIGHT: { greenLight: false, handler: checkHorizontalChar },
};

// Update checkDirection to use visited set
export function checkDirection({
  grid,
  currentRow,
  currentCol,
  visited = new Set(),
  previousDirection = null,
}: CheckDirection): Direction | null {
  // Direction reordering so it continues in right direction on different intersections
  const directionOrder = getDirectionOrder(previousDirection);

  const possibleDirectionsKeys = Object.keys(POSSIBLE_DIRECTIONS) as Array<
    keyof typeof DirectionsEnum
  >;

  // Go through all possible directions and check if its valid and unvisited
  for (const direction of possibleDirectionsKeys) {
    POSSIBLE_DIRECTIONS[direction].greenLight = isValidAndUnvisited(
      currentRow + DIRECTIONS[direction].row,
      currentCol + DIRECTIONS[direction].col,
      visited,
      grid,
      POSSIBLE_DIRECTIONS[direction].handler
    );
  }
  // Add validation to array
  const validDirections: Direction[] = [];

  for (const direction of directionOrder) {
    const hasPossibleDirection = POSSIBLE_DIRECTIONS[direction].greenLight;
    if (hasPossibleDirection) {
      validDirections.push(
        DIRECTIONS[direction as keyof typeof DirectionsEnum]
      );
    }
  }

  if (validDirections.length === 1) {
    return validDirections[0];
  }

  return validDirections.length > 0 ? validDirections[0] : null;
}

// ---------------  LOCAL FUNCTIONS ---------------
function getDirectionOrder(previousDirection: Direction | null) {
  if (!previousDirection) return Object.keys(DIRECTIONS);

  const directionKeys = Object.keys(DIRECTIONS) as Array<
    keyof typeof DirectionsEnum
  >;
  const prevDirKey = directionKeys.find(
    (key) =>
      DIRECTIONS[key].row === previousDirection.row &&
      DIRECTIONS[key].col === previousDirection.col
  );
  if (!prevDirKey) return Object.keys(DIRECTIONS);

  return [
    prevDirKey,
    ...Object.keys(DIRECTIONS).filter((d) => d !== prevDirKey),
  ];
}
