import { readFile } from "node:fs/promises";
export type LinesFromInputFileOptions = StringToLinesOptions;

export async function linesFromInputFile(
  path: string,
  options: LinesFromInputFileOptions = {},
): Promise<string[]> {
  const content = await readFile(path, { encoding: "utf-8" });
  return stringToLines(content, options);
}

export interface StringToLinesOptions {
  keepTrailingEmptyLines?: boolean | undefined;
}

export function stringToLines(
  input: string,
  options: StringToLinesOptions = {},
) {
  const lines = input.split(/\r?\n/);

  if (!options.keepTrailingEmptyLines) {
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() !== "") {
        break;
      }

      lines.splice(i, 1);
    }
  }

  return lines;
}
