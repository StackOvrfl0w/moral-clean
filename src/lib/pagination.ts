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
