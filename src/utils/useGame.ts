import { Player, getNewPlayer, usePlayers } from './usePlayers';
import { INVALID_POINTS, useScore, VALID_POINTS } from './useScore';
import {
  SpecialEventId,
  SpecialEvent,
  useSpecialEvent,
} from './useSpecialEvents';
import { pickRandomItem } from './pickRandomItem';
import { useGlobalState } from '../contexts/GlobalState';
import { useCallback, useMemo } from 'react';
import { useQuestions } from './useQuestions';

const getLeastAnswerPlayers = (players: Player[]) =>
  players.reduce((prev, player) => {
    if (!prev[0] || prev[0].nbrAnswered > player.nbrAnswered) {
      return [player];
    }
    if (prev[0].nbrAnswered < player.nbrAnswered) return prev;
    return [...prev, player];
  }, [] as Player[]);

export const useGame = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const { playerAnsweringId, secondaryPlayerAnsweringId, playerAskingId } =
    globalState;
  const { getRandomEvent, currentEvent } = useSpecialEvent();
  const { players } = usePlayers();
  const { scoreVictory } = useScore();
  const { currentQuestion, permanentQuestionAlreadySeenIds } = useQuestions();

  const isFirstGame = useMemo(
    () => !permanentQuestionAlreadySeenIds?.length,
    [permanentQuestionAlreadySeenIds],
  );

  const getUpdatedPlayer = useCallback(
    (player: Player, winnerId: string | null) => {
      switch (currentEvent?.id) {
        case SpecialEventId.DUEL: {
          if (
            ![playerAnsweringId, secondaryPlayerAnsweringId].includes(player.id)
          ) {
            return player;
          }

          return {
            ...player,
            nbrAnswered: player.nbrAnswered + 1,
            score: player.score + (player.id === winnerId ? VALID_POINTS : 0),
          };
        }

        case SpecialEventId.EVERYONE: {
          if (player.id === playerAskingId) {
            return player;
          }

          return {
            ...player,
            nbrAnswered: player.nbrAnswered + 1,
            score: player.score + (player.id === winnerId ? VALID_POINTS : 0),
          };
        }

        default:
          if (player.id !== playerAnsweringId) {
            return player;
          }

          return {
            ...player,
            nbrAnswered: player.nbrAnswered + 1,
            score: Math.max(
              player.score +
                (player.id === winnerId ? VALID_POINTS : INVALID_POINTS),
              0,
            ),
          };
      }
    },
    [
      currentEvent?.id,
      playerAnsweringId,
      playerAskingId,
      secondaryPlayerAnsweringId,
    ],
  );

  const answer = useCallback(
    (winnerId: string | null) => {
      const newPlayers = players.map((player) =>
        getUpdatedPlayer(player, winnerId),
      );

      setGlobalState((prev) => ({ ...prev, players: newPlayers }));
      return !!newPlayers.find(({ score }) => score >= scoreVictory);
    },
    [getUpdatedPlayer, players, scoreVictory, setGlobalState],
  );

  const newTurn = useCallback(() => {
    let newEvent: SpecialEvent | undefined;
    if (currentQuestion) {
      newEvent = getRandomEvent();
    }

    let newPlayerAnswering: Player | undefined;
    if (newEvent?.id !== SpecialEventId.EVERYONE) {
      const newPlayerAnsweringPool = getLeastAnswerPlayers(
        players.filter(({ id }) => playerAnsweringId !== id),
      );
      newPlayerAnswering = pickRandomItem(newPlayerAnsweringPool);
    }

    let newSecondaryPlayerAnswering: Player | undefined;
    if (newEvent?.id === SpecialEventId.DUEL) {
      const newSecondaryPlayerAnsweringPool = getLeastAnswerPlayers(
        players.filter(({ id }) => newPlayerAnswering?.id !== id),
      );
      newSecondaryPlayerAnswering = pickRandomItem(
        newSecondaryPlayerAnsweringPool,
      );
    }

    const newPlayerAskingPool = players.filter(
      ({ id }) =>
        ![
          playerAskingId,
          newPlayerAnswering?.id,
          newSecondaryPlayerAnswering?.id,
        ].includes(id),
    );
    const newPlayerAsking = pickRandomItem(newPlayerAskingPool);

    setGlobalState((prev) => ({
      ...prev,
      playerAskingId: newPlayerAsking?.id,
      playerAnsweringId: newPlayerAnswering?.id,
      secondaryPlayerAnsweringId: newSecondaryPlayerAnswering?.id,
      currentEvent: newEvent,
    }));
  }, [
    currentQuestion,
    playerAnsweringId,
    playerAskingId,
    players,
    setGlobalState,
    getRandomEvent,
  ]);

  const resetGame = useCallback(() => {
    setGlobalState((prev) => ({
      ...prev,
      players: (prev.players || []).map(({ name }) => getNewPlayer(name)),
      currentQuestion: undefined,
      currentEvent: undefined,
      turnsSinceLastEvent: 0,
    }));
  }, [setGlobalState]);

  return { resetGame, answer, newTurn, isFirstGame };
};
