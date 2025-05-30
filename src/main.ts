// Use this for testing purposes
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
} from "./data/testMaps";
import findCharactersInPath from "./core/pathFinder";

const result = findCharactersInPath(testMap6);

console.log(
  result.pathAsCharacters,
  result.alphabetCharactersInPath,
  result.error
);
