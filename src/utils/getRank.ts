import { Player } from './globalState/players';

export const getRank = (index: number, sortedPlayers: Player[]) => {
  if (sortedPlayers.every(({ score }) => !score)) return '-';

  const player = sortedPlayers[index];
  const prevIndex = sortedPlayers.findIndex(
    ({ score }) => score === player.score,
  );

  const rank = prevIndex !== -1 ? prevIndex : index;

  if (rank === 0) return '1er';
  return `${rank + 1}e`;
};
