import { Button } from '@/components/button';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';
import { ExternalLink, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const trapDialogFocus = (
  event: KeyboardEvent,
  dialog: HTMLDivElement,
): void => {
  if (event.key !== 'Tab') {
    return;
  }
  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
  const first = focusableElements[0];
  const last = focusableElements.at(-1);
  if (!(first && last)) {
    return;
  }
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

export function ConfirmationModal(
  props: Pick<CartCheckoutState, 'goToWhatsappLink' | 'setModalOpen'>,
): React.JSX.Element {
  const { goToWhatsappLink, setModalOpen } = props;
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setModalOpen(false);
        return;
      }
      // biome-ignore lint/suspicious/noUnnecessaryConditions: The ref is populated after mount.
      if (dialogRef.current) {
        trapDialogFocus(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [setModalOpen]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation">
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal backdrop closes the dialog. */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: Modal backdrop closes the dialog. */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: The close button provides keyboard access. */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setModalOpen(false)}
      />
      <div
        ref={dialogRef}
        className="z-10 w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title">
        <div className="flex items-start">
          <h2
            id="confirmation-modal-title"
            className="grow text-center text-2xl font-semibold">
            ATENÇÃO
          </h2>
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-sm p-0.5 text-gray-600 hover:text-zinc-800 active:bg-zinc-200"
            aria-label="Fechar modal"
            title="Fechar modal"
            onClick={() => setModalOpen(false)}>
            <X className="size-5" />
          </button>
        </div>
        <p className="my-4">
          Ao clicar no botão <b>&quot;Continuar&quot;</b>, você será
          redirecionado para o WhatsApp do Cantinho do Açaí, com uma mensagem
          pré-escrita contendo todos os detalhes do seu pedido. Basta enviá-la
          para finalizar seu pedido! 😁
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="cancel"
            className="border-zinc-300 transition hover:border-zinc-500"
            onClick={() => props.setModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="confirm"
            className="items-start border-zinc-300 bg-green-500 hover:border-zinc-500"
            onClick={() =>
              window.open(goToWhatsappLink, '_blank', 'noopener,noreferrer')
            }>
            <ExternalLink className="size-5" />
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
