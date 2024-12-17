import { linesFromInputFile } from "../../shared.ts";
import { parseReports, reportIsSafe } from "./common.ts";

export default async function main(args: typeof Deno.args) {
  const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
  const reports = parseReports(inputLines);

  console.log(
    `${
      reports.filter((report) => reportIsSafe(report, { dampener: true }))
        .length.toFixed(0)
    } of ${
      reports.length.toFixed(0)
    } reports are safe when the dampener is engaged.`,
  );
}

if (import.meta.main) {
  main(Deno.args);
}
