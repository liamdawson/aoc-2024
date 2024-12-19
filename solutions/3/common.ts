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
  return [
    ...input.matchAll(maybeInstruction).flatMap(([raw, start, remainder]) => {
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
    }),
  ];
}

export class InstructionMachine {
  public supportedOperations: Set<InstructionOperation>;
  public readonly pendingOperations: Instruction[] = [];

  constructor() {
    this.supportedOperations = new Set([...knownInstructions]);
  }

  public add(instruction: Instruction): boolean {
    if (!this.supportedOperations.has(instruction.op)) {
      return false;
    }

    this.pendingOperations.push(instruction);

    return true;
  }

  public calculate(): number {
    return this.pendingOperations.reduce(
      (prev, instruction) => prev + instruction.args[0] * instruction.args[1],
      0,
    );
  }
}
