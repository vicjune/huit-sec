import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { BundleId } from '../const/bundles';
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
  permanentQuestionAlreadySeenIds: string[];
  currentQuestion?: Question;
  currentEvent?: SpecialEvent;
  purchasedBundleIds: BundleId[];
}

const defaultGlobalState: GlobalState = {
  players: [],
  questionAlreadySeenIds: [],
  permanentQuestionAlreadySeenIds: [],
  scoreVictory: 0,
  timerValue: 0,
  purchasedBundleIds: [],
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
