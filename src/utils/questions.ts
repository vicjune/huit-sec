import { Dispatch, SetStateAction } from 'react';
import { GlobalState } from '../contexts/GlobalState';
import { pickRandomItem } from './pickRandomItem';
import { storage, STORAGE_QUESTIONS_SEEN_KEY } from './storage';
import { default as questionsJSON } from '../json/questions.json';
import { Question } from '../types/Question';

export const loadQuestions = (
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  // TODO: Bundles
  setGlobalState((prev) => ({
    ...prev,
    questions: questionsJSON as Question[],
  }));
};

export const newQuestion = (
  globalState: GlobalState,
  setGlobalState: Dispatch<SetStateAction<GlobalState>>,
) => {
  const questionsNotSeen = globalState.questions.filter(
    ({ id }) => !globalState.questionAlreadySeenIds.includes(id),
  );

  const newCurrentQuestion = pickRandomItem(
    questionsNotSeen.length ? questionsNotSeen : globalState.questions,
  );
  if (!newCurrentQuestion) return;

  const questionAlreadySeenIds = [
    ...(questionsNotSeen.length ? globalState.questionAlreadySeenIds : []),
    newCurrentQuestion.id,
  ];

  setGlobalState((prev) => ({
    ...prev,
    currentQuestion: newCurrentQuestion,
    questionAlreadySeenIds,
  }));

  storage.set(STORAGE_QUESTIONS_SEEN_KEY, questionAlreadySeenIds);
};
