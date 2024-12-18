import { describe, test, expect } from "vitest";
import { stringToLines } from "#shared";

describe(stringToLines.name, () => {
  const subject = stringToLines;

  test("it keeps one line unchanged", () => {
    expect(subject("one line")).toEqual(["one line"]);
  });

  test("it splits two lines", () => {
    expect(
      subject(`line one
line two`),
    ).toEqual(["line one", "line two"]);
  });

  test("it keeps empty lines at the start and middle", () => {
    expect(
      subject(`
line one
line two

line three`),
    ).toEqual(["", "line one", "line two", "", "line three"]);
  });

  test("it trims trailing empty lines by default", () => {
    expect(
      subject(`line one
line two
`),
    ).toEqual(["line one", "line two"]);
  });

  test("it completely trims a string of empty lines", () => {
    expect(
      subject(`

`),
    ).toEqual([]);
  });

  test("it can keep trailing empty lines", () => {
    expect(
      subject(
        `line one
line two
`,
        { keepTrailingEmptyLines: true },
      ),
    ).toEqual(["line one", "line two", ""]);
  });
});
