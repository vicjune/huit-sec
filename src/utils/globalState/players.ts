import { v4 as genUuid } from 'uuid';
import { useGlobalState } from '../../contexts/GlobalState';
import { storage, STORAGE_PLAYERS_KEY } from '../storage';

export interface Player {
  id: string;
  name: string;
  score: number;
  nbrAnswered: number;
}

export const getNewPlayer = (name: string) => ({
  id: genUuid(),
  name,
  score: 0,
  nbrAnswered: 0,
});

export const useGlobalPlayers = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const {
    players,
    playerAnsweringId,
    secondaryPlayerAnsweringId,
    playerAskingId,
  } = globalState;

  const playerAnswering = players.find(({ id }) => playerAnsweringId === id);
  const secondaryPlayerAnswering = players.find(
    ({ id }) => secondaryPlayerAnsweringId === id,
  );
  const playerAsking = players.find(({ id }) => playerAskingId === id);

  const initPlayers = () => {
    storage.get<string[]>(STORAGE_PLAYERS_KEY).then((playerNames) => {
      if (!playerNames) return;
      setGlobalState((prev) => ({
        ...prev,
        players: playerNames.map(getNewPlayer),
      }));
    });
  };

  const addPlayer = (playerName: string) => {
    storage.set(STORAGE_PLAYERS_KEY, [
      ...players.map(({ name }) => name),
      playerName,
    ]);
    setGlobalState((prev) => ({
      ...prev,
      players: [...prev.players, getNewPlayer(playerName)],
    }));
  };

  const removePlayer = (toRemoveId: string) => {
    const newPlayers = players.filter(({ id }) => id !== toRemoveId);
    storage.set(
      STORAGE_PLAYERS_KEY,
      newPlayers.map(({ name }) => name),
    );
    setGlobalState((prev) => ({
      ...prev,
      players: newPlayers,
    }));
  };

  const removeAllPlayers = () => {
    storage.remove(STORAGE_PLAYERS_KEY);
    setGlobalState((prev) => ({
      ...prev,
      players: [],
    }));
  };

  return {
    players,
    playerAnswering,
    secondaryPlayerAnswering,
    playerAsking,
    addPlayer,
    removePlayer,
    removeAllPlayers,
    initPlayers,
  };
};
