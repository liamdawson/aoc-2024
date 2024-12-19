import { describe, test, expect } from "vitest";
import {
  evaluateInstruction,
  parseInstructions,
  type Instruction,
} from "./common.ts";

const instr = {
  mul(a: number, b: number) {
    return expect.objectContaining({
      op: "mul",
      args: [a, b],
    } satisfies Instruction);
  },
};

describe(parseInstructions.name, () => {
  test("extracts a single, standalone instruction", () => {
    expect(parseInstructions("mul(2,3)")).toEqual([instr.mul(2, 3)]);
  });

  test("extracts two consecutive instructions", () => {
    expect(parseInstructions("mul(2,3)mul(4,5)")).toEqual([
      instr.mul(2, 3),
      instr.mul(4, 5),
    ]);
  });

  test("ignores surrounding characters", () => {
    expect(parseInstructions("testmul(2,3),halt()")).toEqual([instr.mul(2, 3)]);
  });

  test("parses a 'nested' instruction", () => {
    expect(parseInstructions("mul(mul(17,4))")).toEqual([instr.mul(17, 4)]);
  });
});

describe(evaluateInstruction.name, () => {
  test.each<{ instruction: Instruction; result: number }>([
    {
      instruction: { op: "mul", args: [44, 46] },
      result: 2024,
    },
    {
      instruction: { op: "mul", args: [123, 4] },
      result: 492,
    },
  ])(
    "$instruction.kind($instruction.args) -> $result",
    ({ instruction, result }) => {
      expect(evaluateInstruction(instruction)).toEqual(result);
    },
  );
});
