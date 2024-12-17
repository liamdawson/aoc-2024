export function reportIsSafe(report: number[]) {
  // not covered by specification
  if (report.length < 2) {
    return undefined;
  }

  const ascending = report[0] < report[1];
  const [min, max] = ascending ? [1, 3] : [-3, -1];

  for (let i = 0; i < (report.length - 1); i++) {
    const diff = report[i + 1] - report[i];

    if (diff < min || diff > max) {
      return false;
    }
  }

  return true;
}

export function parseReports(inputLines: string[]) {
  return inputLines.map((line) =>
    line.split(" ").flatMap((value) => {
      const parsed = Number(value);
      if (!Number.isNaN(parsed)) {
        return [parsed];
      }

      return [];
    })
  );
}
