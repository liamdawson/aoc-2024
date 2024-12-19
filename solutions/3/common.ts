interface Instructions {
	mul: [number, number];
	do: [];
	"don't": [];
}
export type InstructionOperation = keyof Instructions;

export type Instruction<
	Operation extends InstructionOperation = InstructionOperation,
> = {
	[Op in InstructionOperation]: {
		op: Op;
		args: Instructions[Op];
	};
}[Operation];

export type ParsedInstruction<
	Operation extends InstructionOperation = InstructionOperation,
> = Instruction<Operation> & { raw: string };

const knownInstructions = [
	"mul",
	"do",
	"don't",
] as const satisfies InstructionOperation[];
const maybeInstruction = new RegExp(
	`(${knownInstructions.join("|")})(?=([(][^)]*[)]))`,
	"g",
);
const remainderRegexFor = {
	mul: /^\((\d+),(\d+)\)$/,
	do: /^\(\)$/,
	"don't": /^\(\)$/,
} satisfies Record<InstructionOperation, RegExp>;

export function parseInstructions(input: string): ParsedInstruction[] {
	return [
		...input
			.matchAll(maybeInstruction)
			.flatMap<ParsedInstruction>(([raw, start, remainder]) => {
				const op = start as InstructionOperation;

				const remainderRegex = remainderRegexFor[op];
				const remainderResult = remainderRegex?.exec(remainder);

				if (!remainderResult) {
					return [];
				}

				if (op === "mul") {
					const [_, arg1, arg2] = remainderResult;
					const args: [number, number] = [Number(arg1), Number(arg2)];

					if (Number.isNaN(args[0]) || Number.isNaN(args[1])) {
						return [];
					}

					return [
						{
							op,
							args,
							raw,
						},
					] as const;
				}

				if (op === "do" || op === "don't") {
					return [
						{
							op,
							args: [],
							raw,
						},
					] as const;
				}

				op satisfies never;
				throw new Error(`Unknown parsed operation ${op}`);
			}),
	];
}

interface InstructionMachineOptions {
	supportedOperations?: InstructionOperation[];
}

export class InstructionMachine {
	public static V1_OPERATIONS = [
		"mul",
	] as const satisfies InstructionOperation[];
	public static V2_OPERATIONS = [
		...this.V1_OPERATIONS,
		"do",
		"don't",
	] as const satisfies InstructionOperation[];

	public supportedOperations: Set<InstructionOperation>;
	public readonly pendingOperations: Instruction<"mul">[] = [];
	public mulEnabled = true;

	constructor(options?: InstructionMachineOptions) {
		this.supportedOperations = new Set([
			...(options?.supportedOperations ?? InstructionMachine.V1_OPERATIONS),
		]);
	}

	public add(instruction: Instruction): boolean {
		const { op } = instruction;

		if (!this.supportedOperations.has(op)) {
			return false;
		}

		if (op === "do" || op === "don't") {
			const newValue = op === "do";
			if (this.mulEnabled === newValue) {
				return false;
			}

			this.mulEnabled = newValue;
			return true;
		}

		if (op === "mul") {
			this.mulEnabled && this.pendingOperations.push(instruction);
			return this.mulEnabled;
		}

		return false;
	}

	public calculate(): number {
		return this.pendingOperations.reduce(
			(prev, instruction) => prev + instruction.args[0] * instruction.args[1],
			0,
		);
	}
}
