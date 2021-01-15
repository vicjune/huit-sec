import React, {
  FC,
  createContext,
  ReactNode,
  useState,
  useContext,
} from 'react';
import { Modal as RnModal } from 'react-native';

interface ModalContext {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
  modalContent: ReactNode | null;
}

const modalContext = createContext<ModalContext>({
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
});

export const ModalProvider: FC = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = setModalContent;
  const closeModal = () => setModalContent(null);

  return (
    <modalContext.Provider
      value={{
        openModal,
        closeModal,
        modalContent,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

export const useModal = () => {
  const { openModal, closeModal } = useContext(modalContext);
  return { openModal, closeModal };
};

export const Modal: FC = () => {
  const { modalContent, closeModal } = useContext(modalContext);

  return (
    <RnModal
      visible={!!modalContent}
      animationType="slide"
      onRequestClose={closeModal}
      presentationStyle="pageSheet"
    >
      {modalContent}
    </RnModal>
  );
};
