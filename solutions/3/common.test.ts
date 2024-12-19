import { describe, expect, test } from "vitest";
import {
	type Instruction,
	InstructionMachine,
	type InstructionOperation,
	parseInstructions,
} from "./common.ts";

const instr = {
	mul(a: number, b: number) {
		return expect.objectContaining({
			op: "mul",
			args: [a, b],
		} satisfies Instruction);
	},
	do() {
		return expect.objectContaining({
			op: "do",
			args: [],
		} satisfies Instruction);
	},
	dont() {
		return expect.objectContaining({
			op: "don't",
			args: [],
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

	test.each<InstructionOperation>(["do", "don't"])("parses %s()", (op) => {
		expect(parseInstructions(`${op}()`)).toEqual([
			expect.objectContaining({ op, args: [] }),
		]);
	});

	test("ignores surrounding characters", () => {
		expect(parseInstructions("testmul(2,3),halt()")).toEqual([instr.mul(2, 3)]);
	});

	test("parses a 'nested' instruction", () => {
		expect(parseInstructions("mul(mul(17,4))")).toEqual([instr.mul(17, 4)]);
	});
});

describe(InstructionMachine.name, () => {
	describe("with default options", () => {
		const options = {};
		describe("calculates single instructions", () => {
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
				"$instruction.op($instruction.args) -> $result",
				({ instruction, result }) => {
					const machine = new InstructionMachine(options);
					machine.add(instruction);

					expect(machine.calculate()).toEqual(result);
				},
			);
		});
	});

	describe("with V2 instructions", () => {
		const options = { supportedOperations: InstructionMachine.V2_OPERATIONS };

		describe("calculates single instructions", () => {
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
				"$instruction.op($instruction.args) -> $result",
				({ instruction, result }) => {
					const machine = new InstructionMachine(options);
					machine.add(instruction);

					expect(machine.calculate()).toEqual(result);
				},
			);
		});

		describe("respects toggling with do/don't", () => {
			test.each<{ instructions: Instruction[]; result: number }>([
				{
					instructions: [
						{ op: "do", args: [] },
						{ op: "mul", args: [44, 46] },
					],
					result: 2024,
				},
				{
					instructions: [
						{ op: "don't", args: [] },
						{ op: "mul", args: [44, 46] },
					],
					result: 0,
				},
				{
					instructions: [
						{ op: "do", args: [] },
						{ op: "don't", args: [] },
						{ op: "mul", args: [44, 46] },
					],
					result: 0,
				},
				{
					instructions: [
						{ op: "don't", args: [] },
						{ op: "mul", args: [44, 46] },
						{ op: "do", args: [] },
						{ op: "mul", args: [123, 4] },
						{ op: "don't", args: [] },
					],
					result: 492,
				},
			])(
				"$instruction.op($instruction.args) -> $result",
				({ instructions, result }) => {
					const machine = new InstructionMachine(options);
					for (const instruction of instructions) {
						machine.add(instruction);
					}

					expect(machine.calculate()).toEqual(result);
				},
			);
		});
	});
});
