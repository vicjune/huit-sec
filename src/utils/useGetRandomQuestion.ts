import questions from '../json/questions.json';
import { Question } from '../types/Question';
import { pickRandomItem } from './pickRandomItem';

export const useGetRandomQuestion = () => {
  // TODO local storage des questions faites
  // TODO bundles
  return () => pickRandomItem(questions) as Question;
};
