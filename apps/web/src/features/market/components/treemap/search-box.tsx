/**
 * Treemap search utilities.
 * The SearchBox component has been replaced by L1 SearchInput.
 */

/**
 * Filter items by search query (case-insensitive)
 */
export function filterBySearch<T extends { name: string }>(
  items: T[],
  query: string,
): T[] {
  if (!query.trim()) {
    return items;
  }

  const normalizedQuery = query.trim().toLowerCase();
  return items.filter((item) =>
    item.name.toLowerCase().includes(normalizedQuery),
  );
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  );
  return text.replace(regex, '<mark>$1</mark>');
}
