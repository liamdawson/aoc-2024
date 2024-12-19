import { linesFromInputFile } from "#shared";
import { InstructionMachine, parseInstructions } from "./common.ts";

export default async function main(args: string[]) {
	const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
	const instructions = inputLines.flatMap((line) => parseInstructions(line));
	const machine = new InstructionMachine();

	for (const instruction of instructions) {
		machine.add(instruction);
	}

	console.log(
		`Sum of ${machine.pendingOperations.length} instructions = ${machine.calculate()}`,
	);
}

if (import.meta.main) {
	await main(process.argv.slice(2));
}
