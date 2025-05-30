import { describe, it, expect } from "vitest";
import { checkDirection } from "@/core/directionChecker";
import { DIRECTIONS } from "@/constants/directions";

describe("DirectionChecker - Unit Tests", () => {
  describe("checkDirection - basic functionality", () => {
    const simpleGrid = ["@-A-+", "    |", "x-B-C"];

    it("should find RIGHT direction from start position", () => {
      const result = checkDirection({
        grid: simpleGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.RIGHT);
    });

    it("should find DOWN direction when only vertical path available", () => {
      const verticalGrid = ["@", "|", "A", "x"];

      const result = checkDirection({
        grid: verticalGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.DOWN);
    });

    it("should find LEFT direction when moving leftward", () => {
      const leftGrid = ["x-A-@"];

      const result = checkDirection({
        grid: leftGrid,
        currentRow: 0,
        currentCol: 4,
        visited: new Set(["0,4"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.LEFT);
    });

    it("should find UP direction when moving upward", () => {
      const upGrid = ["x", "|", "A", "@"];

      const result = checkDirection({
        grid: upGrid,
        currentRow: 3,
        currentCol: 0,
        visited: new Set(["3,0"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.UP);
    });
  });

  describe("checkDirection - visited positions", () => {
    const grid = ["@-+-+", "  | |", "  A-B", "  | |", "  x-C"];

    it("should avoid visited positions", () => {
      const visited = new Set(["0,1", "0,2"]); // Block right path

      const result = checkDirection({
        grid,
        currentRow: 0,
        currentCol: 0,
        visited,
        previousDirection: null,
      });

      // Should find an alternative direction or return null
      expect(result).toBeNull();
    });

    it("should return null when all directions are visited", () => {
      const visited = new Set([
        "0,0", // current
        "0,1", // right
        "1,0", // down
        "-1,0", // up (out of bounds)
        "0,-1", // left (out of bounds)
      ]);

      const result = checkDirection({
        grid,
        currentRow: 0,
        currentCol: 0,
        visited,
        previousDirection: null,
      });

      expect(result).toBeNull();
    });
  });

  describe("checkDirection - previous direction priority", () => {
    const intersectionGrid = ["  A  ", "  |  ", "B-+-C", "  |  ", "  D  "];

    it("should prioritize continuing in previous direction", () => {
      const previousDirection = DIRECTIONS.RIGHT;

      const result = checkDirection({
        grid: intersectionGrid,
        currentRow: 2,
        currentCol: 2,
        visited: new Set(["2,2"]),
        previousDirection,
      });

      expect(result).toEqual(DIRECTIONS.RIGHT);
    });

    it("should prioritize continuing UP when coming from DOWN", () => {
      const previousDirection = DIRECTIONS.UP;

      const result = checkDirection({
        grid: intersectionGrid,
        currentRow: 2,
        currentCol: 2,
        visited: new Set(["2,2"]),
        previousDirection,
      });

      expect(result).toEqual(DIRECTIONS.UP);
    });

    it("should find alternative when previous direction is blocked", () => {
      const previousDirection = DIRECTIONS.RIGHT;
      const visited = new Set(["2,2", "2,3"]); // Block right direction

      const result = checkDirection({
        grid: intersectionGrid,
        currentRow: 2,
        currentCol: 2,
        visited,
        previousDirection,
      });

      // Should find an alternative direction (UP, DOWN, or LEFT)
      expect(result).toBeTruthy();
      expect(result).not.toEqual(DIRECTIONS.RIGHT);
    });
  });

  describe("checkDirection - edge cases", () => {
    it("should handle single character grid", () => {
      const singleGrid = ["@"];

      const result = checkDirection({
        grid: singleGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toBeNull();
    });

    it("should handle grid boundaries", () => {
      const boundaryGrid = ["@-x"];

      const result = checkDirection({
        grid: boundaryGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.RIGHT);
    });

    it("should handle empty visited set", () => {
      const grid = ["@-A"];

      const result = checkDirection({
        grid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.RIGHT);
    });

    it("should handle invalid characters in path", () => {
      const invalidGrid = [
        "@#A", // # is not a valid path character
      ];

      const result = checkDirection({
        grid: invalidGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toBeNull();
    });
  });

  describe("checkDirection - multiple valid directions", () => {
    const multiDirectionGrid = [" A ", "B+C", " D "];

    it("should return first valid direction when no previous direction", () => {
      const result = checkDirection({
        grid: multiDirectionGrid,
        currentRow: 1,
        currentCol: 1,
        visited: new Set(["1,1"]),
        previousDirection: null,
      });

      // Should return one of the valid directions
      expect(result).toBeTruthy();
      expect([
        DIRECTIONS.UP,
        DIRECTIONS.DOWN,
        DIRECTIONS.LEFT,
        DIRECTIONS.RIGHT,
      ]).toContain(result);
    });

    it("should handle letter characters as valid path elements", () => {
      const letterGrid = ["@ABC"];

      const result = checkDirection({
        grid: letterGrid,
        currentRow: 0,
        currentCol: 0,
        visited: new Set(["0,0"]),
        previousDirection: null,
      });

      expect(result).toEqual(DIRECTIONS.RIGHT);
    });
  });

  describe("checkDirection - complex scenarios", () => {
    it("should handle T-junction correctly", () => {
      const tJunctionGrid = ["A-+-B", "  |  ", "  C  "];

      // Coming from left, should be able to go right or down
      const result = checkDirection({
        grid: tJunctionGrid,
        currentRow: 0,
        currentCol: 2,
        visited: new Set(["0,2", "0,1"]), // came from left
        previousDirection: DIRECTIONS.RIGHT,
      });

      expect(result).toBeTruthy();
    });

    it("should handle corner turns", () => {
      const cornerGrid = ["@-+", "  |", "  A"];

      // At the corner position
      const result = checkDirection({
        grid: cornerGrid,
        currentRow: 0,
        currentCol: 2,
        visited: new Set(["0,2", "0,1"]), // came from left
        previousDirection: DIRECTIONS.RIGHT,
      });

      expect(result).toEqual(DIRECTIONS.DOWN);
    });
  });
});
