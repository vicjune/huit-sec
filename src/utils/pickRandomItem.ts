export const pickRandomItem = <T>(array: T[]) => {
  if (!array.length) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};
