import { pickRandomItem } from '../pickRandomItem';
import {
  storage,
  STORAGE_PERMANENT_QUESTIONS_SEEN_KEY,
  STORAGE_QUESTIONS_SEEN_KEY,
} from '../storage';
import { default as questionsJSON } from '../../json/questions.json';
import { useGlobalState } from '../../contexts/GlobalState';
import { ElementType, useMemo } from 'react';
import { BundleId } from '../../types/BundleId';
import { default as EntIcon } from 'react-native-vector-icons/Entypo';

export interface Question {
  id: string;
  number: number;
  text: string;
  bundle: BundleId;
}

interface Bundle {
  id: BundleId;
  title: string;
  lockedByDefault?: boolean;
  iconType: ElementType;
  icon: string;
}

interface BundleWithInfos {
  id: BundleId;
  title: string;
  iconType: ElementType;
  icon: string;
  locked: boolean;
  questionsNbr: number;
  questionsNotSeenNbr: number;
}

const bundles: Bundle[] = [
  {
    id: BundleId.BASE,
    title: 'Questions de base',
    iconType: EntIcon,
    icon: 'box',
  },
  {
    id: BundleId.BUNDLE_1,
    title: 'Encore plus tordues',
    iconType: EntIcon,
    icon: 'water',
    lockedByDefault: true,
  },
  {
    id: BundleId.BUNDLE_2,
    title: "Pour mettre l'ambiance",
    iconType: EntIcon,
    icon: 'traffic-cone',
    lockedByDefault: true,
  },
  {
    id: BundleId.BUNDLE_3,
    title: 'Si tu veux perdre des potes',
    iconType: EntIcon,
    icon: 'hand',
    lockedByDefault: true,
  },
];

export const useGlobalQuestions = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const {
    questionAlreadySeenIds,
    permanentQuestionAlreadySeenIds,
    currentQuestion,
    unlockedBundleIds,
  } = globalState;

  const initQuestions = () => {
    storage.get<string[]>(STORAGE_QUESTIONS_SEEN_KEY).then((questionIds) => {
      if (!questionIds) return;
      setGlobalState((prev) => ({
        ...prev,
        questionAlreadySeenIds: questionIds,
      }));
    });

    storage
      .get<string[]>(STORAGE_PERMANENT_QUESTIONS_SEEN_KEY)
      .then((questionIds) => {
        if (!questionIds) return;
        setGlobalState((prev) => ({
          ...prev,
          permanentQuestionAlreadySeenIds: questionIds,
        }));
      });
  };

  const availableBundleIds = bundles
    .filter(
      ({ id, lockedByDefault }) =>
        !lockedByDefault || unlockedBundleIds.includes(id),
    )
    .map(({ id }) => id);

  const allQuestions = useMemo(() => questionsJSON as Question[], []);

  const questions = useMemo(
    () =>
      allQuestions.filter(({ bundle }) => availableBundleIds.includes(bundle)),
    [allQuestions, availableBundleIds],
  );

  const bundlesWithInfos: BundleWithInfos[] = useMemo(
    () =>
      bundles.map((bundle) => {
        const questionsInBundle = allQuestions.filter(
          ({ bundle: questionBundle }) => questionBundle === bundle.id,
        );

        const questionsNotSeenNbr = questionsInBundle.filter(
          ({ id: questionId }) =>
            !permanentQuestionAlreadySeenIds.includes(questionId),
        ).length;

        return {
          ...bundle,
          locked: !availableBundleIds.includes(bundle.id),
          questionsNbr: questionsInBundle.length,
          questionsNotSeenNbr,
        };
      }),
    [allQuestions, availableBundleIds, permanentQuestionAlreadySeenIds],
  );

  const newQuestion = () => {
    const questionsNotSeen = questions.filter(
      ({ id }) => !questionAlreadySeenIds.includes(id),
    );

    const questionsNeverSeen = questions.filter(
      ({ id }) => !permanentQuestionAlreadySeenIds.includes(id),
    );

    const newCurrentQuestion = pickRandomItem(
      questionsNeverSeen.length
        ? questionsNeverSeen
        : questionsNotSeen.length
        ? questionsNotSeen
        : questions,
    );
    if (!newCurrentQuestion) return;

    const newQuestionAlreadySeenIds = [
      ...(questionsNotSeen.length ? questionAlreadySeenIds : []),
      newCurrentQuestion.id,
    ];

    const newPermanentQuestionAlreadySeenIds =
      permanentQuestionAlreadySeenIds.includes(newCurrentQuestion.id)
        ? permanentQuestionAlreadySeenIds
        : [...permanentQuestionAlreadySeenIds, newCurrentQuestion.id];

    setGlobalState((prev) => ({
      ...prev,
      currentQuestion: newCurrentQuestion,
      questionAlreadySeenIds: newQuestionAlreadySeenIds,
      permanentQuestionAlreadySeenIds: newPermanentQuestionAlreadySeenIds,
    }));

    storage.set(STORAGE_QUESTIONS_SEEN_KEY, newQuestionAlreadySeenIds);
    storage.set(
      STORAGE_PERMANENT_QUESTIONS_SEEN_KEY,
      newPermanentQuestionAlreadySeenIds,
    );
  };

  return { currentQuestion, newQuestion, initQuestions, bundlesWithInfos };
};
