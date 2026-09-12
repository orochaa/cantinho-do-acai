import { Button } from '@/components/button';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';
import { ExternalLink, X } from 'lucide-react';

export function ConfirmationModal(
  props: Pick<CartCheckoutState, 'goToWhatsappLink' | 'setModalOpen'>,
): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: Modal backdrop closes the dialog. */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: Modal backdrop closes the dialog. */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: The close button provides keyboard access. */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => props.setModalOpen(false)}
      />
      <div className="z-10 w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start">
          <h2 className="grow text-center text-2xl font-semibold">ATENÇÃO</h2>
          <button
            type="button"
            className="rounded-sm p-0.5 text-gray-600 hover:text-zinc-800 active:bg-zinc-200"
            title="Fechar modal"
            onClick={() => props.setModalOpen(false)}>
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
              window.open(
                props.goToWhatsappLink,
                '_blank',
                'noopener,noreferrer',
              )
            }>
            <ExternalLink className="size-5" />
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
