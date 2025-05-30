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
  test,
} from "./data/testMaps";
import findCharactersInPath from "./core/pathFinder";

const result = findCharactersInPath(test);

console.log(
  result.pathAsCharacters,
  result.alphabetCharactersInPath,
  result.error
);
