import { useToast } from '@/context/toast-provider';
import { formatCurrency } from '@/domain/format';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './button';
import { QuantityStepper } from './quantity-stepper';

export interface OrderButtonProps {
  product: Product;
  multiple?: boolean;
  totalPrice: number;
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  validate?: () => string | undefined;
  order: (count: number) => void;
  initialCount?: number;
}

export function OrderButton(props: OrderButtonProps): React.JSX.Element {
  const { product, totalPrice, validate, order, multiple } = props;

  const [count, setCount] = useState(props.initialCount ?? 1);

  useEffect(() => {
    setCount(props.initialCount ?? 1);
  }, [props.initialCount]);

  const toast = useToast();

  const addOrder = useCallback(() => {
    const error = validate?.();

    if (typeof error === 'string' && error.trim()) {
      toast.error({ description: error });
    } else {
      order(count);
    }
  }, [validate, toast, order, count]);

  return (
    <div className="mt-8 flex gap-2">
      {!!multiple && (
        <QuantityStepper
          count={count}
          decreaseDisabled={count === 1}
          decreaseLabel={`Diminuir quantidade de ${product.name}`}
          decreaseTitle="Diminuir quantidade"
          increaseLabel={`Aumentar quantidade de ${product.name}`}
          increaseTitle="Aumentar quantidade"
          onDecrease={() => setCount(current => current - 1)}
          onIncrease={() => setCount(current => current + 1)}
        />
      )}
      <Button
        variant="confirm"
        className="grow"
        onClick={addOrder}>
        Adicionar ao pedido · {formatCurrency(totalPrice * count)}
      </Button>
    </div>
  );
}
