import { describe, test, expect } from "vitest";
import {
  evaluateInstruction,
  extractInstructions,
  type Instruction,
  type InstructionResult,
} from "./common.ts";

describe(extractInstructions.name, () => {
  test("extracts a single, standalone instruction", () => {
    expect(extractInstructions("mul(2,3)")).toEqual([
      { kind: "mul", args: [2, 3], raw: "mul(2,3)" },
    ]);
  });

  test("extracts two consecutive instructions", () => {
    expect(extractInstructions("mul(2,3)mul(4,5)")).toEqual([
      { kind: "mul", args: [2, 3], raw: "mul(2,3)" },
      { kind: "mul", args: [4, 5], raw: "mul(4,5)" },
    ]);
  });

  test("ignores surrounding characters", () => {
    expect(extractInstructions("testmul(2,3),halt()")).toEqual([
      { kind: "mul", args: [2, 3], raw: "mul(2,3)" },
    ]);
  });
});

describe(evaluateInstruction.name, () => {
  test.each<{ instruction: Instruction; result: InstructionResult }>([
    {
      instruction: { kind: "mul", args: [44, 46], raw: "mul(44,46)" },
      result: 2024,
    },
    {
      instruction: { kind: "mul", args: [123, 4], raw: "mul(123,4)" },
      result: 492,
    },
  ])(
    "$instruction.kind($instruction.args) -> $result",
    ({ instruction, result }) => {
      expect(evaluateInstruction(instruction)).toEqual(result);
    },
  );
});
