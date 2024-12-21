import { describe, expect, test } from "vitest";
import { getMatches, gridify } from "./common.ts";

const basicGrid = `XMASS
MASXA
ASXMM
SXMAX`.split("\n");

describe(gridify.name, () => {
  test("basic grid", () => {
    expect(gridify(basicGrid)).toMatchSnapshot();
  });
});

describe(getMatches.name, () => {
  test("basic grid", () => {
    expect(getMatches("XMAS", gridify(basicGrid))).toEqual(3);
  });
});
