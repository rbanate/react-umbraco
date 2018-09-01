export const cleanJson = source => {
  if (!source) return undefined;
  console.log(source);
  const cleaned = source.replace(/\\/g, '');

  return JSON.parse(cleaned);
};
