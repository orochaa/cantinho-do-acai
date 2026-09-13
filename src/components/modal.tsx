import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

export interface ModalProps {
  children: ReactNode;
  labelledBy: string;
  open: boolean;
  onClose: () => void;
  onOpened?: () => void;
}

export function Modal(props: ModalProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (props.open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => props.onOpened?.());
    }
    if (!props.open && dialog.open) {
      dialog.close();
    }
  }, [props.open, props.onOpened]);

  if (!props.open) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Native dialog backdrop is interactive.
    // biome-ignore lint/a11y/useKeyWithClickEvents: Native dialog handles Escape through cancel.
    <dialog
      ref={dialogRef}
      aria-labelledby={props.labelledBy}
      className="fixed top-1/2 left-1/2 m-0 flex h-[min(60vh,42rem)] max-h-[calc(100svh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] w-[min(96vw,42rem)] max-w-[calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border-0 bg-white p-4 shadow-[0_12px_40px_rgb(0_0_0/35%)] backdrop:bg-black/60 lg:p-6"
      onCancel={event => {
        event.preventDefault();
        props.onClose();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }}>
      {props.children}
    </dialog>
  );
}
