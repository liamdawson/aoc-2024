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
  travelFrom(
    start: Point,
    takeNext: number,
    direction: SearchDirection,
  ): SearchResult | null;
}

export type Point = [row: number, column: number];

export type SearchResult = {
  letters: string;
  coordinates: Point[];
};

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
    travelFrom(start: Point, takeNext: number, direction: SearchDirection) {
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

      const coordinates: Point[] = [];
      const resultLetters = [];

      for (let i = 0; i <= takeNext; i++) {
        const coordinate: Point = [
          startRow + rowStep * i,
          startCol + colStep * i,
        ];

        coordinates.push(coordinate);
        resultLetters.push(letters[coordinate[0]][coordinate[1]]);
      }

      return {
        letters: resultLetters.join(""),
        coordinates,
      };
    },
  };
}

export function getMatches(needle: string, haystack: SearchGrid) {
  const needleLetters = needle.split("");
  const start = needleLetters[0];
  const remainderLength = needleLetters.length - 1;
  const matched: Point[][] = [];

  for (let rowIndex = 0; rowIndex < haystack.height; rowIndex++) {
    const row = haystack.letters[rowIndex];

    for (let colIndex = 0; colIndex < haystack.width; colIndex++) {
      const letter = row[colIndex];

      if (letter === start) {
        for (const direction of allSearchDirections) {
          const result = haystack.travelFrom(
            [rowIndex, colIndex],
            remainderLength,
            direction,
          );

          if (result?.letters === needle) {
            matched.push(result.coordinates);
          }
        }
      }
    }
  }

  return {
    totalMatches: matched.length,
    coordinates: matched,
  };
}
