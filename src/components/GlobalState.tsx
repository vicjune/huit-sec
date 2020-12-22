import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Player } from '../types/Players';
import { storage } from '../utils/storage';
import { v4 as genUuid } from 'uuid';
import { pickRandomItem } from '../utils/pickRandomItem';
import { Question } from '../types/Question';
import { default as questionsJSON } from '../json/questions.json';

const STORAGE_PLAYERS_KEY = '@playerNames';
const STORAGE_VICTORY_KEY = '@victoryScore';
const STORAGE_QUESTIONS_SEEN_KEY = '@questionsSeen';
export const VALID_POINTS = 3;
export const INVALID_POINTS = -1;
const DEFAULT_SCORE_VICTORY = 10;

interface GlobalStateContext {
  players: Player[];
  playerAnswering?: Player;
  playerAsking?: Player;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  removeAllPlayers: () => void;
  resetScores: () => void;
  newTurn: () => void;
  newQuestion: () => void;
  goodAnswer: () => boolean;
  badAnswer: () => boolean;
  scoreVictory: number;
  setScoreVictory: (scoreVictory: number) => void;
  currentQuestion?: Question;
}

const globalStateContext = createContext<GlobalStateContext>({
  players: [],
  addPlayer: () => {},
  removePlayer: () => {},
  removeAllPlayers: () => {},
  resetScores: () => {},
  newTurn: () => {},
  goodAnswer: () => false,
  badAnswer: () => false,
  scoreVictory: 0,
  setScoreVictory: () => {},
  newQuestion: () => {},
});

interface GlobalState {
  players: Player[];
  playerAnsweringId?: string;
  playerAskingId?: string;
  scoreVictory: number;
  questions: Question[];
  questionAlreadySeenIds: string[];
  currentQuestion?: Question;
}

const getNewPlayer = (name: string) => ({ id: genUuid(), name, score: 0 });

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    players: [],
    questions: [],
    questionAlreadySeenIds: [],
    scoreVictory: DEFAULT_SCORE_VICTORY,
  });

  const playerAnsweringIndex = globalState.players.findIndex(
    ({ id }) => globalState.playerAnsweringId === id,
  );
  const playerAnswering = globalState.players[playerAnsweringIndex];
  const playerAskingIndex = globalState.players.findIndex(
    ({ id }) => globalState.playerAskingId === id,
  );
  const playerAsking = globalState.players[playerAskingIndex];

  useEffect(() => {
    storage.get<string[]>(STORAGE_PLAYERS_KEY).then((playerNames) => {
      if (!playerNames) return;
      setGlobalState((prev) => ({
        ...prev,
        players: playerNames.map(getNewPlayer),
      }));
    });

    storage.get<number>(STORAGE_VICTORY_KEY).then((scoreVictory) => {
      if (!scoreVictory) return;
      setGlobalState((prev) => ({ ...prev, scoreVictory }));
    });

    storage
      .get<string[]>(STORAGE_QUESTIONS_SEEN_KEY)
      .then((questionAlreadySeenIds) => {
        if (!questionAlreadySeenIds) return;
        setGlobalState((prev) => ({ ...prev, questionAlreadySeenIds }));
      });

    // TODO: Bundles
    setGlobalState((prev) => ({
      ...prev,
      questions: questionsJSON as Question[],
    }));
  }, []);

  const addPlayer = (playerName: string) => {
    storage.set(STORAGE_PLAYERS_KEY, [
      ...globalState.players.map(({ name }) => name),
      playerName,
    ]);
    setGlobalState((prev) => ({
      ...prev,
      players: [...prev.players, getNewPlayer(playerName)],
    }));
  };

  const removePlayer = (toRemoveId: string) => {
    const playerToRemoveIndex = globalState.players.findIndex(
      ({ id }) => id === toRemoveId,
    );
    if (playerToRemoveIndex < 0) return;
    const newPlayers = [...globalState.players];
    newPlayers.splice(playerToRemoveIndex, 1);
    storage.set(
      STORAGE_PLAYERS_KEY,
      newPlayers.map(({ name }) => name),
    );
    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
  };

  const removeAllPlayers = () => {
    setGlobalState((prev) => ({ ...prev, players: [] }));
    storage.remove(STORAGE_PLAYERS_KEY);
  };

  const newTurn = () => {
    const playersNotAsking = globalState.players.filter(
      ({ id }) => globalState.playerAskingId !== id,
    );
    const newPlayerAsking = pickRandomItem(playersNotAsking);
    const newPlayersAnswering = globalState.players.filter(
      ({ id }) =>
        ![globalState.playerAnsweringId, newPlayerAsking?.id].includes(id),
    );
    const newPlayerAnswering = pickRandomItem(newPlayersAnswering);
    setGlobalState((prev) => ({
      ...prev,
      playerAskingId: newPlayerAsking?.id,
      playerAnsweringId: newPlayerAnswering?.id,
    }));
  };

  const answer = (good: boolean) => {
    if (playerAnsweringIndex < 0) return false;
    const newPlayers = [...globalState.players];
    const newScore =
      playerAnswering.score + (good ? VALID_POINTS : INVALID_POINTS);
    newPlayers[playerAnsweringIndex] = {
      ...playerAnswering,
      score: newScore < 0 ? 0 : newScore,
    };
    setGlobalState((prev) => ({ ...prev, players: newPlayers }));
    return newScore >= globalState.scoreVictory;
  };

  const resetScores = () => {
    setGlobalState((prev) => ({
      ...prev,
      players: prev.players.map((player) => ({ ...player, score: 0 })),
    }));
  };

  const setScoreVictory = (scoreVictory: number) => {
    setGlobalState((prev) => ({ ...prev, scoreVictory }));
    storage.set(STORAGE_VICTORY_KEY, scoreVictory);
  };

  const newQuestion = () => {
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

  return (
    <globalStateContext.Provider
      value={{
        players: globalState.players,
        newTurn,
        playerAnswering,
        playerAsking,
        addPlayer,
        removePlayer,
        removeAllPlayers,
        resetScores,
        goodAnswer: () => answer(true),
        badAnswer: () => answer(false),
        scoreVictory: globalState.scoreVictory,
        setScoreVictory,
        currentQuestion: globalState.currentQuestion,
        newQuestion,
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
