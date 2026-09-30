export function calculateScrollProgress(
  scrollY: number,
  documentHeight: number,
  viewportHeight: number,
) {
  const scrollableHeight = Math.max(0, documentHeight - viewportHeight);
  if (scrollableHeight === 0) return 0;

  return Math.min(Math.max(scrollY / scrollableHeight, 0), 1);
}
