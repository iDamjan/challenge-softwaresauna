export const testMap1 = [
  "@---A---+",
  "        |",
  "x-B-+   C",
  "    |   |",
  "    +---+",
];

export const test = ["@-C-A-B-x"];

export const testMap2 = [
  "@---A--- ",
  "        |",
  "x-B-+   C",
  "    |   |",
  "    +---+",
];

export const testMap3 = [
  "@---A---+",
  "        |",
  " -B-+   C",
  "    |   |",
  "    +---+",
];

export const testMap4 = [
  "@",
  "| +-C--+",
  "A |    |",
  "+---B--+",
  "  |      x",
  "  |      |",
  "  +---D--+",
];
export const testMap5 = [
  "@---+",
  "    |",
  "    A---+",
  "        |",
  "    +---B",
  "    |",
  "    C",
  "    x",
];

// Multiple intersections
export const testMap6 = [
  "    +-O-N-+",
  "    |     |",
  "    |   +-I-+",
  "@-G-O-+ | | |",
  "    | | +-+ E",
  "    +-+     S",
  "            |",
  "            x",
];

// Ignore characters after end (x)
export const testMap7 = ["@-A--+", "     |", "     +-B--x-C--D"];

// Invalid map, no start
export const testMap8 = [
  "---+",
  "    |",
  "    A---+",
  "        |",
  "    +---B",
  "    |",
  "    C",
  "    x",
];

// Find characters in tight spaces
export const testMap9 = [" +-L-+", " | |+A-+", "@B+ ++ H", " ++    x"];
