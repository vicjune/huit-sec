import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Player } from '../utils/usePlayers';
import { Question } from '../utils/useQuestions';
import { SpecialEvent } from '../utils/useSpecialEvents';

interface GlobalState {
  players?: Player[];
  playerAnsweringId?: string;
  secondaryPlayerAnsweringId?: string;
  playerAskingId?: string;
  scoreVictory?: number;
  timerValue?: number;
  questionAlreadySeenIds?: string[];
  permanentQuestionAlreadySeenIds?: string[];
  currentQuestion?: Question;
  currentEvent?: SpecialEvent;
  turnsSinceLastEvent: number;
  muted?: boolean;
}

const defaultGlobalState: GlobalState = {
  turnsSinceLastEvent: 0,
};

const globalStateContext = createContext<{
  globalState: GlobalState;
  setGlobalState: Dispatch<SetStateAction<GlobalState>>;
}>({
  globalState: defaultGlobalState,
  setGlobalState: () => {},
});

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] =
    useState<GlobalState>(defaultGlobalState);

  return (
    <globalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
