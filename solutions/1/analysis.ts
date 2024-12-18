import { linesFromInputFile } from "#shared";
import { getSortedColumns } from "./common.ts";

export default async function main(args: string[]) {
  const contentLines = await linesFromInputFile(args[0] ?? "input.txt");
  const [firstColumn, _secondColumn] = getSortedColumns(contentLines);

  console.log({
    firstColumnDuplicates: firstColumn.length - new Set(firstColumn).size,
  });
}

// for running inside Zed
if (typeof Deno !== "undefined") {
  await main(Deno.args);
}
