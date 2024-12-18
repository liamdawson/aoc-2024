import { describe, test, expect } from "vitest";
import { todo } from "./common.ts";

describe(todo.name, () => {
  test("is todo", () => {
    expect(todo()).toBeTruthy();
  });
});
