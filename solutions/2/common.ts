export function arrayWithoutItemAt<T>(array: T[], index: number): T[] {
  return array.slice(0, index).concat(array.slice(index + 1));
}

export function reportIsSafe(
  report: number[],
  options: { dampener?: boolean } = {},
): boolean | undefined {
  // not covered by specification
  if (report.length < 2) {
    return undefined;
  }

  const ascending = report[0] < report[1];
  const [min, max] = ascending ? [1, 3] : [-3, -1];

  for (let i = 0; i < report.length - 1; i++) {
    const a = report[i];
    const b = report[i + 1];
    const diff = b - a;

    if (diff < min || diff > max) {
      if (options?.dampener) {
        // try removing all of the levels up to the last one we're comparing - removing later levels won't help
        for (let j = 0; j < Math.min(report.length, i + 2); j++) {
          if (reportIsSafe(arrayWithoutItemAt(report, j))) {
            return true;
          }
        }
      }

      return false;
    }
  }

  return true;
}

export function parseReports(inputLines: string[]) {
  return inputLines.flatMap((line) => {
    const report = line
      .split(" ")
      .filter((v) => v.trim())
      .map((value) => Number(value))
      .filter((n) => !Number.isNaN(n));

    if (report.length > 0) {
      return [report];
    }

    return [];
  });
}
