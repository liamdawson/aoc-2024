import { linesFromInputFile } from "#shared";
import { makeVerifier, parseInput } from "./common";

export default async function main(args: string[]) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const { pageOrderRequirements, pageUpdateLists } = parseInput(inputLines);
  const verifier = makeVerifier(pageOrderRequirements);

  const checkedList = pageUpdateLists.map((list) => verifier(list));
  const val = checkedList.reduce(
    (sum, result) => sum + (result.valid ? result.middleNumber : 0),
    0,
  );
  const huh = checkedList.filter((a) => a.valid);

  console.log(
    `Middle sum: ${val} (${huh.length} of ${pageUpdateLists.length})`,
  );
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
