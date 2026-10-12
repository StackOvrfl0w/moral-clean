export class PageOutOfRangeError extends RangeError {}

export function parsePage(value?: string | number, perPage = 24): number | null {
  if (value === undefined) return 1;
  if (typeof value === "string" && !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 &&
    page * perPage - 1 <= 2_147_483_647 ? page : null;
}

export function validatePage(page: number, totalCount: number, perPage: number) {
  if (parsePage(page, perPage) === null || page > Math.max(1, Math.ceil(totalCount / perPage))) {
    throw new PageOutOfRangeError("Page exceeds available results");
  }
}

export function getPaginationItems(currentPage: number, pageCount: number) {
  const pages = new Set<number>([1, pageCount]);

  for (
    let page = Math.max(1, currentPage - 2);
    page <= Math.min(pageCount, currentPage + 2);
    page += 1
  ) {
    pages.add(page);
  }

  const ordered = Array.from(pages).sort((a, b) => a - b);
  const items: Array<number | string> = [];

  ordered.forEach((page, index) => {
    const previous = ordered[index - 1];
    if (previous && page - previous > 1) {
      items.push(`ellipsis-${previous}-${page}`);
    }
    items.push(page);
  });

  return items;
}
