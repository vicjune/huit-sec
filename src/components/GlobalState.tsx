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
const STORAGE_VICTORY_KEY = '@victoryScore';
export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;
const DEFAULT_SCORE_VICTORY = 10;

interface GlobalStateContext {
  players: Player[];
  playerAnswering?: Player;
  playerAsking?: Player;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  removeAllPlayers: () => void;
  resetScores: () => void;
  newTurn: () => void;
  goodAnswer: () => boolean;
  badAnswer: () => boolean;
  scoreVictory: number;
  setScoreVictory: (scoreVictory: number) => void;
}

const globalStateContext = createContext<GlobalStateContext>({
  players: [],
  addPlayer: () => {},
  removePlayer: () => {},
  removeAllPlayers: () => {},
  resetScores: () => {},
  newTurn: () => {},
  goodAnswer: () => false,
  badAnswer: () => false,
  scoreVictory: 0,
  setScoreVictory: () => {},
});

interface GlobalState {
  players: Player[];
  playerAnsweringId?: string;
  playerAskingId?: string;
  scoreVictory: number;
}

const getNewPlayer = (name: string) => ({ id: genUuid(), name, score: 0 });

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    players: [],
    scoreVictory: DEFAULT_SCORE_VICTORY,
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
    storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVictory) => {
      if (!scoreVictory) return;
      setGlobalState((prev) => ({ ...prev, scoreVictory }));
    });
  }, []);

  const addPlayer = (playerName: string) => {
    storage.set(STORAGE_PLAYERS_KEY, [
      ...globalState.players.map(({ name }) => name),
      playerName,
    ]);
    setGlobalState((prev) => ({
      ...prev,
      players: [...prev.players, getNewPlayer(playerName)],
    }));
  };

  const removePlayer = (toRemoveId: string) => {
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

  const removeAllPlayers = () => {
    setGlobalState((prev) => ({ ...prev, players: [] }));
    storage.remove(STORAGE_PLAYERS_KEY);
  };

  const newTurn = () => {
    const playersNotAsking = globalState.players.filter(
      ({ id }) => globalState.playerAskingId !== id,
    );
    const newPlayerAsking = pickRandomItem(playersNotAsking);
    const newPlayersAnswering = globalState.players.filter(
      ({ id }) =>
        ![globalState.playerAnsweringId, newPlayerAsking?.id].includes(id),
    );
    const newPlayerAnswering = pickRandomItem(newPlayersAnswering);
    setGlobalState((prev) => ({
      ...prev,
      playerAskingId: newPlayerAsking?.id,
      playerAnsweringId: newPlayerAnswering?.id,
    }));
  };

  const answer = (good: boolean) => {
    if (playerAnsweringIndex < 0) return false;
    const newPlayers = [...globalState.players];
    const newScore =
      playerAnswering.score + (good ? VALID_POINTS : INVALID_POINTS);
    newPlayers[playerAnsweringIndex] = {
      ...playerAnswering,
      score: newScore < 0 ? 0 : newScore,
    };
    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
    return newScore >= globalState.scoreVictory;
  };

  const resetScores = () => {
    setGlobalState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({ ...player, score: 0 })),
    }));
  };

  const setScoreVictory = (scoreVictory: number) => {
    setGlobalState((prev) => ({ ...prev, scoreVictory }));
    storage.set(STORAGE_VICTORY_KEY, scoreVictory);
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
        removeAllPlayers,
        resetScores,
        goodAnswer: () => answer(true),
        badAnswer: () => answer(false),
        scoreVictory: globalState.scoreVictory,
        setScoreVictory,
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
