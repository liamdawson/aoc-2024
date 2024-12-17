import { getSortedColumns, readInputFile } from "./common.ts";

const contentLines = await readInputFile(Deno.args[0] ?? "input.txt");
const [firstColumn, secondColumn] = getSortedColumns(contentLines);

let totalDistance = 0;
for (let i = 0; i < firstColumn.length; i++) {
  totalDistance += Math.abs(secondColumn[i] - firstColumn[i]);
}

console.log(
  `Total distance between ${firstColumn.length} pairs: ${totalDistance}`,
);
