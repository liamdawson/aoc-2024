// north = "up" (earlier rows), west = "left" (earlier columns)
const searchDirections = {
  northwest: { colStep: -1, rowStep: -1 },
  north: { colStep: 0, rowStep: -1 },
  northeast: { colStep: 1, rowStep: -1 },
  west: { colStep: -1, rowStep: 0 },
  east: { colStep: 1, rowStep: 0 },
  southwest: { colStep: -1, rowStep: 1 },
  south: { colStep: 0, rowStep: 1 },
  southeast: { colStep: 1, rowStep: 1 },
} as const;
const allSearchDirections = Object.keys(
  searchDirections,
) as readonly SearchDirection[];
export type SearchDirection = keyof typeof searchDirections;

interface SearchGrid {
  letters: string[][];
  width: number;
  height: number;
  stringFrom(
    start: Point,
    takeNext: number,
    direction: SearchDirection,
  ): string | null;
}

export type Point = [row: number, column: number];

export function gridify(lines: string[]): SearchGrid {
  const letters: string[][] = [];
  const width = lines[0].length;

  for (const line of lines) {
    const row = line.trim().split("");
    if (row.length !== width) {
      throw new Error("Not all lines are of equal width!");
    }

    letters.push(row);
  }

  return {
    letters,
    width,
    height: letters.length,
    stringFrom(start: Point, takeNext: number, direction: SearchDirection) {
      const [startRow, startCol] = start;
      const { rowStep, colStep } = searchDirections[direction];

      const rowEnd = startRow + rowStep * takeNext;
      const colEnd = startCol + colStep * takeNext;

      // check whether the request is in range
      if (
        rowEnd < 0 ||
        rowEnd >= letters.length ||
        colEnd < 0 ||
        colEnd >= width
      ) {
        return null;
      }

      const resultLetters = [];
      for (let i = 0; i <= takeNext; i++) {
        resultLetters.push(
          letters[startRow + rowStep * i][startCol + colStep * i],
        );
      }

      return resultLetters.join("");
    },
  };
}

export function getMatches(needle: string, haystack: SearchGrid) {
  const needleLetters = needle.split("");
  const start = needleLetters[0];
  const remainderLength = needleLetters.length - 1;
  let matchesFound = 0;

  for (let rowIndex = 0; rowIndex < haystack.height; rowIndex++) {
    const row = haystack.letters[rowIndex];

    for (let colIndex = 0; colIndex < haystack.width; colIndex++) {
      const letter = row[colIndex];

      if (letter === start) {
        const matchesHere = allSearchDirections
          .map((direction) =>
            haystack.stringFrom(
              [rowIndex, colIndex],
              remainderLength,
              direction,
            ),
          )
          .filter((result) => result === needle).length;

        matchesFound += matchesHere;
      }
    }
  }

  return matchesFound;
}
