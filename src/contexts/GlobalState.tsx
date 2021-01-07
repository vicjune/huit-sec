import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Player } from '../types/Players';
import {
  storage,
  STORAGE_PLAYERS_KEY,
  STORAGE_QUESTIONS_SEEN_KEY,
  STORAGE_VICTORY_KEY,
} from '../utils/storage';
import { v4 as genUuid } from 'uuid';
import { Question } from '../types/Question';
import {
  addPlayer,
  removeAllPlayers,
  removePlayer,
  newTurn,
} from '../utils/players';
import { answer, resetScores, setScoreVictory } from '../utils/scores';
import { loadQuestions, newQuestion } from '../utils/questions';

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
  scoreVictory: 0,
  addPlayer: () => {},
  removePlayer: () => {},
  removeAllPlayers: () => {},
  resetScores: () => {},
  newTurn: () => {},
  goodAnswer: () => false,
  badAnswer: () => false,
  setScoreVictory: () => {},
  newQuestion: () => {},
});

export interface GlobalState {
  players: Player[];
  playerAnsweringId?: string;
  playerAskingId?: string;
  scoreVictory: number;
  questions: Question[];
  questionAlreadySeenIds: string[];
  currentQuestion?: Question;
}

const getNewPlayer = (name: string) => ({
  id: genUuid(),
  name,
  score: 0,
  nbrAnswered: 0,
});

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    players: [],
    questions: [],
    questionAlreadySeenIds: [],
    scoreVictory: DEFAULT_SCORE_VICTORY,
  });

  const playerAnswering = globalState.players.find(
    ({ id }) => globalState.playerAnsweringId === id,
  );
  const playerAsking = globalState.players.find(
    ({ id }) => globalState.playerAskingId === id,
  );

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

    loadQuestions(setGlobalState);
  }, []);

  return (
    <globalStateContext.Provider
      value={{
        players: globalState.players,
        playerAnswering,
        playerAsking,
        scoreVictory: globalState.scoreVictory,
        currentQuestion: globalState.currentQuestion,
        addPlayer: (playerName) =>
          addPlayer(playerName, globalState, setGlobalState),
        removePlayer: (id) => removePlayer(id, globalState, setGlobalState),
        removeAllPlayers: () => removeAllPlayers(setGlobalState),
        newTurn: () => newTurn(globalState, setGlobalState),
        resetScores: () => resetScores(setGlobalState),
        goodAnswer: () => answer(true, globalState, setGlobalState),
        badAnswer: () => answer(false, globalState, setGlobalState),
        setScoreVictory: (scoreVictory: number) =>
          setScoreVictory(scoreVictory, setGlobalState),
        newQuestion: () => newQuestion(globalState, setGlobalState),
      }}
    >
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
