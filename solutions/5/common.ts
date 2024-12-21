export interface PageOrderRequirement {
  pageNumber: number;
  mustPrecede: number;
}

export type PageUpdateList = number[];

const pageOrderRequirementRegex = /^\s*(\d+)[|](\d+)\s*$/g;
export function parsePageOrderRequirement(
  line: string,
): PageOrderRequirement | null {
  const parseResult = pageOrderRequirementRegex.exec(line);
  if (!parseResult) {
    return null;
  }

  const [raw, rawPageNumber, rawMustPrecede] = parseResult;
  const [pageNumber, mustPrecede] = [
    Number(rawPageNumber),
    Number(rawMustPrecede),
  ];

  if (Number.isNaN(pageNumber) || Number.isNaN(mustPrecede)) {
    throw new Error(`Failed to parse "${raw}" as a page order requirement`);
  }

  return { pageNumber, mustPrecede };
}

export function parsePageUpdateList(line: string): PageUpdateList {
  const pageNumbers = line.split(",").map((pageNumber) => Number(pageNumber));

  if (pageNumbers.some((number) => Number.isNaN(number))) {
    throw new Error(`Failed to parse page update list ${line}`);
  }

  return pageNumbers;
}

export function parseInput(lines: string[]) {
  const pageOrderRequirements = [];
  const pageUpdateLists = [];
  let requirementsSection = true;

  while (true) {
    if (lines.length === 0) {
      break;
    }

    const line = lines.shift();

    if (line?.trim() === "") {
      requirementsSection = false;
      continue;
    }

    if (line === undefined) {
      continue;
    }

    if (requirementsSection) {
      pageOrderRequirements.push(parsePageOrderRequirement(line));
    } else {
      pageUpdateLists.push(parsePageUpdateList(line));
    }
  }

  return {
    pageOrderRequirements: pageOrderRequirements.filter(
      Boolean,
    ) as PageOrderRequirement[],
    pageUpdateLists,
  };
}

export const makeVerifier = (pageOrderRequirements: PageOrderRequirement[]) => {
  const mustPrecedes = Map.groupBy(
    pageOrderRequirements,
    (req) => req.pageNumber,
  );

  return (pageUpdateList: PageUpdateList) => {
    const seen = new Set();

    for (const pageNumber of pageUpdateList) {
      const disallowed =
        mustPrecedes.get(pageNumber)?.map(({ mustPrecede }) => mustPrecede) ??
        [];

      if (
        disallowed.some((restrictedPageNumber) =>
          seen.has(restrictedPageNumber),
        )
      ) {
        return {
          valid: false,
          pageUpdateList,
        } as const;
      }

      seen.add(pageNumber);
    }

    return {
      valid: true,
      pageUpdateList,
      middleNumber: pageUpdateList[Math.floor(pageUpdateList.length / 2)],
    } as const;
  };
};
