import { assert, assertFalse } from "@std/assert";
import { reportIsSafe } from "./common.ts";

Deno.test(function reportIsSafeExamplesTest() {
  const safeExamples = `7 6 4 2 1
1 3 6 7 9`.split("\n").map((line) => line.split(" ").map((v) => Number(v)));

  const unsafeExamples = `1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1`.split("\n").map((line) => line.split(" ").map((v) => Number(v)));

  for (const safeExample of safeExamples) {
    assert(reportIsSafe(safeExample), `${safeExample.join(" ")} is safe`);
  }

  for (const unsafeExample of unsafeExamples) {
    assertFalse(
      reportIsSafe(unsafeExample),
      `${unsafeExample.join(" ")} is unsafe`,
    );
  }
});

Deno.test(function reportIsSafeDampenerExamplesTest() {
  const safeExamples = `7 6 4 2 1
1 3 6 7 9
1 3 2 4 5
8 6 4 4 1`.split("\n").map((line) => line.split(" ").map((v) => Number(v)));

  const unsafeExamples = `1 2 7 8 9
9 7 6 2 1`.split("\n").map((line) => line.split(" ").map((v) => Number(v)));

  for (const safeExample of safeExamples) {
    assert(
      reportIsSafe(safeExample, { dampener: true }),
      `${safeExample.join(" ")} is safe`,
    );
  }

  for (const unsafeExample of unsafeExamples) {
    assertFalse(
      reportIsSafe(unsafeExample, { dampener: true }),
      `${unsafeExample.join(" ")} is unsafe`,
    );
  }
});

Deno.test(function reportIsSafeTest() {
  assert(reportIsSafe([1, 2]));
  assert(reportIsSafe([2, 1]));
  assert(reportIsSafe([1, 2, 3, 5, 8]));

  assertFalse(reportIsSafe([1, 1]));
  assertFalse(reportIsSafe([1, 5]));
  assertFalse(reportIsSafe([2, 1, 2]));
  assertFalse(reportIsSafe([1, 2, 1]));
});
