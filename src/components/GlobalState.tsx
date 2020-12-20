import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Player } from '../types/Players';
import { storage } from '../utils/storage';
import { v4 as genUuid } from 'uuid';
import { pickRandomItem } from '../utils/pickRandomItem';

const STORAGE_PLAYERS_KEY = '@playerNames';

interface GlobalStateContext {
  players: Player[];
  playerAnswering?: Player;
  playerAsking?: Player;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  newTurn: () => void;
  goodAnswer: () => void;
  badAnswer: () => void;
}

const globalStateContext = createContext<GlobalStateContext>({
  players: [],
  addPlayer: () => {},
  removePlayer: () => {},
  newTurn: () => {},
  goodAnswer: () => {},
  badAnswer: () => {},
});

interface GlobalState {
  players: Player[];
  playerAnsweringId?: string;
  playerAskingId?: string;
}

const getNewPlayer = (name: string) => ({ id: genUuid(), name, score: 0 });

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    players: [],
  });

  const playerAnsweringIndex = globalState.players.findIndex(
    ({ id }) => globalState.playerAnsweringId === id,
  );
  const playerAnswering = globalState.players[playerAnsweringIndex];
  const playerAskingIndex = globalState.players.findIndex(
    ({ id }) => globalState.playerAskingId === id,
  );
  const playerAsking = globalState.players[playerAskingIndex];

  useEffect(() => {
    storage.get<string[]>(STORAGE_PLAYERS_KEY).then((playerNames) => {
      if (!playerNames) return;
      setGlobalState((prev) => ({
        ...prev,
        players: playerNames.map(getNewPlayer),
      }));
    });
  }, []);

  const addPlayer = (playerName: string) => {
    setGlobalState((prev) => ({
      ...prev,
      players: [...prev.players, getNewPlayer(playerName)],
    }));
    storage.set(
      STORAGE_PLAYERS_KEY,
      globalState.players.map(({ name }) => name),
    );
  };

  const removePlayer = (toRemoveId: string) => {
    const playerToRemoveIndex = globalState.players.findIndex(
      ({ id }) => id === toRemoveId,
    );
    if (playerToRemoveIndex < 0) return;
    const newPlayers = [...globalState.players];
    newPlayers.splice(playerToRemoveIndex, 1);
    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
  };

  const newTurn = () => {
    const playersNotAnswering = globalState.players.filter(
      ({ id }) => globalState.playerAnsweringId !== id,
    );
    const newPlayerAnswering = pickRandomItem(playersNotAnswering);
    const playersNotAsking = globalState.players.filter(
      ({ id }) => globalState.playerAskingId !== id,
    );
    const newPlayerAsking = pickRandomItem(playersNotAsking);
    setGlobalState((prev) => ({
      ...prev,
      playerAskingId: newPlayerAnswering?.id,
      playerAnsweringId: newPlayerAsking?.id,
    }));
  };

  const answer = (good: boolean) => {
    if (playerAnsweringIndex < 0) return;
    const newPlayers = [...globalState.players];
    const newScore = playerAnswering.score + (good ? 3 : -1);
    newPlayers[playerAnsweringIndex] = {
      ...playerAnswering,
      score: newScore < 0 ? 0 : newScore,
    };
    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
  };

  return (
    <globalStateContext.Provider
      value={{
        players: globalState.players,
        newTurn,
        playerAnswering,
        playerAsking,
        addPlayer,
        removePlayer,
        goodAnswer: () => answer(true),
        badAnswer: () => answer(false),
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
