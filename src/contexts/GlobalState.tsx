import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Product, Purchase } from 'react-native-iap';
import { Player } from '../utils/usePlayers';
import { Question } from '../utils/useQuestions';
import { SpecialEvent } from '../utils/useSpecialEvents';

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
  products: Product<string>[];
  availablePurchases: Purchase[];
  productsLoading: boolean;
}

const defaultGlobalState: GlobalState = {
  players: [],
  questionAlreadySeenIds: [],
  permanentQuestionAlreadySeenIds: [],
  scoreVictory: 0,
  timerValue: 0,
  products: [],
  availablePurchases: [],
  productsLoading: false,
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
