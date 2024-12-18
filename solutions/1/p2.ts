import { linesFromInputFile } from "#shared";
import { getSortedColumns } from "./common.ts";

const singleSimilarityScore = (id: number, count: number) => id * count;

export default async function main(args: string[]) {
  const contentLines = await linesFromInputFile(args[0] ?? "input.txt");
  const [firstColumn, secondColumn] = getSortedColumns(contentLines);

  const idScores = new Map<number, number>();

  let lastId = secondColumn[0];
  let idCount = 0;
  for (const id of secondColumn) {
    if (lastId === id) {
      idCount += 1;
      continue;
    }

    idScores.set(lastId, idCount);
    lastId = id;
    idCount = 1;
  }

  idScores.set(lastId, idCount);

  let similarityScore = 0;
  for (const id of firstColumn) {
    similarityScore += singleSimilarityScore(id, idScores.get(id) ?? 0);
  }

  console.log(`Similarity score: ${similarityScore}`);
}

if (import.meta.main) {
  await main(process.argv.slice(2));
}
