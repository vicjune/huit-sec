import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../contexts/GlobalState';
import {
  storage,
  STORAGE_MUTED,
  STORAGE_TIMER_KEY,
  STORAGE_VICTORY_KEY,
} from './storage';

const DEFAULT_SCORE_VICTORY = 10;
const DEFAULT_TIMER_VALUE = 8000; // 8s

export const useSettings = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { scoreVictory, timerValue, muted } = globalState;

  useEffect(() => {
    if (timerValue === undefined) {
      storage.get<number>(STORAGE_TIMER_KEY).then((timer) => {
        setGlobalState((prev) => ({
          ...prev,
          timerValue: timer || DEFAULT_TIMER_VALUE,
        }));
      });
    }

    if (scoreVictory === undefined) {
      storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVic) => {
        setGlobalState((prev) => ({
          ...prev,
          scoreVictory: scoreVic || DEFAULT_SCORE_VICTORY,
        }));
      });
    }

    if (muted === undefined) {
      storage.get<boolean>(STORAGE_MUTED).then((storedMuted) => {
        setGlobalState((prev) => ({
          ...prev,
          muted: storedMuted || false,
        }));
      });
    }
  }, [timerValue, scoreVictory, muted, setGlobalState]);

  const setTimerValue = useCallback(
    (value: number) => {
      setGlobalState((prev) => ({
        ...prev,
        timerValue: value,
      }));
      storage.set(STORAGE_TIMER_KEY, value);
    },
    [setGlobalState],
  );

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

  const setMuted = useCallback(
    (value: boolean) => {
      setGlobalState((prev) => ({
        ...prev,
        muted: value,
      }));
      storage.set(STORAGE_MUTED, value);
    },
    [setGlobalState],
  );

  return {
    scoreVictory: scoreVictory || DEFAULT_SCORE_VICTORY,
    setScoreVictory,
    timerValue: timerValue || DEFAULT_TIMER_VALUE,
    setTimerValue,
    muted,
    setMuted,
  };
};
