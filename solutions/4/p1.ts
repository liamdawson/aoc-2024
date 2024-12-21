import { linesFromInputFile } from "#shared";
import { getMatches, gridify } from "./common";

const searchString = "XMAS";

export default async function main(args: string[]) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const grid = gridify(inputLines);

  const startAt = new Date();
  console.log("Starting search");
  const result = getMatches(searchString, grid);
  const endAt = new Date();
  console.log(
    `Found ${result.totalMatches} match(es) for "${searchString}" (took ${endAt.getTime() - startAt.getTime()}ms).`,
  );
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
