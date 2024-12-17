const contentLines = (await Deno.readTextFile(Deno.args[0] ?? "input.txt"))
  .split(
    /\r?\n/,
  );

const lists: [number[], number[]] = [[], []] as const;

const extractorRegex = /^\s*(\d+)\s+(\d+)\s*$/;
for (const line of contentLines) {
  const extracted = extractorRegex.exec(line);
  if (!extracted) {
    continue;
  }
  const [_line, ...values] = extracted;

  for (const [i, list] of lists.entries()) {
    list.push(Number(values[i]));
  }
}

for (const list of lists) {
  list.sort((a, b) => a - b);
}

let totalDistance = 0;
const firstList = lists[0];
const secondList = lists[1];
for (let i = 0; i < firstList.length; i++) {
  totalDistance += Math.abs(secondList[i] - firstList[i]);
}

console.log(
  `Total distance between ${firstList.length} pairs: ${totalDistance}`,
);
