import { useRecoilState } from 'recoil';
import {
  Player,
  playersAtom,
  getNewPlayer,
  playerAnsweringIdAtom,
  secondaryPlayerAnsweringIdAtom,
  playerAskingIdAtom,
} from './players';
import { INVALID_POINTS, scoreVictoryAtom, VALID_POINTS } from './score';
import {
  SpecialEventId,
  currentEventAtom,
  SpecialEvent,
  getRandomEvent,
} from './specialEvents';
import { currentQuestionAtom } from './questions';
import { pickRandomItem } from '../pickRandomItem';

const getLeastAnswerPlayers = (players: Player[]) =>
  players.reduce((prev, player) => {
    if (!prev[0] || prev[0].nbrAnswered > player.nbrAnswered) {
      return [player];
    }
    if (prev[0].nbrAnswered < player.nbrAnswered) return prev;
    return [...prev, player];
  }, [] as Player[]);

export const useGlobalGame = () => {
  const [players, setPlayers] = useRecoilState(playersAtom);
  const [playerAnsweringId, setPlayerAnsweringId] = useRecoilState(
    playerAnsweringIdAtom,
  );
  const [
    secondaryPlayerAnsweringId,
    setSecondaryPlayerAnsweringId,
  ] = useRecoilState(secondaryPlayerAnsweringIdAtom);
  const [playerAskingId, setPlayerAskingId] = useRecoilState(
    playerAskingIdAtom,
  );
  const [scoreVictory] = useRecoilState(scoreVictoryAtom);
  const [currentEvent, setCurrentEvent] = useRecoilState(currentEventAtom);
  const [currentQuestion, setCurrentQuestion] = useRecoilState(
    currentQuestionAtom,
  );

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

    setPlayers(newPlayers);
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

    setPlayerAskingId(newPlayerAsking?.id);
    setPlayerAnsweringId(newPlayerAnswering?.id);
    setSecondaryPlayerAnsweringId(newSecondaryPlayerAnswering?.id);
    setCurrentEvent(newEvent);
  };

  const resetGame = () => {
    setPlayers((prev) => prev.map(({ name }) => getNewPlayer(name)));
    setCurrentQuestion(undefined);
    setCurrentEvent(undefined);
  };

  return { resetGame, answer, newTurn };
};
