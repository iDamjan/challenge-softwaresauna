import { describe, it, expect, vi, beforeEach } from "vitest";
import findCharactersInPath from "@/core/pathFinder";
import walkPath from "@/core/pathWalker";

// Mock the walkPath function to isolate pathFinder logic
vi.mock("@/core/pathWalker", () => ({
  default: vi.fn(),
}));

const mockWalkPath = vi.mocked(walkPath);

describe("PathFinder - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Starting point functionality - success cases", () => {
    it("should find starting point in first row", () => {
      const grid = ["@-A-x"];
      mockWalkPath.mockReturnValue({
        alphabetCharactersInPath: "A",
        pathAsCharacters: "@-A-x",
        error: null,
      });

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).toHaveBeenCalledWith(grid, 0, 0);
      expect(result.alphabetCharactersInPath).toBe("A");
    });

    it("should find starting point in middle row", () => {
      const grid = ["A-B-C", "@-D-x", "E-F-G"];
      mockWalkPath.mockReturnValue({
        alphabetCharactersInPath: "D",
        pathAsCharacters: "@-D-x",
        error: null,
      });

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).toHaveBeenCalledWith(grid, 1, 0);
      expect(result.alphabetCharactersInPath).toBe("D");
    });

    it("should find starting point in last row", () => {
      const grid = ["A-B-C", "D-E-F", "@-G-x"];
      mockWalkPath.mockReturnValue({
        alphabetCharactersInPath: "G",
        pathAsCharacters: "@-G-x",
        error: null,
      });

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).toHaveBeenCalledWith(grid, 2, 0);
      expect(result.alphabetCharactersInPath).toBe("G");
    });

    it("should find starting point at different column positions", () => {
      const grid = ["A-B-@-C-x"];
      mockWalkPath.mockReturnValue({
        alphabetCharactersInPath: "C",
        pathAsCharacters: "@-C-x",
        error: null,
      });

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).toHaveBeenCalledWith(grid, 0, 4);
      expect(result.alphabetCharactersInPath).toBe("C");
    });
  });

  describe("Starting point functionality - error cases", () => {
    it("should return error when no starting point exists", () => {
      const grid = ["A-B-C", "D-E-F"];

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).not.toHaveBeenCalled();
      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });

    it("should handle empty grid", () => {
      const grid: string[] = [];

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).not.toHaveBeenCalled();
      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });

    it("should handle grid with empty strings", () => {
      const grid = ["", "", ""];

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).not.toHaveBeenCalled();
      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });

    it("should throw an error when multiple starting points are found", () => {
      const grid = ["A-B-@-C-x", "D-E-@-G-x"];

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).not.toHaveBeenCalled();
      expect(result.error).toBe("Multiple starting points found");
    });

    it("should handle grid with only spaces", () => {
      const grid = ["   ", "   ", "   "];

      const result = findCharactersInPath(grid);

      expect(mockWalkPath).not.toHaveBeenCalled();
      expect(result.error).toBe("No starting point found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("");
    });
  });
});
