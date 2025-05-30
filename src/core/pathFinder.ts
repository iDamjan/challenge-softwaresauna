import walkPath from "./pathWalker";

function findCharactersInPath(grid: string[]) {
  const startingCoordinates = findStartingPoint(grid);

  if (startingCoordinates.length === 0 || startingCoordinates.length > 1) {
    return {
      alphabetCharactersInPath: "",
      pathAsCharacters: "",
      error: "No starting point found",
    };
  }

  const { startingPointRow, startingPointColumn } = startingCoordinates[0];

  const { alphabetCharactersInPath, pathAsCharacters, error } = walkPath(
    grid,
    startingPointRow,
    startingPointColumn
  );

  return { alphabetCharactersInPath, pathAsCharacters, error };
}

function findStartingPoint(grid: string[]) {
  let startingCoordinates = [];
  for (let index = 0; index < grid.length; index++) {
    const currentRow = grid[index];
    const startingPointColumn = currentRow.indexOf("@");
    const startingPointRow = index;

    // If starting point index is bigger or equal to 0, means start is found
    if (startingPointColumn >= 0) {
      startingCoordinates.push({ startingPointRow, startingPointColumn });
    }
  }

  // If no starting point was found return -1
  // To be consistent we will return both indexes as -1
  return startingCoordinates;
}

export default findCharactersInPath;
