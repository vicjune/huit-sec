import { Player, getNewPlayer } from './players';
import { INVALID_POINTS, VALID_POINTS } from './score';
import { SpecialEventId, SpecialEvent, getRandomEvent } from './specialEvents';
import { pickRandomItem } from '../pickRandomItem';
import { useGlobalState } from '../../contexts/GlobalState';

const getLeastAnswerPlayers = (players: Player[]) =>
  players.reduce((prev, player) => {
    if (!prev[0] || prev[0].nbrAnswered > player.nbrAnswered) {
      return [player];
    }
    if (prev[0].nbrAnswered < player.nbrAnswered) return prev;
    return [...prev, player];
  }, [] as Player[]);

export const useGlobalGame = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const {
    players,
    playerAnsweringId,
    secondaryPlayerAnsweringId,
    playerAskingId,
    scoreVictory,
    currentEvent,
    currentQuestion,
    permanentQuestionAlreadySeenIds,
  } = globalState;

  const isFirstGame = !permanentQuestionAlreadySeenIds.length;

  const getUpdatedPlayer = (player: Player, winnerId: string | null) => {
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
  };

  const answer = (winnerId: string | null) => {
    const newPlayers = players.map((player) =>
      getUpdatedPlayer(player, winnerId),
    );

    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
    return !!newPlayers.find(({ score }) => score >= scoreVictory);
  };

  const newTurn = () => {
    let newEvent: SpecialEvent | undefined;
    if (currentQuestion) {
      newEvent = getRandomEvent(players.length);
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
  };

  const resetGame = () => {
    setGlobalState((prev) => ({
      ...prev,
      players: prev.players.map(({ name }) => getNewPlayer(name)),
      currentQuestion: undefined,
      currentEvent: undefined,
    }));
  };

  return { resetGame, answer, newTurn, isFirstGame };
};
