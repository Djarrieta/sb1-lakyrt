export const formatPercent = (input: number): string => {
  const percent = (input * 100).toFixed(2);
  return `${percent}%`;
};