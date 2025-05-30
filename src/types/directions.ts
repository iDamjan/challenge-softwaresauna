export enum DirectionsEnum {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export type Directions = keyof typeof DirectionsEnum;

export interface Direction {
  row: number;
  col: number;
}

export interface WalkingResult {
  alphabetCharactersInPath: string;
  pathAsCharacters: string;
  error: string | null;
}

export interface CheckDirection {
  grid: string[];
  currentRow: number;
  currentCol: number;
  visited: Set<string>;
  previousDirection?: Direction | null;
}

export interface PossibleDirections {
  [key: string]: { greenLight: boolean; handler: (char: string) => boolean };
}
