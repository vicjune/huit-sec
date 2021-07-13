import { useCallback, useEffect } from 'react';
import { useGlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_TIMER_KEY } from './storage';

const DEFAULT_TIMER_VALUE = 8000; // 8s

export const useTimer = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { timerValue } = globalState;

  useEffect(() => {
    if (timerValue === undefined) {
      storage.get<number>(STORAGE_TIMER_KEY).then((timer) => {
        setGlobalState((prev) => ({
          ...prev,
          timerValue: timer || DEFAULT_TIMER_VALUE,
        }));
      });
    }
  }, [timerValue, setGlobalState]);

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

  return { timerValue: timerValue || DEFAULT_TIMER_VALUE, setTimerValue };
};
