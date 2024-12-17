import { getSortedColumns, readInputFile } from "./common.ts";

export default async function main(args: typeof Deno.args) {
  const contentLines = await readInputFile(args[0] ?? "input.txt");
  const [firstColumn, secondColumn] = getSortedColumns(contentLines);
}

if (import.meta.main) {
  main(Deno.args);
}
