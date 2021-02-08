import { atom, useRecoilState } from 'recoil';
import { storage, STORAGE_VICTORY_KEY } from '../storage';

export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;
const DEFAULT_SCORE_VICTORY = 10;

export const scoreVictoryAtom = atom<number>({
  key: 'scoreVictory',
  default: DEFAULT_SCORE_VICTORY,
});

export const useGlobalScore = () => {
  const [scoreVictory, setScoreVictory] = useRecoilState(scoreVictoryAtom);

  const initScore = () => {
    storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVic) => {
      if (!scoreVic) return;
      setScoreVictory(scoreVic);
    });
  };

  const setScoreVic = (value: number) => {
    setScoreVictory(value);
    storage.set(STORAGE_VICTORY_KEY, value);
  };

  return { scoreVictory, setScoreVictory: setScoreVic, initScore };
};