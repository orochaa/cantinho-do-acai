import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { DialogHeader } from '@/components/dialog-header';
import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import type { CartItem } from '@/domain/cart';
import { CheckoutPaymentEnum } from '@/domain/checkout-state';
import { formatCurrency } from '@/domain/format';
import { useCartCheckout } from '@/hooks/use-cart-checkout';
import { getProductPath } from '@/lib/navigation';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CartDeliveryAddress } from './components/cart-delivery-address';
import { CartIdentification } from './components/cart-identification';
import { CartItems } from './components/cart-items';
import { CartPickupNotice } from './components/cart-pickup-notice';
import { CashPayment } from './components/cash-payment';
import { ConfirmationModal } from './components/confirmation-modal';

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart();
  const checkout = useCartCheckout(cart);
  const navigate = useNavigate();
  const [pendingRemoval, setPendingRemoval] = useState<CartItem | null>(null);

  return (
    <>
      <Seo
        title="Pedido - Cantinho do Açaí"
        description="Confira o seu pedido e finalize a sua compra no Cantinho do Açaí."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 py-20">
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
            <div className="flex flex-col gap-8">
              <Container>
                <h2 className="ml-1 text-xl font-bold text-white">
                  Pedido: {formatCurrency(checkout.orderTotal)}
                </h2>
                <CartItems
                  cart={cart}
                  onRemove={item => setPendingRemoval(item)}
                  onEdit={item =>
                    navigate(getProductPath(item.product), {
                      state: { type: 'edit-cart-intent', item },
                    })
                  }
                />
              </Container>
              <CartIdentification {...checkout} />
              <SingleOptionSelector
                title="Precisa de talheres?"
                ctx={checkout.spoonOption}
                onSelectionChange={checkout.selectSpoonOption}
              />
              <SingleOptionSelector
                title="Opções de entrega"
                ctx={checkout.checkoutOption}
                onSelectionChange={checkout.selectCheckoutOption}
              />
              {!!checkout.isDelivery && <CartDeliveryAddress {...checkout} />}
              {!checkout.isDelivery && <CartPickupNotice />}
              <SingleOptionSelector
                title="Forma de pagamento"
                ctx={checkout.paymentMethod}
                onSelectionChange={checkout.selectPaymentMethod}
              />
              {checkout.paymentMethod.options.some(
                option =>
                  option.name === CheckoutPaymentEnum.Cash && option.isSelected,
              ) && <CashPayment {...checkout} />}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                variant="cancel"
                onClick={() => navigate('/')}>
                Continuar Escolhendo
              </Button>
              <Button
                variant="confirm"
                onClick={checkout.confirmOrder}>
                Confirmar Pedido {formatCurrency(checkout.orderTotal)}
              </Button>
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
