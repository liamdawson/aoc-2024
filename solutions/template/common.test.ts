import { describe, expect, test } from "vitest";
import { todo } from "./common.ts";

describe(todo.name, () => {
	test("is todo", () => {
		expect(todo()).toBeTruthy();
	});
});
