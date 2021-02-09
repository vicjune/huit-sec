import { useGlobalState } from '../../contexts/GlobalState';
import { storage, STORAGE_VICTORY_KEY } from '../storage';

export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;
export const DEFAULT_SCORE_VICTORY = 10;

export const useGlobalScore = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { scoreVictory } = globalState;

  const initScore = () => {
    storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVic) => {
      setGlobalState((prev) => ({
        ...prev,
        scoreVictory: scoreVic || DEFAULT_SCORE_VICTORY,
      }));
    });
  };

  const setScoreVic = (value: number) => {
    setGlobalState((prev) => ({
      ...prev,
      scoreVictory: value,
    }));
    storage.set(STORAGE_VICTORY_KEY, value);
  };

  return { scoreVictory, setScoreVictory: setScoreVic, initScore };
};
