import { linesFromInputFile } from "#shared";

export default async function main(args: string[]) {
  const _inputLines = await linesFromInputFile(args[0] ?? "input.txt");

  console.debug("TODO");
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}