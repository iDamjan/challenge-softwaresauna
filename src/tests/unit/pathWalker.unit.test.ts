import { describe, it, expect, vi, beforeEach } from "vitest";
import walkPath from "@/core/pathWalker";
import { checkDirection } from "@/core/directionChecker";
import { DIRECTIONS } from "@/constants/directions";

// Mock the checkDirection function to isolate pathWalker logic
vi.mock("@/core/directionChecker", () => ({
  checkDirection: vi.fn(),
}));

const mockCheckDirection = vi.mocked(checkDirection);

describe("PathWalker - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("position advancement", () => {
    it("should advance position based on RIGHT direction", () => {
      const grid = ["@-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // First call: move right
        .mockReturnValueOnce(null); // Second call: no direction (at 'x')

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@-x");
    });

    it("should advance position based on DOWN direction", () => {
      const grid = ["@", "|", "x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.DOWN) // First call: move down
        .mockReturnValueOnce(DIRECTIONS.DOWN) // Second call: move down again
        .mockReturnValueOnce(null); // Third call: no direction (at 'x')

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@|x");
    });

    it("should advance position based on LEFT direction", () => {
      const grid = ["x-@"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.LEFT) // First call: move left
        .mockReturnValueOnce(null); // Second call: no direction (at 'x')

      const result = walkPath(grid, 0, 2);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@-x");
    });

    it("should advance position based on UP direction", () => {
      const grid = ["x", "|", "@"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.UP) // First call: move up
        .mockReturnValueOnce(DIRECTIONS.UP) // Second call: move up again
        .mockReturnValueOnce(null); // Third call: no direction (at 'x')

      const result = walkPath(grid, 2, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@|x");
    });
  });

  describe("letter collection", () => {
    it("should collect uppercase letters", () => {
      const grid = ["@-A-B-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->A
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // A->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->B
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // B->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("AB");
    });

    it("should collect lowercase letters", () => {
      const grid = ["@-a-b-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->a
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // a->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->b
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // b->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("ab");
    });

    it("should not collect non-letter characters", () => {
      const grid = ["@-1-+-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->1
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // 1->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->+
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // +->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("");
    });

    it("should collect letters in order of traversal", () => {
      const grid = ["@-C-A-B-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->C
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // C->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->A
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // A->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->B
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // B->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("CAB");
    });
  });

  describe("path character collection", () => {
    it("should collect all path characters including start", () => {
      const grid = ["@-A-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->A
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // A->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@-A-x");
    });

    it("should include end marker in path", () => {
      const grid = ["@x"];
      mockCheckDirection.mockReturnValueOnce(null); // No direction from @

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@x");
    });
  });

  describe("visited position tracking", () => {
    it("should track visited positions", () => {
      const grid = ["@-A-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(null);

      walkPath(grid, 0, 0);

      // Verify checkDirection was called with visited sets
      expect(mockCheckDirection).toHaveBeenCalledWith(
        expect.objectContaining({
          visited: expect.any(Set),
        })
      );

      // Check that visited set grows with each call
      const calls = mockCheckDirection.mock.calls;
      expect(calls[0][0].visited.size).toBe(1); // Initial position
      expect(calls[1][0].visited.size).toBe(2); // After first move
      expect(calls[2][0].visited.size).toBe(3); // After second move
    });

    it("should include starting position in visited set", () => {
      const grid = ["@-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(null);

      walkPath(grid, 0, 0);

      const firstCall = mockCheckDirection.mock.calls[0][0];
      expect(firstCall.visited.has("0,0")).toBe(true);
    });
  });

  describe("previous direction tracking", () => {
    it("should pass previous direction to checkDirection", () => {
      const grid = ["@-A-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(DIRECTIONS.RIGHT)
        .mockReturnValueOnce(null);

      walkPath(grid, 0, 0);

      const calls = mockCheckDirection.mock.calls;
      expect(calls[0][0].previousDirection).toBeNull(); // First call has no previous
      expect(calls[1][0].previousDirection).toEqual(DIRECTIONS.RIGHT); // Second call has RIGHT
      expect(calls[2][0].previousDirection).toEqual(DIRECTIONS.RIGHT); // Third call has RIGHT
    });

    it("should update previous direction after each move", () => {
      const grid = ["@", "|", "+-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.DOWN) // @->|
        .mockReturnValueOnce(DIRECTIONS.DOWN) // |->+
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // +->-
        .mockReturnValueOnce(null); // ->x

      walkPath(grid, 0, 0);

      const calls = mockCheckDirection.mock.calls;
      expect(calls[0][0].previousDirection).toBeNull();
      expect(calls[1][0].previousDirection).toEqual(DIRECTIONS.DOWN);
      expect(calls[2][0].previousDirection).toEqual(DIRECTIONS.DOWN);
      expect(calls[3][0].previousDirection).toEqual(DIRECTIONS.RIGHT);
    });
  });

  describe("error handling", () => {
    it("should return error when no valid direction found", () => {
      const grid = ["@-"];
      mockCheckDirection.mockReturnValueOnce(null); // No valid direction

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBe("No valid direction found");
      expect(result.alphabetCharactersInPath).toBe("");
      expect(result.pathAsCharacters).toBe("@");
    });

    it("should return error when stuck in middle of path", () => {
      const grid = ["@-A-"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->A
        .mockReturnValueOnce(null); // A->- (no valid direction)

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBe("No valid direction found");
      expect(result.alphabetCharactersInPath).toBe("A");
      expect(result.pathAsCharacters).toBe("@-A");
    });
  });

  describe("end marker handling", () => {
    it("should stop at 'x' character", () => {
      const grid = ["@-x-A"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@-x");
      expect(result.alphabetCharactersInPath).toBe("");
    });

    it("should include 'x' in path characters", () => {
      const grid = ["@x"];
      mockCheckDirection.mockReturnValueOnce(null);

      const result = walkPath(grid, 0, 0);

      expect(result.pathAsCharacters).toContain("x");
    });

    it("should not collect letters after 'x'", () => {
      const grid = ["@-A-x-B"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // @->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // ->A
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // A->-
        .mockReturnValueOnce(DIRECTIONS.RIGHT); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.alphabetCharactersInPath).toBe("A");
      expect(result.pathAsCharacters).toBe("@-A-x");
    });
  });

  describe("edge cases", () => {
    it("should handle immediate end at start", () => {
      const grid = ["x"];

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("x");
      expect(result.alphabetCharactersInPath).toBe("");
    });

    it("should handle single step path", () => {
      const grid = ["@x"];
      mockCheckDirection.mockReturnValueOnce(null);

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.pathAsCharacters).toBe("@x");
    });

    it("should handle starting at letter", () => {
      const grid = ["A-x"];
      mockCheckDirection
        .mockReturnValueOnce(DIRECTIONS.RIGHT) // A->-
        .mockReturnValueOnce(null); // ->x

      const result = walkPath(grid, 0, 0);

      expect(result.error).toBeNull();
      expect(result.alphabetCharactersInPath).toBe("A");
      expect(result.pathAsCharacters).toBe("A-x");
    });
  });
});
