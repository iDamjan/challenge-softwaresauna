import { describe, it, expect } from "vitest";
import findCharactersInPath from "@/core/pathFinder";
import {
  testMap1,
  testMap2,
  testMap3,
  testMap4,
  testMap5,
  testMap6,
  testMap7,
  testMap8,
  testMap9,
} from "@/data/testMaps";

describe("PathFinder - Integration Tests", () => {
  describe("Valid paths with expected outputs", () => {
    it("should correctly traverse testMap1 and collect letters A, B, C", () => {
      const result = findCharactersInPath(testMap1);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("ACB");
      expect(result.pathAsCharacters).toBe("@---A---+|C|+---+|+-B-x");
    });

    it("should result in error when there is no correct turn", () => {
      const result = findCharactersInPath(testMap2);

      expect(result.error).toBe("No valid direction found");
      expect(result.alphabetCharactersInPath).toBe("A");
      expect(result.pathAsCharacters).toBe("@---A--");
    });

    it("should correctly traverse testMap4 with vertical start and collect A, C, B, D", () => {
      const result = findCharactersInPath(testMap4);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("ABCD");
      expect(result.pathAsCharacters).toBe("@|A+---B--+|+--C-+|||+---D--+|x");
    });

    it("should correctly traverse testMap5 with multiple turns", () => {
      const result = findCharactersInPath(testMap5);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("ABC");
      expect(result.pathAsCharacters).toBe("@---+|A---+|B---+|Cx");
    });

    it("should correctly traverse testMap6 with multiple intersections", () => {
      const result = findCharactersInPath(testMap6);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("GOONIES");
      // The exact path may vary depending on intersection handling
      expect(result.pathAsCharacters).toBe(
        "@-G-O-+|+-+|||+-O-N-+|I|+-+|+--+|ES|x"
      );
    });

    it("should ignore characters after end marker (x) in testMap7", () => {
      const result = findCharactersInPath(testMap7);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("AB");
      expect(result.pathAsCharacters).toBe("@-A--+|+-B--x");
      expect(result.pathAsCharacters).not.toContain("C");
      expect(result.pathAsCharacters).not.toContain("D");
    });

    it("should traverse in tight spaces", () => {
      const result = findCharactersInPath(testMap9);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("BLAH");
      expect(result.pathAsCharacters).toBe("@B+++|+-L-+A+++-+Hx");
    });
  });

  describe("Invalid maps and error cases", () => {
    it("should return error when no starting point exists (testMap8)", () => {
      const result = findCharactersInPath(testMap8);

      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });

    it("should return error when path has no ending symbol (testMap3)", () => {
      const result = findCharactersInPath(testMap3);

      expect(result.error).toBe("No valid direction found");
      expect(result.alphabetCharactersInPath).toBe("ACB");
      expect(result.pathAsCharacters).toBe("@---A---+|C|+---+|+-B");
    });

    it("should handle empty grid", () => {
      const result = findCharactersInPath([]);

      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });

    it("should handle grid with only spaces", () => {
      const result = findCharactersInPath(["   ", "   ", "   "]);

      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle start at grid boundaries", () => {
      const edgeMap = ["@-x"];
      const result = findCharactersInPath(edgeMap);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("@-x");
    });

    it("should handle immediate end after start", () => {
      const immediateEndMap = ["@x"];
      const result = findCharactersInPath(immediateEndMap);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("@x");
    });
  });
});
