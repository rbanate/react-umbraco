export const cleanJson = source => {
  if (!source) return undefined;
  const cleaned = source.replace(/\\/g, '');

  return JSON.parse(cleaned);
};
