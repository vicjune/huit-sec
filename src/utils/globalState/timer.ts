import { atom, useRecoilState } from 'recoil';
import { storage, STORAGE_TIMER_KEY } from '../storage';

const timerValueAtom = atom<number>({
  key: 'timerValue',
  default: 0,
});

export const useGlobalTimer = () => {
  const [timerValue, setTimerValue] = useRecoilState(timerValueAtom);

  const initTimer = () => {
    storage.get<number>(STORAGE_TIMER_KEY).then((timer) => {
      if (!timer) return;
      setTimerValue(timer);
    });
  };

  const setTimer = (value: number) => {
    setTimerValue(value);
    storage.set(STORAGE_TIMER_KEY, value);
  };

  return { timerValue, setTimerValue: setTimer, initTimer };
};
