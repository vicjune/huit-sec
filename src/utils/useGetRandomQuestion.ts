import questions from '../json/questions.json';
import { Question } from '../types/Question';

export const useGetRandomQuestion = () => {
  // TODO local storage des questions faites
  // TODO bundles
  return () =>
    questions[Math.floor(Math.random() * questions.length)] as Question;
};
