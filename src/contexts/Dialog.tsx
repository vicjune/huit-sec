import React, {
  FC,
  createContext,
  ReactNode,
  useState,
  useContext,
} from 'react';
import { default as RnDialog, DialogProps } from 'react-native-popup-dialog';

type ContextDialogProps = Pick<
  DialogProps,
  Exclude<keyof DialogProps, 'visible' | 'onTouchOutside' | 'children'>
> & { content?: ReactNode };

export type OpenDialogType = (props: ContextDialogProps) => void;

const Dialog: FC = () => {
  const { closeDialog, dialogProps } = useContext(dialogContext);
  const { content, ...rest } = dialogProps;

  return (
    <RnDialog
      {...(rest || {})}
      visible={!!content}
      onTouchOutside={closeDialog}
    >
      {content}
    </RnDialog>
  );
};

interface DialogContext {
  openDialog: OpenDialogType;
  closeDialog: () => void;
  dialogProps: ContextDialogProps;
}

const defaultDialogProps = {};

const dialogContext = createContext<DialogContext>({
  openDialog: () => {},
  closeDialog: () => {},
  dialogProps: defaultDialogProps,
});

export const DialogProvider: FC = ({ children }) => {
  const [dialogProps, setDialogProps] =
    useState<ContextDialogProps>(defaultDialogProps);

  const openDialog: OpenDialogType = (props) => {
    setDialogProps(props || {});
  };
  const closeDialog = () => setDialogProps(defaultDialogProps);

  return (
    <dialogContext.Provider
      value={{
        openDialog,
        closeDialog,
        dialogProps,
      }}
    >
      {children}
      <Dialog />
    </dialogContext.Provider>
  );
};

export const useDialog = () => {
  const { openDialog, closeDialog } = useContext(dialogContext);
  return { openDialog, closeDialog };
};
