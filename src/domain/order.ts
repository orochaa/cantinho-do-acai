import { parseCurrency } from '@/domain/format';

export interface OrderItemInput {
  product: Product;
  options: Array<Option>;
  count: number;
  observation?: string;
}

export interface OrderItem extends OrderItemInput {
  total: number;
}

export interface Order {
  items: ReadonlyArray<OrderItem>;
  total: number;
}

export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Dinheiro';

export type FulfillmentMethod =
  | 'Retirada no local'
  | 'Entrega (com taxa de entrega)';

export interface DeliveryAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export interface OrderCheckoutInput {
  clientName: string;
  fulfillment: FulfillmentMethod;
  address: DeliveryAddress | null;
  addressNumber: string;
  paymentMethod: PaymentMethod | null;
  cashValue: string;
  orderTotal: number;
}

const isDelivery = (fulfillment: FulfillmentMethod): boolean =>
  fulfillment === 'Entrega (com taxa de entrega)';

const hasCompleteAddress = (address: DeliveryAddress): boolean =>
  [
    address.cep,
    address.state,
    address.city,
    address.neighborhood,
    address.street,
  ].every(value => value.trim().length > 0);

export function validateOrder(input: OrderCheckoutInput): string | null {
  if (!input.clientName.trim()) {
    return 'Por favor, informe o seu nome.';
  }

  if (
    isDelivery(input.fulfillment) &&
    !(input.address && hasCompleteAddress(input.address))
  ) {
    return 'Por favor, informe o seu CEP.';
  }

  if (isDelivery(input.fulfillment) && !input.addressNumber.trim()) {
    return 'Por favor, informe o número do seu endereço.';
  }

  if (!input.paymentMethod) {
    return 'Por favor, selecione uma forma de pagamento.';
  }

  if (input.paymentMethod === 'Dinheiro') {
    const cash = parseCurrency(input.cashValue);

    if (Number.isNaN(cash) || cash < input.orderTotal) {
      return 'Por favor, informe um valor em dinheiro igual ou superior ao total do pedido.';
    }
  }

  return null;
}

export function calculateOrderChange(
  cashValue: string,
  orderTotal: number,
): number {
  const cash = parseCurrency(cashValue);

  return Number.isNaN(cash) ? 0 : Math.max(cash - orderTotal, 0);
}

const getOptionPrice = (option: Option): number =>
  (option.price ?? 0) * option.count;

export function calculateOrderItemTotal(item: OrderItemInput): number {
  const optionsTotal = item.options.reduce(
    (total, option) => total + getOptionPrice(option),
    0,
  );

  return (item.product.price + optionsTotal) * item.count;
}

export function createOrderItem(input: OrderItemInput): OrderItem {
  const options = input.options.filter(option => option.count > 0);
  const item = { ...input, options };

  return { ...item, total: calculateOrderItemTotal(item) };
}

export function updateOrderItemQuantity(
  item: OrderItem,
  count: number,
): OrderItem {
  return createOrderItem({ ...item, count });
}

export function calculateOrderTotal(items: ReadonlyArray<OrderItem>): number {
  return items.reduce((total, item) => total + item.total, 0);
}

export function createOrder(items: ReadonlyArray<OrderItem>): Order {
  return { items, total: calculateOrderTotal(items) };
}
