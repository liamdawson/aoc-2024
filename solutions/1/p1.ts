import { linesFromInputFile } from "#shared";
import { getSortedColumns } from "./common.ts";

export default async function main(args: string[]) {
	const contentLines = await linesFromInputFile(args[0] ?? "input.txt");
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
	await main(process.argv.slice(2));
}
