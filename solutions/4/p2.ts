import { linesFromInputFile } from "#shared";
import {
  getMatches,
  gridify,
  type Point,
  type SearchDirection,
} from "./common";

const searchString = "MAS";
const matchCoordinateIndex = 1; // A in MAS
const cardinalDirections: SearchDirection[] = [
  "north",
  "east",
  "south",
  "west",
];

export default async function main(args: string[]) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const grid = gridify(inputLines);

  const startAt = new Date();
  console.log("Starting search");
  const diagonalResults = getMatches(searchString, grid).matches.filter(
    (match) => !cardinalDirections.includes(match.direction),
  );

  const endSearchAt = new Date();
  console.log(
    `Found ${diagonalResults.length} diagonal match(es) for "${searchString}" (took ${endSearchAt.getTime() - startAt.getTime()}ms).`,
  );

  let crossMasCount = 0;
  const matchCoordinatesSeen: Point[] = [];

  for (const result of diagonalResults) {
    const matchCoordinate = result.coordinates[matchCoordinateIndex];
    if (
      matchCoordinatesSeen.some(
        ([rowIndex, colIndex]) =>
          rowIndex === matchCoordinate[0] && colIndex === matchCoordinate[1],
      )
    ) {
      crossMasCount += 1;
    } else {
      matchCoordinatesSeen.push(matchCoordinate);
    }
  }

  const endMatchAt = new Date();
  console.log(
    `Found ${crossMasCount} match(es) for X-"${searchString}" (took ${endMatchAt.getTime() - endSearchAt.getTime()}ms, ${endMatchAt.getTime() - startAt.getTime()}ms total).`,
  );
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
