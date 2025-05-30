// Test setup and configuration
import { vi } from "vitest";

// Global test configuration
export const testConfig = {
  timeout: 5000,
  retries: 2,
};

// Common test utilities
export const createMockGrid = (pattern: string[]): string[] => {
  return pattern.map((row) => row);
};

// Helper to create visited sets for testing
export const createVisitedSet = (coordinates: string[]): Set<string> => {
  return new Set(coordinates);
};

// Mock console.log to avoid noise in tests
vi.stubGlobal("console", {
  ...console,
  log: vi.fn(),
});

// Common test data
export const testGrids = {
  simple: ["@-A-x"],
  vertical: ["@", "|", "A", "x"],
  withTurn: ["@-+", "  |", "  A", "  x"],
  complex: ["@---A---+", "        |", "x-B-+   C", "    |   |", "    +---+"],
  invalid: ["@", " ", "x"],
  empty: [] as string[],
  noStart: ["A-B-C", "D-E-F"],
};

export default testConfig;
