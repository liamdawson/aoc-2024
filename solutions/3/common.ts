export function todo() {
  return true;
}

interface InstructionMap {
  mul: {
    args: [number, number];
    result: number;
  };
}

export type InstructionKind = keyof InstructionMap;

export type Instruction<Kind extends InstructionKind = InstructionKind> = {
  [K in keyof InstructionMap]: {
    kind: K;
    args: InstructionMap[K]["args"];
    raw: string;
  };
}[Kind];

export type InstructionResult<Kind extends InstructionKind = InstructionKind> =
  {
    [K in keyof InstructionMap]: InstructionMap[K]["result"];
  }[Kind];

const mulInstructionRegex = /mul[(](\d+),(\d+)[)]/g;
export function extractInstructions(input: string): Instruction[] {
  const mulMatches = input
    .matchAll(mulInstructionRegex)
    .flatMap(([raw, arg1, arg2]) => {
      const args: [number, number] = [Number(arg1), Number(arg2)];

      if (Number.isNaN(args[0]) || Number.isNaN(args[1])) {
        return [];
      }

      return [
        {
          kind: "mul" as const,
          args: args,
          raw,
        },
      ];
    });

  return [...mulMatches];
}

function instructionIsKind<Kind extends InstructionKind>(
  instruction: Instruction,
  kind: Kind,
): instruction is Instruction<Kind> {
  return instruction.kind === kind;
}

export function evaluateInstruction<Kind extends InstructionKind>(
  instruction: Instruction<Kind>,
): InstructionResult<Kind> {
  if (instructionIsKind(instruction, "mul")) {
    return instruction.args[0] * instruction.args[1];
  }

  instruction satisfies never;
  throw new Error(
    `Unknown instruction kind ${(instruction as Record<string, string>).kind}`,
  );
}
