import { pickRandomItem } from '../pickRandomItem';
import { storage, STORAGE_QUESTIONS_SEEN_KEY } from '../storage';
import { default as questionsJSON } from '../../json/questions.json';
import { useGlobalState } from '../../contexts/GlobalState';

export enum BundleId {
  BASE = 'BASE',
  BUNDLE_1 = 'BUNDLE_1',
  BUNDLE_2 = 'BUNDLE_2',
  BUNDLE_3 = 'BUNDLE_3',
}

export interface Question {
  id: string;
  number: number;
  text: string;
  bundle: BundleId;
}

export const useGlobalQuestions = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { questions, questionAlreadySeenIds, currentQuestion } = globalState;

  const initQuestions = () => {
    storage.get<string[]>(STORAGE_QUESTIONS_SEEN_KEY).then((questionIds) => {
      if (!questionIds) return;
      setGlobalState((prev) => ({
        ...prev,
        questionAlreadySeenIds: questionIds,
      }));
    });

    loadQuestions();
  };

  const loadQuestions = () => {
    // TODO: Bundles
    setGlobalState((prev) => ({
      ...prev,
      questions: questionsJSON as Question[],
    }));
  };

  const newQuestion = () => {
    const questionsNotSeen = questions.filter(
      ({ id }) => !questionAlreadySeenIds.includes(id),
    );

    const newCurrentQuestion = pickRandomItem(
      questionsNotSeen.length ? questionsNotSeen : questions,
    );
    if (!newCurrentQuestion) return;

    const newQuestionAlreadySeenIds = [
      ...(questionsNotSeen.length ? questionAlreadySeenIds : []),
      newCurrentQuestion.id,
    ];

    setGlobalState((prev) => ({
      ...prev,
      currentQuestion: newCurrentQuestion,
      questionAlreadySeenIds: newQuestionAlreadySeenIds,
    }));

    storage.set(STORAGE_QUESTIONS_SEEN_KEY, newQuestionAlreadySeenIds);
  };

  return { currentQuestion, newQuestion, loadQuestions, initQuestions };
};
