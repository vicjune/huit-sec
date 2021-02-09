import { useGlobalState } from '../../contexts/GlobalState';
import { storage, STORAGE_TIMER_KEY } from '../storage';

export const DEFAULT_TIMER_VALUE = 8000; // 8s

export const useGlobalTimer = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { timerValue } = globalState;

  const initTimer = () => {
    storage.get<number>(STORAGE_TIMER_KEY).then((timer) => {
      if (!timer) return;
      setGlobalState((prev) => ({
        ...prev,
        timerValue: timer || DEFAULT_TIMER_VALUE,
      }));
    });
  };

  const setTimer = (value: number) => {
    setGlobalState((prev) => ({
      ...prev,
      timerValue: value,
    }));
    storage.set(STORAGE_TIMER_KEY, value);
  };

  return { timerValue, setTimerValue: setTimer, initTimer };
};
