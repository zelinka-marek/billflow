import * as React from "react";

export function useDisclosure() {
  const [isOpenState, setIsOpen] = React.useState(false);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const onToggle = React.useCallback(() => {
    const action = isOpenState ? onClose : onOpen;
    action();
  }, [isOpenState, onOpen, onClose]);

  return {
    isOpen: !!isOpenState,
    onOpen,
    onClose,
    onToggle,
  };
}
