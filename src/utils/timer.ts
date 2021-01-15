import { Dispatch, SetStateAction } from 'react';
import { GlobalState } from '../contexts/GlobalState';
import { storage, STORAGE_TIMER_KEY } from './storage';

export const setTimerValue = (
  timerValue: number,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  setGlobalState((prev) => ({ ...prev, timerValue }));
  storage.set(STORAGE_TIMER_KEY, timerValue);
};
