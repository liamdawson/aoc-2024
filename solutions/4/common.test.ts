import { describe, expect, test } from "vitest";
import { getMatches, gridify } from "./common.ts";

const basicGrid = `XMASSXX
MASXAXX
ASXMMMX
SXMAXMX`.split("\n");

describe(gridify.name, () => {
  test("basic grid", () => {
    expect(gridify(basicGrid)).toMatchSnapshot();
  });
});

describe(getMatches.name, () => {
  test("basic grid", () => {
    const result = getMatches("XMAS", gridify(basicGrid));
    expect(result.totalMatches).toEqual(4);
    expect(result).toMatchSnapshot();
  });
});
