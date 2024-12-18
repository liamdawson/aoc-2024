import { linesFromInputFile } from "#shared";
import { evaluateInstruction, extractInstructions } from "./common.ts";

export default async function main(args: string[]) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const instructions = inputLines.flatMap((line) => extractInstructions(line));

  const result = instructions
    .map((instruction) => evaluateInstruction(instruction))
    .reduce((a, b) => a + b);

  console.log(`Sum of ${instructions.length} instructions = ${result}`);
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
