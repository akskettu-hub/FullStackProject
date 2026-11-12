export const getSelectionState = <T>(
  options: readonly T[],
  selected: ReadonlySet<T>,
): { checked: boolean; indeterminate: boolean } => {
  const checked =
    options.length > 0 && options.every((opt) => selected.has(opt));
  const indeterminate = !checked && options.some((opt) => selected.has(opt));
  return { checked, indeterminate };
};
