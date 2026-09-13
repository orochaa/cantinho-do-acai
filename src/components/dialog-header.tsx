import { X } from 'lucide-react';

export interface DialogHeaderProps {
  title: string;
  titleId: string;
  closeLabel?: string;
  onClose?: () => void;
}

export function DialogHeader(props: DialogHeaderProps): React.JSX.Element {
  return (
    <div className="mb-3 flex min-h-11 items-center justify-between gap-3">
      <h2
        id={props.titleId}
        className="text-xl font-bold text-purple-950">
        {props.title}
      </h2>
      {!!props.onClose && (
        <button
          aria-label={props.closeLabel ?? 'Fechar'}
          className="grid size-11 shrink-0 place-items-center rounded-full text-purple-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
          type="button"
          onClick={props.onClose}>
          <X
            aria-hidden="true"
            className="size-6"
          />
        </button>
      )}
    </div>
  );
}
