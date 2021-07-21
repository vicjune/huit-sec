import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_VICTORY_KEY } from './storage';

export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;
const DEFAULT_SCORE_VICTORY = 10;

export const useScore = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { scoreVictory } = globalState;

  useEffect(() => {
    if (scoreVictory === undefined) {
      storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVic) => {
        setGlobalState((prev) => ({
          ...prev,
          scoreVictory: scoreVic || DEFAULT_SCORE_VICTORY,
        }));
      });
    }
  }, [scoreVictory, setGlobalState]);

  const setScoreVictory = useCallback(
    (value: number) => {
      setGlobalState((prev) => ({
        ...prev,
        scoreVictory: value,
      }));
      storage.set(STORAGE_VICTORY_KEY, value);
    },
    [setGlobalState],
  );

  return {
    scoreVictory: scoreVictory || DEFAULT_SCORE_VICTORY,
    setScoreVictory,
  };
};
