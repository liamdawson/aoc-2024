import { getSortedColumns, readInputFile } from "./common.ts";

export default async function main(args: typeof Deno.args) {
  const contentLines = await readInputFile(args[0] ?? "input.txt");
  const [firstColumn, secondColumn] = getSortedColumns(contentLines);

  let totalDistance = 0;
  for (let i = 0; i < firstColumn.length; i++) {
    totalDistance += Math.abs(secondColumn[i] - firstColumn[i]);
  }

  console.log(
    `Total distance between ${firstColumn.length} pairs: ${totalDistance}`,
  );
}

if (import.meta.main) {
  main(Deno.args);
}
