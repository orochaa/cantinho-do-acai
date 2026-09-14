import { motion } from 'motion/react';
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const closeDuration = 180;

export interface DrawerProps {
  children: ReactNode;
  closeRef?: RefObject<(() => void) | null>;
  labelledBy: string;
  onClose: () => void;
  open: boolean;
}

export function Drawer(props: DrawerProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (props.open && !dialog.open) {
      dialog.showModal();
      setIsClosing(false);
    } else if (!props.open && dialog.open) {
      dialog.close();
    }
  }, [props.open]);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  const requestClose = (): void => {
    if (isClosing) {
      return;
    }
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      props.onClose();
    }, closeDuration);
  };

  if (props.closeRef) {
    props.closeRef.current = requestClose;
  }

  if (!props.open) {
    return null;
  }

  const drawer = (
    <motion.dialog
      ref={dialogRef}
      aria-labelledby={props.labelledBy}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? '100%' : '0%' }}
      transition={{
        duration: closeDuration / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-auto bottom-0 m-0 box-border flex w-full max-w-none flex-col overflow-y-auto rounded-t-2xl border-0 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-zinc-950 shadow-[0_-12px_40px_rgb(0_0_0/35%)] backdrop:bg-black/30 max-h-[calc(100svh-env(safe-area-inset-top))]"
      onCancel={event => {
        event.preventDefault();
        event.stopPropagation();
        requestClose();
      }}
      onClick={event => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}>
      {props.children}
    </motion.dialog>
  );

  return typeof document === 'undefined'
    ? drawer
    : createPortal(drawer, document.body);
}
