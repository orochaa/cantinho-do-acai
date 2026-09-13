import type { ReactNode, RefObject } from 'react';
import { useEffect, useState } from 'react';
import { Drawer } from './drawer';
import { Modal } from './modal';

export interface ResponsiveDialogProps {
  children: ReactNode;
  closeRef?: RefObject<(() => void) | null>;
  labelledBy: string;
  open: boolean;
  onClose: () => void;
  onOpened?: () => void;
}

export function ResponsiveDialog(
  props: ResponsiveDialogProps,
): React.JSX.Element | null {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    // Handoff when the drawer reaches its max-w-2xl width (about 700px).
    const media = window.matchMedia('(min-width: 700px)');
    const update = (): void => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (isDesktop) {
    return (
      <Modal
        labelledBy={props.labelledBy}
        open={props.open}
        onClose={props.onClose}
        onOpened={props.onOpened}>
        {props.children}
      </Modal>
    );
  }

  return (
    <Drawer
      closeRef={props.closeRef}
      labelledBy={props.labelledBy}
      open={props.open}
      onClose={props.onClose}>
      {props.children}
    </Drawer>
  );
}
