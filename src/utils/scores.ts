import { Dispatch, SetStateAction } from 'react';
import { GlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_VICTORY_KEY } from './storage';

export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;

export const answer = (
  good: boolean,
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  const playerAnsweringIndex = globalState.players.findIndex(
    ({ id }) => globalState.playerAnsweringId === id,
  );
  if (playerAnsweringIndex < 0) return false;
  const playerAnswering = globalState.players[playerAnsweringIndex];
  const newPlayers = [...globalState.players];
  const newScore =
    playerAnswering.score + (good ? VALID_POINTS : INVALID_POINTS);
  newPlayers[playerAnsweringIndex] = {
    ...playerAnswering,
    score: newScore < 0 ? 0 : newScore,
    nbrAnswered: playerAnswering.nbrAnswered + 1,
  };
  setGlobalState((prev) => ({ ...prev, players: newPlayers }));
  return newScore >= globalState.scoreVictory;
};

export const resetGame = (
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  setGlobalState((prev) => ({
    ...prev,
    players: prev.players.map((player) => ({ ...player, score: 0 })),
    currentQuestion: undefined,
    currentEvent: undefined,
  }));
};

export const setScoreVictory = (
  scoreVictory: number,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  setGlobalState((prev) => ({ ...prev, scoreVictory }));
  storage.set(STORAGE_VICTORY_KEY, scoreVictory);
};
