import { useCallback } from 'react';
import { useGlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_TIMER_KEY } from './storage';

const DEFAULT_TIMER_VALUE = 8000; // 8s

export const useTimer = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { timerValue } = globalState;

  const initTimer = useCallback(() => {
    storage.get<number>(STORAGE_TIMER_KEY).then((timer) => {
      setGlobalState((prev) => ({
        ...prev,
        timerValue: timer || DEFAULT_TIMER_VALUE,
      }));
    });
  }, [setGlobalState]);

  const setTimer = useCallback(
    (value: number) => {
      setGlobalState((prev) => ({
        ...prev,
        timerValue: value,
      }));
      storage.set(STORAGE_TIMER_KEY, value);
    },
    [setGlobalState],
  );

  return { timerValue, setTimerValue: setTimer, initTimer };
};
