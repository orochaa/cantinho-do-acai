import {
  calculateOrderChange,
  calculateOrderItemTotal,
  calculateOrderTotal,
  createOrder,
  createOrderItem,
  updateOrderItemQuantity,
  validateOrder,
} from '@/lib/order';
import { describe, expect, it } from 'vitest';

const product: Product = {
  description: 'Test product',
  fullPrice: 12,
  img: '/img/test-product.png',
  name: 'Test product',
  people: 1,
  price: 10,
  slang: 'produto-de-teste',
};

const input = {
  count: 1,
  options: [
    { name: 'Included topping', count: 2 },
    { name: 'Paid extra', count: 1, price: 3 },
    { name: 'Zero-count option', count: 0, price: 99 },
    { name: 'Free option', count: 1, price: 0 },
    { name: 'Negative option', count: 1, price: -2 },
  ],
  product,
};

describe('Order pricing', () => {
  it('should calculate an order item from product and options', () => {
    expect(createOrderItem(input)).toEqual({
      ...input,
      options: [
        { name: 'Included topping', count: 2 },
        { name: 'Paid extra', count: 1, price: 3 },
        { name: 'Free option', count: 1, price: 0 },
        { name: 'Negative option', count: 1, price: -2 },
      ],
      total: 11,
    });
  });

  it('should retain zero-price options and subtract negative prices', () => {
    const item = createOrderItem({
      ...input,
      options: [
        { name: 'Free', count: 1, price: 0 },
        { name: 'Negative', count: 1, price: -4 },
      ],
    });

    expect(item.total).toBe(6);
    expect(item.options).toHaveLength(2);
  });

  it('should recalculate an order item when its quantity changes', () => {
    const item = createOrderItem(input);

    expect(updateOrderItemQuantity(item, 3).total).toBe(33);
  });

  it('should calculate the order total from its order items', () => {
    const first = createOrderItem(input);
    const second = createOrderItem({ ...input, count: 2 });

    expect(calculateOrderItemTotal(input)).toBe(11);
    expect(calculateOrderTotal([first, second])).toBe(33);
    expect(createOrder([first, second])).toEqual({
      items: [first, second],
      total: 33,
    });
  });
});

describe('Order checkout validation', () => {
  const validInput = {
    clientName: 'Maria',
    fulfillment: 'Retirada no local' as const,
    address: null,
    addressNumber: '',
    paymentMethod: 'PIX' as const,
    cashValue: '',
    orderTotal: 11,
  };

  it('should accept a valid pickup order', () => {
    expect(validateOrder(validInput)).toBeNull();
  });

  it('should require complete delivery information', () => {
    expect(
      validateOrder({
        ...validInput,
        fulfillment: 'Entrega (com taxa de entrega)',
      }),
    ).toBe('Por favor, informe o seu CEP.');

    expect(
      validateOrder({
        ...validInput,
        fulfillment: 'Entrega (com taxa de entrega)',
        address: {
          cep: '95000000',
          state: 'RS',
          city: 'Caxias do Sul',
          neighborhood: 'Centro',
          street: 'Rua Teste',
        },
        addressNumber: ' ',
      }),
    ).toBe('Por favor, informe o número do seu endereço.');
  });

  it('should reject missing payment methods and insufficient cash', () => {
    expect(validateOrder({ ...validInput, paymentMethod: null })).toBe(
      'Por favor, selecione uma forma de pagamento.',
    );
    expect(
      validateOrder({
        ...validInput,
        paymentMethod: 'Dinheiro',
        cashValue: 'R$ 5,00',
      }),
    ).toBe(
      'Por favor, informe um valor em dinheiro igual ou superior ao total do pedido.',
    );
  });

  it('should calculate non-negative change from cash paid', () => {
    expect(calculateOrderChange('R$ 20,00', 11)).toBe(9);
    expect(calculateOrderChange('R$ 5,00', 11)).toBe(0);
    expect(calculateOrderChange('', 11)).toBe(0);
  });
});
