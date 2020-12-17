import React, {
  FC,
  createContext,
  ReactNode,
  useState,
  useContext,
} from 'react';
import { Modal } from 'react-native';
import { ScreenWrapper } from './ScreenWrapper';

interface PopinContext {
  openPopin: (content: ReactNode) => void;
  closePopin: () => void;
  popinContent: ReactNode | null;
}

export const popinContext = createContext<PopinContext>({
  openPopin: () => {},
  closePopin: () => {},
  popinContent: null,
});

export const PopinProvider: FC = ({ children }) => {
  const [popinContent, setPopinContent] = useState<ReactNode | null>(null);

  const openPopin = setPopinContent;
  const closePopin = () => setPopinContent(null);

  return (
    <popinContext.Provider
      value={{
        openPopin,
        closePopin,
        popinContent,
      }}
    >
      {children}
    </popinContext.Provider>
  );
};

export const usePopin = () => {
  const { openPopin, closePopin } = useContext(popinContext);
  return { openPopin, closePopin };
};

export const PopinDisplay: FC = () => {
  const { popinContent, closePopin } = useContext(popinContext);

  return (
    <Modal
      visible={!!popinContent}
      animationType="slide"
      onRequestClose={closePopin}
    >
      <ScreenWrapper>{popinContent}</ScreenWrapper>
    </Modal>
  );
};
