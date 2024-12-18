import { linesFromInputFile } from "#shared";

export default async function main(args: string[]) {
  const _contentLines = await linesFromInputFile(args[0] ?? "input.txt");

  console.log("TODO");
}

// for running inside Zed
if (typeof Deno !== "undefined") {
  await main(Deno.args);
}
