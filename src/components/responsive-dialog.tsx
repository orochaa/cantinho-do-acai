import { useMediaQuery } from '@/hooks/use-media-query';
import type { ReactNode, RefObject } from 'react';
import { Drawer } from './drawer';
import { Modal } from './modal';

export interface ResponsiveDialogProps {
  children: ReactNode;
  closeRef?: RefObject<(() => void) | null>;
  labelledBy: string;
  drawerSize?: 'content' | 'medium' | 'full';
  open: boolean;
  onClose: () => void;
  onOpened?: () => void;
}

export function ResponsiveDialog(
  props: ResponsiveDialogProps,
): React.JSX.Element | null {
  // Handoff when the drawer reaches its max-w-2xl width (about 700px).
  const isDesktop = useMediaQuery('(min-width: 700px)');

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
      size={props.drawerSize}
      open={props.open}
      onClose={props.onClose}>
      {props.children}
    </Drawer>
  );
}
