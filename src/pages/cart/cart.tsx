import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { useCartCheckout } from '@/hooks/use-cart-checkout';
import { CheckoutPaymentEnum } from '@/lib/checkout-state';
import { formatCurrency } from '@/lib/format';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  return (
    <>
      <Seo
        title="Pedido - Cantinho do Açaí"
        description="Confira o seu pedido e finalize a sua compra no Cantinho do Açaí."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 py-20">
        <div className="flex flex-col gap-8">
          <Container>
            <h2 className="ml-1 text-xl font-bold text-white">
              Pedido: {formatCurrency(checkout.orderTotal)}
            </h2>
            <CartItems
              cart={cart}
              onQuantityChange={(item, count) =>
                addCartEvent({ type: 'update-quantity', id: item.id, count })
              }
              onRemove={item => addCartEvent({ type: 'remove', id: item.id })}
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
      </div>
    </>
  );
}
