import { atom, useRecoilState } from 'recoil';
import { v4 as genUuid } from 'uuid';
import { storage, STORAGE_PLAYERS_KEY } from '../storage';

export interface Player {
  id: string;
  name: string;
  score: number;
  nbrAnswered: number;
}

export const playersAtom = atom<Player[]>({ key: 'players', default: [] });
export const playerAnsweringIdAtom = atom<string | undefined>({
  key: 'playerAnsweringId',
  default: undefined,
});
export const secondaryPlayerAnsweringIdAtom = atom<string | undefined>({
  key: 'secondaryPlayerAnsweringId',
  default: undefined,
});
export const playerAskingIdAtom = atom<string | undefined>({
  key: 'playerAskingId',
  default: undefined,
});

export const getNewPlayer = (name: string) => ({
  id: genUuid(),
  name,
  score: 0,
  nbrAnswered: 0,
});

export const useGlobalPlayers = () => {
  const [players, setPlayers] = useRecoilState(playersAtom);
  const [playerAnsweringId] = useRecoilState(playerAnsweringIdAtom);
  const [secondaryPlayerAnsweringId] = useRecoilState(
    secondaryPlayerAnsweringIdAtom,
  );
  const [playerAskingId] = useRecoilState(playerAskingIdAtom);

  const playerAnswering = players.find(({ id }) => playerAnsweringId === id);
  const secondaryPlayerAnswering = players.find(
    ({ id }) => secondaryPlayerAnsweringId === id,
  );
  const playerAsking = players.find(({ id }) => playerAskingId === id);

  const initPlayers = () => {
    storage.get<string[]>(STORAGE_PLAYERS_KEY).then((playerNames) => {
      if (!playerNames) return;
      setPlayers(playerNames.map(getNewPlayer));
    });
  };

  const addPlayer = (playerName: string) => {
    storage.set(STORAGE_PLAYERS_KEY, [
      ...players.map(({ name }) => name),
      playerName,
    ]);
    setPlayers((prev) => [...prev, getNewPlayer(playerName)]);
  };

  const removePlayer = (toRemoveId: string) => {
    const newPlayers = players.filter(({ id }) => id !== toRemoveId);
    storage.set(
      STORAGE_PLAYERS_KEY,
      newPlayers.map(({ name }) => name),
    );
    setPlayers(newPlayers);
  };

  const removeAllPlayers = () => {
    setPlayers([]);
    storage.remove(STORAGE_PLAYERS_KEY);
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
