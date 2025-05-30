import { describe, it, expect } from "vitest";
import {
  checkValidChar,
  checkVerticalChar,
  checkHorizontalChar,
  isAlphabetChar,
  isValidAndUnvisited,
} from "@/utils/validations";

describe("Validation Utils - Unit Tests", () => {
  describe("checkValidChar", () => {
    const testGrid = ["@-A-+", "    |", "x-B-C"];

    it("should return true for valid coordinates and character", () => {
      const result = checkValidChar(0, 0, testGrid, (char) => char === "@");
      expect(result).toBe(true);
    });

    it("should return false for out of bounds row (negative)", () => {
      const result = checkValidChar(-1, 0, testGrid, () => true);
      expect(result).toBe(false);
    });

    it("should return false for out of bounds row (too large)", () => {
      const result = checkValidChar(3, 0, testGrid, () => true);
      expect(result).toBe(false);
    });

    it("should return false for out of bounds column (negative)", () => {
      const result = checkValidChar(0, -1, testGrid, () => true);
      expect(result).toBe(false);
    });

    it("should return false for out of bounds column (too large)", () => {
      const result = checkValidChar(0, 5, testGrid, () => true);
      expect(result).toBe(false);
    });

    it("should return false when direction checker fails", () => {
      const result = checkValidChar(0, 0, testGrid, (char) => char === "X");
      expect(result).toBe(false);
    });

    it("should handle empty grid", () => {
      const result = checkValidChar(0, 0, [], () => true);
      expect(result).toBe(false);
    });

    it("should handle empty row", () => {
      const emptyRowGrid = [""];
      const result = checkValidChar(0, 0, emptyRowGrid, () => true);
      expect(result).toBe(false);
    });
  });

  describe("checkVerticalChar", () => {
    it("should accept pipe character", () => {
      expect(checkVerticalChar("|")).toBe(true);
    });

    it("should accept plus character", () => {
      expect(checkVerticalChar("+")).toBe(true);
    });

    it("should accept uppercase letters", () => {
      expect(checkVerticalChar("A")).toBe(true);
      expect(checkVerticalChar("Z")).toBe(true);
    });

    it("should accept lowercase letters", () => {
      expect(checkVerticalChar("a")).toBe(true);
      expect(checkVerticalChar("z")).toBe(true);
    });

    it("should reject dash character", () => {
      expect(checkVerticalChar("-")).toBe(false);
    });

    it("should reject space character", () => {
      expect(checkVerticalChar(" ")).toBe(false);
    });

    it("should reject numbers", () => {
      expect(checkVerticalChar("1")).toBe(false);
      expect(checkVerticalChar("9")).toBe(false);
    });

    it("should reject special characters", () => {
      expect(checkVerticalChar("@")).toBe(false);
      expect(checkVerticalChar("x")).toBe(false);
      expect(checkVerticalChar("#")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(checkVerticalChar("")).toBe(false);
    });

    it("should reject multiple characters", () => {
      expect(checkVerticalChar("AB")).toBe(false);
      expect(checkVerticalChar("||")).toBe(false);
    });
  });

  describe("checkHorizontalChar", () => {
    it("should accept dash character", () => {
      expect(checkHorizontalChar("-")).toBe(true);
    });

    it("should accept plus character", () => {
      expect(checkHorizontalChar("+")).toBe(true);
    });

    it("should accept x character", () => {
      expect(checkHorizontalChar("x")).toBe(true);
    });

    it("should accept uppercase letters", () => {
      expect(checkHorizontalChar("A")).toBe(true);
      expect(checkHorizontalChar("Z")).toBe(true);
    });

    it("should accept lowercase letters", () => {
      expect(checkHorizontalChar("a")).toBe(true);
      expect(checkHorizontalChar("z")).toBe(true);
    });

    it("should reject pipe character", () => {
      expect(checkHorizontalChar("|")).toBe(false);
    });

    it("should reject space character", () => {
      expect(checkHorizontalChar(" ")).toBe(false);
    });

    it("should reject numbers", () => {
      expect(checkHorizontalChar("1")).toBe(false);
      expect(checkHorizontalChar("9")).toBe(false);
    });

    it("should reject @ character", () => {
      expect(checkHorizontalChar("@")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(checkHorizontalChar("")).toBe(false);
    });

    it("should reject multiple characters", () => {
      expect(checkHorizontalChar("AB")).toBe(false);
      expect(checkHorizontalChar("--")).toBe(false);
    });
  });

  describe("isAlphabetChar", () => {
    it("should accept uppercase letters", () => {
      expect(isAlphabetChar("A")).toBe(true);
      expect(isAlphabetChar("B")).toBe(true);
      expect(isAlphabetChar("Z")).toBe(true);
    });

    it("should accept lowercase letters", () => {
      expect(isAlphabetChar("a")).toBe(true);
      expect(isAlphabetChar("b")).toBe(true);
      expect(isAlphabetChar("z")).toBe(true);
    });

    it("should reject numbers", () => {
      expect(isAlphabetChar("1")).toBe(false);
      expect(isAlphabetChar("9")).toBe(false);
    });

    it("should reject special characters", () => {
      expect(isAlphabetChar("-")).toBe(false);
      expect(isAlphabetChar("|")).toBe(false);
      expect(isAlphabetChar("+")).toBe(false);
      expect(isAlphabetChar("@")).toBe(false);
      expect(isAlphabetChar("x")).toBe(false);
      expect(isAlphabetChar(" ")).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isAlphabetChar("")).toBe(false);
    });

    it("should reject multiple characters", () => {
      expect(isAlphabetChar("AB")).toBe(false);
      expect(isAlphabetChar("abc")).toBe(false);
    });
  });

  describe("isValidAndUnvisited", () => {
    const testGrid = ["@-A-+", "    |", "x-B-C"];

    it("should return true for valid unvisited position", () => {
      const visited = new Set<string>();
      const result = isValidAndUnvisited(
        0,
        1,
        visited,
        testGrid,
        checkHorizontalChar
      );
      expect(result).toBe(true);
    });

    it("should return false for visited position", () => {
      const visited = new Set<string>(["0,1"]);
      const result = isValidAndUnvisited(
        0,
        1,
        visited,
        testGrid,
        checkHorizontalChar
      );
      expect(result).toBe(false);
    });

    it("should return false for out of bounds position", () => {
      const visited = new Set<string>();
      const result = isValidAndUnvisited(
        -1,
        0,
        visited,
        testGrid,
        checkHorizontalChar
      );
      expect(result).toBe(false);
    });

    it("should return false for invalid character", () => {
      const visited = new Set<string>();
      const result = isValidAndUnvisited(
        1,
        0,
        visited,
        testGrid,
        checkHorizontalChar // space character should fail horizontal check
      );
      expect(result).toBe(false);
    });

    it("should handle empty visited set", () => {
      const visited = new Set<string>();
      const result = isValidAndUnvisited(
        0,
        0,
        visited,
        testGrid,
        (char: string) => char === "@"
      );
      expect(result).toBe(true);
    });

    it("should handle multiple visited positions", () => {
      const visited = new Set<string>(["0,0", "0,1", "0,2"]);
      const result = isValidAndUnvisited(
        0,
        1,
        visited,
        testGrid,
        checkHorizontalChar
      );
      expect(result).toBe(false);
    });
  });
});
