import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCallback } from 'react';

interface Action {
  label: string;
  cancel?: boolean;
  red?: boolean;
  disabled?: boolean;
  callback?: () => void;
}

export const useActionMenu = () => {
  const { showActionSheetWithOptions } = useActionSheet();

  const openActionMenu = useCallback(
    (actions: Action[]) => {
      const filteredOptions = actions.filter(({ disabled }) => !disabled);
      showActionSheetWithOptions(
        {
          options: filteredOptions.map(({ label }) => label),
          cancelButtonIndex: filteredOptions.findIndex(({ cancel }) => cancel),
          destructiveButtonIndex: filteredOptions.findIndex(({ red }) => red),
        },
        (buttonIndex) => filteredOptions[buttonIndex].callback?.(),
      );
    },
    [showActionSheetWithOptions],
  );

  return { openActionMenu };
};
