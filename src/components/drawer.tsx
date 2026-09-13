import { motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

export type DrawerSize = 'small' | 'medium' | 'tall';

const heightRatios: Record<DrawerSize, number> = {
  small: 0.4,
  medium: 0.6,
  tall: 1,
};
const sizes: ReadonlyArray<DrawerSize> = ['small', 'medium', 'tall'];
const closeDuration = 180;
const dragThreshold = 32;

const viewportHeight = (): number =>
  typeof window === 'undefined' ? 0 : window.innerHeight;

const heightFor = (size: DrawerSize): number =>
  viewportHeight() * heightRatios[size];

export interface DrawerProps {
  children: ReactNode;
  closeRef?: RefObject<(() => void) | null>;
  labelledBy: string;
  onClose: () => void;
  open: boolean;
}

export function Drawer(props: DrawerProps): React.JSX.Element | null {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dragStartY = useRef<number | null>(null);
  const lastPointerY = useRef<number | null>(null);
  const dragHeight = useRef(0);
  const closeTimer = useRef<number | null>(null);
  const [size, setSize] = useState<DrawerSize>('medium');
  const [height, setHeight] = useState(() => heightFor('medium'));
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog === null) {
      return;
    }
    if (props.open && !dialog.open) {
      dialog.showModal();
      setSize('medium');
      const initialHeight = heightFor('medium');
      dragHeight.current = initialHeight;
      setHeight(initialHeight);
      setIsClosing(false);
    }
  }, [props.open]);

  useEffect(() => {
    const updateHeight = (): void => {
      const nextHeight = heightFor(size);
      dragHeight.current = nextHeight;
      setHeight(nextHeight);
    };
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [size]);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  if (!props.open) {
    return null;
  }

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

  const snap = (deltaY = 0): void => {
    const viewport = viewportHeight();
    const nearest = sizes.reduce(
      (best, candidate) =>
        Math.abs(heightRatios[candidate] * viewport - dragHeight.current) <
        Math.abs(heightRatios[best] * viewport - dragHeight.current)
          ? candidate
          : best,
      'small',
    );
    if (dragHeight.current < heightRatios.small * viewport) {
      requestClose();
      return;
    }
    const currentIndex = sizes.indexOf(size);
    const directionalIndex =
      Math.abs(deltaY) >= dragThreshold
        ? currentIndex + (deltaY < 0 ? 1 : -1)
        : sizes.indexOf(nearest);
    if (directionalIndex < 0) {
      requestClose();
      return;
    }
    const nextSize =
      sizes[Math.min(sizes.length - 1, directionalIndex)] ?? size;
    const nextHeight = heightFor(nextSize);
    setSize(nextSize);
    setHeight(nextHeight);
    dragHeight.current = nextHeight;
  };

  const nudge = (delta: number): void => {
    dragHeight.current = Math.max(0, height + delta);
    setHeight(dragHeight.current);
    snap();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={props.labelledBy}
      className="fixed inset-x-0 top-auto bottom-0 m-0 flex h-screen max-h-none w-full max-w-none flex-col justify-end border-0 bg-transparent p-0 backdrop:bg-transparent"
      onCancel={event => {
        event.preventDefault();
        requestClose();
      }}>
      <motion.button
        aria-label="Fechar"
        animate={{ opacity: isClosing ? 0 : 1 }}
        className="absolute inset-0 h-full w-full cursor-default bg-black/55"
        initial={{ opacity: 0 }}
        type="button"
        transition={{
          duration: closeDuration / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={requestClose}
      />
      <motion.section
        initial={{ y: height, opacity: 0 }}
        animate={{
          height: isClosing ? 0 : height,
          y: '0%',
          opacity: isClosing ? 0 : 1,
        }}
        transition={{
          duration: isDragging ? 0 : closeDuration / 1000,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col rounded-t-3xl bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl"
        style={{ height: `${height}px` }}>
        <button
          aria-label="Redimensionar"
          className="order-first mx-auto mb-3 flex min-h-11 w-full touch-none items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-purple-700"
          type="button"
          onKeyDown={event => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault();
              nudge(event.key === 'ArrowUp' ? 120 : -120);
            }
          }}
          onPointerDown={event => {
            dragStartY.current = event.clientY;
            lastPointerY.current = event.clientY;
            dragHeight.current = height;
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            if (dragStartY.current === null) {
              return;
            }
            lastPointerY.current = event.clientY;
            const nextHeight = Math.min(
              viewportHeight(),
              Math.max(0, viewportHeight() - event.clientY),
            );
            dragHeight.current = nextHeight;
            setHeight(nextHeight);
          }}
          onPointerUp={event => {
            if (dragStartY.current !== null) {
              const deltaY = event.clientY - dragStartY.current;
              if (lastPointerY.current === dragStartY.current) {
                dragHeight.current = Math.min(
                  viewportHeight(),
                  Math.max(0, height - deltaY),
                );
                setHeight(dragHeight.current);
              }
              dragStartY.current = null;
              lastPointerY.current = null;
              setIsDragging(false);
              snap(deltaY);
            }
          }}
          onPointerCancel={() => {
            dragStartY.current = null;
            lastPointerY.current = null;
            setIsDragging(false);
            snap();
          }}>
          <span
            aria-hidden="true"
            className="h-1.5 w-12 rounded-full bg-zinc-300"
          />
        </button>
        {props.children}
      </motion.section>
    </dialog>
  );
}
