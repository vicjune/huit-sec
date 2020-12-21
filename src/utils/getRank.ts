export const getRank = (index: number) => {
  switch (index) {
    case 0:
      return '1er';

    default:
      return `${index + 1}e`;
  }
};
