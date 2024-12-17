import { getSortedColumns, readInputFile } from "./common.ts";

export default async function main(args: typeof Deno.args) {
  const contentLines = await readInputFile(args[0] ?? "input.txt");
  const [firstColumn, _secondColumn] = getSortedColumns(contentLines);

  console.log({
    firstColumnDuplicates: firstColumn.length - (new Set(firstColumn)).size,
  });
}

await main(Deno.args);
