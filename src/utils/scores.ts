import { Dispatch, SetStateAction } from 'react';
import { GlobalState } from '../contexts/GlobalState';
import { Player } from '../types/Players';
import { SpecialEventId } from './specialEvents';
import { storage, STORAGE_VICTORY_KEY } from './storage';

export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;

const getUpdatedPlayer = (
  player: Player,
  winnerId: string | null,
  globalState: GlobalState,
) => {
  switch (globalState.currentEvent?.id) {
    case SpecialEventId.DUEL: {
      if (
        ![
          globalState.playerAnsweringId,
          globalState.secondaryPlayerAnsweringId,
        ].includes(player.id)
      ) {
        return player;
      }

      return {
        ...player,
        nbrAnswered: player.nbrAnswered + 1,
        score: player.score + (player.id === winnerId ? VALID_POINTS : 0),
      };
    }

    case SpecialEventId.EVERYONE: {
      if (player.id === globalState.playerAskingId) {
        return player;
      }

      return {
        ...player,
        nbrAnswered: player.nbrAnswered + 1,
        score: player.score + (player.id === winnerId ? VALID_POINTS : 0),
      };
    }

    default:
      if (player.id !== globalState.playerAnsweringId) {
        return player;
      }

      return {
        ...player,
        nbrAnswered: player.nbrAnswered + 1,
        score:
          player.score +
          (player.id === winnerId ? VALID_POINTS : INVALID_POINTS),
      };
  }
};

export const answer = (
  winnerId: string | null,
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  const players = globalState.players.map((player) =>
    getUpdatedPlayer(player, winnerId, globalState),
  );

  setGlobalState((prev) => ({ ...prev, players }));
  return !!players.find(({ score }) => score >= globalState.scoreVictory);
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
