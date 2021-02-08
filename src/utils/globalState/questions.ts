import { atom, useRecoilState } from 'recoil';
import { pickRandomItem } from '../pickRandomItem';
import { storage, STORAGE_QUESTIONS_SEEN_KEY } from '../storage';
import { default as questionsJSON } from '../../json/questions.json';

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

const questionsAtom = atom<Question[]>({
  key: 'questions',
  default: [],
});
const questionAlreadySeenIdsAtom = atom<string[]>({
  key: 'questionAlreadySeenIds',
  default: [],
});
export const currentQuestionAtom = atom<Question | undefined>({
  key: 'currentQuestion',
  default: undefined,
});

export const useGlobalQuestions = () => {
  const [questions, setQuestions] = useRecoilState(questionsAtom);
  const [questionAlreadySeenIds, setQuestionAlreadySeenIds] = useRecoilState(
    questionAlreadySeenIdsAtom,
  );
  const [currentQuestion, setCurrentQuestion] = useRecoilState(
    currentQuestionAtom,
  );

  const initQuestions = () => {
    storage.get<string[]>(STORAGE_QUESTIONS_SEEN_KEY).then((questionIds) => {
      if (!questionIds) return;
      setQuestionAlreadySeenIds(questionIds);
    });

    loadQuestions();
  };

  const loadQuestions = () => {
    // TODO: Bundles
    setQuestions(questionsJSON as Question[]);
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

    setCurrentQuestion(newCurrentQuestion);
    setQuestionAlreadySeenIds(newQuestionAlreadySeenIds);

    storage.set(STORAGE_QUESTIONS_SEEN_KEY, newQuestionAlreadySeenIds);
  };

  return { currentQuestion, newQuestion, loadQuestions, initQuestions };
};
