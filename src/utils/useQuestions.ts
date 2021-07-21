import { pickRandomItem } from './pickRandomItem';
import {
  storage,
  STORAGE_PERMANENT_QUESTIONS_SEEN_KEY,
  STORAGE_QUESTIONS_SEEN_KEY,
} from './storage';
import { default as questionsJSON } from '../json/questions.json';
import { useGlobalState } from '../contexts/GlobalState';
import { useCallback, useEffect, useMemo } from 'react';
import { BundleId, bundles, BundleWithInfos } from '../const/bundles';
import { useInAppPurchases } from '../contexts/InAppPurchases';

export interface Question {
  id: string;
  number: number;
  text: string;
  bundle: BundleId;
}

export const useQuestions = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const {
    questionAlreadySeenIds: questionAlreadySeenIdsGS,
    permanentQuestionAlreadySeenIds: permanentQuestionAlreadySeenIdsGS,
    currentQuestion,
  } = globalState;
  const { products, availablePurchases } = useInAppPurchases();

  useEffect(() => {
    if (questionAlreadySeenIdsGS === undefined) {
      storage.get<string[]>(STORAGE_QUESTIONS_SEEN_KEY).then((questionIds) => {
        setGlobalState((prev) => ({
          ...prev,
          questionAlreadySeenIds: questionIds || [],
        }));
      });
    }

    if (permanentQuestionAlreadySeenIdsGS === undefined) {
      storage
        .get<string[]>(STORAGE_PERMANENT_QUESTIONS_SEEN_KEY)
        .then((questionIds) => {
          setGlobalState((prev) => ({
            ...prev,
            permanentQuestionAlreadySeenIds: questionIds || [],
          }));
        });
    }
  }, [
    questionAlreadySeenIdsGS,
    permanentQuestionAlreadySeenIdsGS,
    setGlobalState,
  ]);

  const questionAlreadySeenIds = useMemo(
    () => questionAlreadySeenIdsGS || [],
    [questionAlreadySeenIdsGS],
  );

  const permanentQuestionAlreadySeenIds = useMemo(
    () => permanentQuestionAlreadySeenIdsGS || [],
    [permanentQuestionAlreadySeenIdsGS],
  );

  const availableBundleIds = useMemo(
    () =>
      bundles
        .filter(
          ({ id, lockedByDefault }) =>
            !lockedByDefault ||
            availablePurchases.map(({ productId }) => productId).includes(id),
        )
        .map(({ id }) => id),
    [availablePurchases],
  );

  const allQuestions = useMemo(() => questionsJSON as Question[], []);

  const questions = useMemo(
    () =>
      allQuestions.filter(({ bundle }) => availableBundleIds.includes(bundle)),
    [allQuestions, availableBundleIds],
  );

  const bundlesWithInfos: BundleWithInfos[] = useMemo(
    () =>
      bundles
        .filter(
          ({ id, lockedByDefault }) =>
            !lockedByDefault ||
            products.map(({ productId }) => productId).includes(id),
        )
        .map((bundle) => {
          const questionsInBundle = allQuestions.filter(
            ({ bundle: questionBundle }) => questionBundle === bundle.id,
          );

          const product = products.find(
            ({ productId }) => productId === bundle.id,
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
            price: product?.localizedPrice,
          };
        }),
    [
      allQuestions,
      availableBundleIds,
      permanentQuestionAlreadySeenIds,
      products,
    ],
  );

  const newQuestion = useCallback(() => {
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
  }, [
    permanentQuestionAlreadySeenIds,
    questionAlreadySeenIds,
    questions,
    setGlobalState,
  ]);

  return {
    currentQuestion,
    newQuestion,
    bundlesWithInfos,
    permanentQuestionAlreadySeenIds,
  };
};
