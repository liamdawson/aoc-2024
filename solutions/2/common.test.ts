import { describe, test, expect } from "vitest";
import { reportIsSafe } from "./common.ts";

const reportFromString = (rawReport: string) =>
  rawReport.split(" ").map((value) => Number(value));

describe(reportIsSafe.name, () => {
  describe("without the dampener", () => {
    const options = {};

    test.each([
      // given examples
      "7 6 4 2 1",
      "1 3 6 7 9",
      // extra tests
      "1 2",
      "2 1",
      "1 2 3 5 8",
    ])("%o is safe", (rawReport) => {
      expect(reportIsSafe(reportFromString(rawReport), options)).toBeTruthy();
    });

    test.each([
      // given examples
      "1 2 7 8 9",
      "9 7 6 2 1",
      "1 3 2 4 5",
      "8 6 4 4 1",
      // extra examples
      "1 1",
      "1 5",
      "2 1 2",
      "1 2 1",
    ])("%o is unsafe", (rawReport) => {
      expect(reportIsSafe(reportFromString(rawReport), options)).toBeFalsy();
    });
  });

  describe("with the dampener", () => {
    const options = {
      dampener: true,
    };

    test.each([
      // given examples
      "7 6 4 2 1",
      "1 3 6 7 9",
      "1 3 2 4 5",
      "8 6 4 4 1",
    ])("%o is safe", (rawReport) => {
      expect(reportIsSafe(reportFromString(rawReport), options)).toBeTruthy();
    });

    test.each([
      // given examples
      "1 2 7 8 9",
      "9 7 6 2 1",
    ])("%o is unsafe", (rawReport) => {
      expect(reportIsSafe(reportFromString(rawReport), options)).toBeFalsy();
    });
  });
});
