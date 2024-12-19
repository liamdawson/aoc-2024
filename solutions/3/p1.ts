import { linesFromInputFile } from "#shared";
import { evaluateInstruction, parseInstructions } from "./common.ts";

export default async function main(args: string[]) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const instructions = inputLines.flatMap((line) => parseInstructions(line));

  const result = instructions
    .map((instruction) => evaluateInstruction(instruction))
    .reduce((a, b) => a + b);

  console.log(`Sum of ${instructions.length} instructions = ${result}`);
  // console.log(instructions.map((i) => i.raw).join("\n"));
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
