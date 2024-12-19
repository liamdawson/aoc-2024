interface Instructions {
  mul: [number, number];
}
export type InstructionOperation = keyof Instructions;

export type Instruction<
  Operation extends InstructionOperation = InstructionOperation,
> = {
  readonly [Op in InstructionOperation]: {
    op: Op;
    args: Instructions[Op];
  };
}[Operation];

export type ParsedInstruction<
  Operation extends InstructionOperation = InstructionOperation,
> = Instruction<Operation> & { raw: string };

const knownInstructions = ["mul"] as const;
const maybeInstruction = new RegExp(
  `(${knownInstructions.join("|")})(?=([(][^)]*[)]))`,
  "g",
);
const remainderRegexFor: Record<string, RegExp> = {
  mul: /^\((\d+),(\d+)\)$/,
};

export function parseInstructions(input: string): ParsedInstruction[] {
  const mulMatches = input
    .matchAll(maybeInstruction)
    .flatMap(([raw, start, remainder]) => {
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

      return [];
    });

  return [...mulMatches];
}

export function evaluateInstruction(instruction: Instruction) {
  switch (instruction.op) {
    case "mul":
      return instruction.args[0] * instruction.args[1];
  }

  // type error on unknown instruction
  instruction.op satisfies never;
  throw new Error("Unknown operation");
}
