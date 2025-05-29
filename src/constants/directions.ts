import type { Direction } from "@/types/directions";
import { DirectionsEnum } from "@/types/directions";
// Coordinate directions on how much to move for each direction in the grid
export const DIRECTIONS: Record<keyof typeof DirectionsEnum, Direction> = {
  UP: { row: -1, col: 0 },
  DOWN: { row: 1, col: 0 },
  LEFT: { row: 0, col: -1 },
  RIGHT: { row: 0, col: 1 },
};

// Intersection directions on how much to move for each direction in the grid
export const INTERSECTION_DIRECTIONS: Record<
  keyof typeof DirectionsEnum,
  Direction
> = {
  UP: { row: -2, col: 0 },
  DOWN: { row: 2, col: 0 },
  LEFT: { row: 0, col: -2 },
  RIGHT: { row: 0, col: 2 },
};
