import { linesFromInputFile } from "../../shared.ts";
import { parseReports, reportIsSafe } from "./common.ts";

export default async function main(args: string[]) {
	const inputLines = await linesFromInputFile(args[0] ?? "input.txt");
	const reports = parseReports(inputLines);

	console.log(
		`${reports.filter((report) => reportIsSafe(report)).length.toFixed(0)} of ${reports.length.toFixed(
			0,
		)} reports are safe.`,
	);
}

if (import.meta.main) {
	await main(process.argv.slice(2));
}
