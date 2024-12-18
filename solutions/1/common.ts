const extractorRegex = /^\s*(\d+)\s+(\d+)\s*$/;
export function getSortedColumns(contentLines: string[]): [number[], number[]] {
  const lists: [number[], number[]] = [[], []];
  const addValues = (values: string[]) => {
    lists[0].push(Number(values[0]));
    lists[1].push(Number(values[1]));
  };

  for (const line of contentLines) {
    const extracted = extractorRegex.exec(line);
    if (!extracted) {
      continue;
    }
    const [_line, ...values] = extracted;

    addValues(values);
  }

  for (const list of lists) {
    list.sort((a, b) => a - b);
  }

  return lists;
}
