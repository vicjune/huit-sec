import { Dispatch, SetStateAction } from 'react';
import { GlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_PLAYERS_KEY } from './storage';
import { v4 as genUuid } from 'uuid';
import { pickRandomItem } from './pickRandomItem';
import { Player } from '../types/Players';

const getNewPlayer = (name: string) => ({
  id: genUuid(),
  name,
  score: 0,
  nbrAnswered: 0,
});

export const addPlayer = (
  playerName: string,
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  storage.set(STORAGE_PLAYERS_KEY, [
    ...globalState.players.map(({ name }) => name),
    playerName,
  ]);
  setGlobalState((prev) => ({
    ...prev,
    players: [...prev.players, getNewPlayer(playerName)],
  }));
};

export const removePlayer = (
  toRemoveId: string,
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  const playerToRemoveIndex = globalState.players.findIndex(
    ({ id }) => id === toRemoveId,
  );
  if (playerToRemoveIndex < 0) return;
  const newPlayers = [...globalState.players];
  newPlayers.splice(playerToRemoveIndex, 1);
  storage.set(
    STORAGE_PLAYERS_KEY,
    newPlayers.map(({ name }) => name),
  );
  setGlobalState((prev) => ({ ...prev, players: newPlayers }));
};

export const removeAllPlayers = (
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  setGlobalState((prev) => ({ ...prev, players: [] }));
  storage.remove(STORAGE_PLAYERS_KEY);
};

export const newTurn = (
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  const newPlayerAnsweringPool = globalState.players
    .filter(({ id }) => globalState.playerAnsweringId !== id)
    .reduce((prev, player) => {
      if (!prev[0] || prev[0].nbrAnswered > player.nbrAnswered) {
        return [player];
      }
      if (prev[0].nbrAnswered < player.nbrAnswered) return prev;
      return [...prev, player];
    }, [] as Player[]);
  const newPlayerAnswering = pickRandomItem(newPlayerAnsweringPool);

  const newPlayerAskingPool = globalState.players.filter(
    ({ id }) =>
      ![globalState.playerAskingId, newPlayerAnswering?.id].includes(id),
  );
  const newPlayerAsking = pickRandomItem(newPlayerAskingPool);

  setGlobalState((prev) => ({
    ...prev,
    playerAskingId: newPlayerAsking?.id,
    playerAnsweringId: newPlayerAnswering?.id,
  }));
};
