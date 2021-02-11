import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Player } from '../utils/globalState/players';
import { Question } from '../utils/globalState/questions';
import { SpecialEvent } from '../utils/globalState/specialEvents';

interface GlobalState {
  players: Player[];
  playerAnsweringId?: string;
  secondaryPlayerAnsweringId?: string;
  playerAskingId?: string;
  scoreVictory: number;
  timerValue: number;
  questionAlreadySeenIds: string[];
  currentQuestion?: Question;
  currentEvent?: SpecialEvent;
}

const defaultGlobalState: GlobalState = {
  players: [],
  questionAlreadySeenIds: [],
  scoreVictory: 0,
  timerValue: 0,
};

const globalStateContext = createContext<{
  globalState: GlobalState;
  setGlobalState: Dispatch<SetStateAction<GlobalState>>;
}>({
  globalState: defaultGlobalState,
  setGlobalState: () => {},
});

export const GlobalStateProvider: FC = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>(
    defaultGlobalState,
  );

  return (
    <globalStateContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </globalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(globalStateContext);
