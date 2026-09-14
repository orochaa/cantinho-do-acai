import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { DialogHeader } from '@/components/dialog-header';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import type { CartItem } from '@/domain/cart';
import { CheckoutPaymentEnum } from '@/domain/checkout-state';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import { useCartCheckout } from '@/hooks/use-cart-checkout';
import { getProductPath } from '@/lib/navigation';
import {
  Check,
  ChevronDown,
  ClipboardList,
  MapPin,
  ShoppingBag,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CartDeliveryAddress } from './components/cart-delivery-address';
import { CartIdentification } from './components/cart-identification';
import { CartItems } from './components/cart-items';
import { CartPickupNotice } from './components/cart-pickup-notice';
import { CashPayment } from './components/cash-payment';
import { ConfirmationModal } from './components/confirmation-modal';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Checkout page coordinates the complete multi-step flow.
export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart();
  const checkout = useCartCheckout(cart);
  const navigate = useNavigate();
  const [pendingRemoval, setPendingRemoval] = useState<CartItem | null>(null);
  const hasAddress =
    checkout.address !== null && checkout.addressNumber.trim().length > 0;
  const selectedPayment = checkout.paymentMethod.options.find(
    option => option.isSelected,
  );
  const hasPayment =
    selectedPayment !== undefined &&
    (selectedPayment.name !== CheckoutPaymentEnum.Cash ||
      checkout.cashValue.trim().length > 0);
  const initialStep = checkout.clientName.trim()
    ? checkout.isDelivery && !hasAddress
      ? 3
      : hasPayment
        ? 0
        : 4
    : 1;
  const [activeStep, setActiveStep] = useState(initialStep);

  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      return checkout.clientName.trim().length > 0;
    }
    if (step === 2) {
      return checkout.checkoutOption.isSelected;
    }
    if (step === 3) {
      return (
        !checkout.isDelivery ||
        (checkout.address !== null && checkout.addressNumber.trim().length > 0)
      );
    }
    const selectedPayment = checkout.paymentMethod.options.find(
      option => option.isSelected,
    );
    return (
      selectedPayment !== undefined &&
      (selectedPayment.name !== CheckoutPaymentEnum.Cash ||
        checkout.cashValue.trim().length > 0)
    );
  };

  const stepSection = (props: {
    step: number;
    title: string;
    summary: string;
    content: React.ReactNode;
    icon: React.ReactNode;
    nextLabel?: string;
  }): React.JSX.Element => (
    <section className="overflow-hidden rounded-2xl border border-white/15 bg-white shadow-lg shadow-purple-950/10">
      <button
        type="button"
        className="flex w-full items-center gap-3 border border-transparent p-4 text-left transition-colors focus:outline-none focus-visible:border-purple-700 focus-visible:bg-purple-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
        aria-expanded={activeStep === props.step}
        aria-controls={`cart-step-content-${props.step}`}
        onClick={() =>
          setActiveStep(currentStep =>
            currentStep === props.step ? 0 : props.step,
          )
        }>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-800">
          {isStepComplete(props.step) && activeStep !== props.step ? (
            <Check className="size-5" />
          ) : (
            props.icon
          )}
        </span>
        <span className="min-w-0 grow">
          <span className="block text-xs font-bold tracking-wider text-purple-700 uppercase">
            Etapa {props.step}
          </span>
          <span className="block font-bold text-zinc-900">{props.title}</span>
          <span className="block truncate text-sm text-zinc-500">
            {props.summary}
          </span>
        </span>
        <ChevronDown
          className={`size-5 shrink-0 text-zinc-500 transition-transform ${activeStep === props.step ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`cart-step-content-${props.step}`}
        className={`border-t border-zinc-100 p-4 ${activeStep === props.step ? '' : 'hidden'}`}>
        {props.content}
        {props.step < 4 && (
          <Button
            variant="checkout"
            className="mt-4"
            onClick={() => setActiveStep(props.step + 1)}>
            {props.nextLabel ?? 'Avançar etapa'}
          </Button>
        )}
      </div>
    </section>
  );

  return (
    <>
      <Seo
        title="Pedido - Cantinho do Açaí"
        description="Confira o seu pedido e finalize a sua compra no Cantinho do Açaí."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 max-w-6xl py-12 sm:py-16">
        {cart.length === 0 ? (
          <Container>
            <div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-sm bg-white p-6 text-center">
              <h1 className="text-2xl font-bold text-purple-950">
                Seu carrinho está vazio
              </h1>
              <p className="text-zinc-700">
                Escolha seus produtos favoritos para começar um pedido.
              </p>
              <Button
                variant="confirm"
                onClick={() => navigate('/')}>
                Ver cardápio
              </Button>
            </div>
          </Container>
        ) : (
          <>
            <header className="mb-8 text-white">
              <p className="mb-2 text-sm font-bold tracking-[0.18em] text-amber-300 uppercase">
                Finalização rápida
              </p>
              <h1 className="text-3xl font-black sm:text-4xl">
                Finalize seu pedido
              </h1>
              <p className="mt-2 max-w-xl text-white/80">
                Você decide a ordem: abra qualquer etapa, revise os dados e
                envie quando estiver tudo certo.
              </p>
            </header>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
              <div className="flex flex-col gap-3">
                {stepSection({
                  step: 1,
                  title: 'Seu nome e talheres',
                  summary: `${checkout.clientName || 'Nome não informado'} · ${checkout.spoonOption.options.find(option => option.isSelected)?.name}`,
                  icon: <ClipboardList className="size-5" />,
                  nextLabel: 'Ir para recebimento',
                  content: (
                    <div className="flex flex-col gap-6">
                      <CartIdentification {...checkout} />
                      <div className="flex flex-col gap-3">
                        <SingleOptionSelector
                          title="Precisa de talheres?"
                          ctx={checkout.spoonOption}
                          onSelectionChange={checkout.selectSpoonOption}
                          bare
                        />
                        <button
                          type="button"
                          className="self-start rounded text-sm text-purple-800 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                          onClick={checkout.forgetSavedDetails}>
                          Esquecer dados salvos
                        </button>
                      </div>
                    </div>
                  ),
                })}
                {stepSection({
                  step: 2,
                  title: 'Como você receberá?',
                  summary: checkout.fulfillment,
                  icon: <ShoppingBag className="size-5" />,
                  nextLabel: 'Ir para endereço',
                  content: (
                    <SingleOptionSelector
                      title="Opções de entrega"
                      ctx={checkout.checkoutOption}
                      onSelectionChange={checkout.selectCheckoutOption}
                      bare
                    />
                  ),
                })}
                {checkout.isDelivery
                  ? stepSection({
                      step: 3,
                      title: 'Endereço de entrega',
                      summary: checkout.address
                        ? `${checkout.address.street}, ${checkout.addressNumber}`
                        : 'Endereço não informado',
                      icon: <MapPin className="size-5" />,
                      nextLabel: 'Ir para pagamento',
                      content: <CartDeliveryAddress {...checkout} />,
                    })
                  : stepSection({
                      step: 3,
                      title: 'Endereço de retirada',
                      summary: 'Retirada no local',
                      icon: <MapPin className="size-5" />,
                      nextLabel: 'Ir para pagamento',
                      content: <CartPickupNotice />,
                    })}
                {stepSection({
                  step: 4,
                  title: 'Forma de pagamento',
                  summary: `${checkout.paymentMethod.options.find(option => option.isSelected)?.name}${checkout.paymentMethod.options.some(option => option.name === CheckoutPaymentEnum.Cash && option.isSelected) ? ` · ${checkout.cashValue || 'troco não informado'}` : ''}`,
                  icon: <Wallet className="size-5" />,
                  content: (
                    <div className="flex flex-col gap-6">
                      <SingleOptionSelector
                        title="Forma de pagamento"
                        ctx={checkout.paymentMethod}
                        onSelectionChange={checkout.selectPaymentMethod}
                        bare
                      />
                      {checkout.paymentMethod.options.some(
                        option =>
                          option.name === CheckoutPaymentEnum.Cash &&
                          option.isSelected,
                      ) && <CashPayment {...checkout} />}
                      <Button
                        variant="checkout"
                        className="mt-2"
                        onClick={() => setActiveStep(0)}>
                        <Check className="size-4" />
                        Confirmar pagamento
                      </Button>
                    </div>
                  ),
                })}
              </div>
              <aside className="rounded-2xl bg-white p-4 shadow-xl shadow-purple-950/20 lg:sticky lg:top-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-purple-700 uppercase">
                      Resumo
                    </p>
                    <h2 className="text-xl font-bold text-zinc-900">
                      Seu pedido
                    </h2>
                  </div>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-900">
                    {singularOrPlural(
                      cart.reduce((total, item) => total + item.count, 0),
                      'item',
                      'itens',
                    )}
                  </span>
                </div>
                <CartItems
                  cart={cart}
                  onRemove={item => setPendingRemoval(item)}
                  onEdit={item =>
                    navigate(getProductPath(item.product), {
                      state: { type: 'edit-cart-intent', item },
                    })
                  }
                />
                <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 text-lg font-black text-zinc-900">
                  <span>Total</span>
                  <span>{formatCurrency(checkout.orderTotal)}</span>
                </div>
                <Button
                  variant="confirm"
                  className="mt-4 min-h-12 w-full text-base font-bold"
                  onClick={checkout.confirmOrder}>
                  Confirmar Pedido {formatCurrency(checkout.orderTotal)}
                </Button>
                <Button
                  variant="cancel"
                  className="mt-2 min-h-11 w-full rounded-xl border-zinc-200 text-zinc-700"
                  onClick={() => navigate('/')}>
                  Continuar escolhendo
                </Button>
              </aside>
            </div>
            {!!checkout.modalOpen && <ConfirmationModal {...checkout} />}
            <ResponsiveDialog
              labelledBy="remove-cart-item-title"
              open={pendingRemoval !== null}
              onClose={() => setPendingRemoval(null)}>
              <DialogHeader
                title="Remover item?"
                titleId="remove-cart-item-title"
                onClose={() => setPendingRemoval(null)}
              />
              <p className="text-zinc-700">
                Deseja remover {pendingRemoval?.product.name} do seu pedido?
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <Button
                  variant="cancel"
                  onClick={() => setPendingRemoval(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="confirm"
                  onClick={() => {
                    if (pendingRemoval) {
                      addCartEvent({ type: 'remove', id: pendingRemoval.id });
                    }
                    setPendingRemoval(null);
                  }}>
                  Remover
                </Button>
              </div>
            </ResponsiveDialog>
          </>
        )}
      </div>
    </>
  );
}
