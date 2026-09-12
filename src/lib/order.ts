import { formatCurrency, parseCurrency } from '@/lib/format';

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
  items: Array<OrderItem>;
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

export interface WhatsAppOrderInput {
  order: Order;
  clientName: string;
  fulfillment: FulfillmentMethod;
  address: DeliveryAddress | null;
  addressNumber: string;
  addressComplement: string;
  addressReference: string;
  paymentMethod: PaymentMethod;
  cashValue: string;
  includeCutlery: boolean;
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

export function calculateOrderTotal(items: Array<OrderItem>): number {
  return items.reduce((total, item) => total + item.total, 0);
}

export function createOrder(items: Array<OrderItem>): Order {
  return { items, total: calculateOrderTotal(items) };
}

const isCashPayment = (paymentMethod: PaymentMethod): boolean =>
  paymentMethod === 'Dinheiro';

const appendOrderItems = (
  parts: Array<string>,
  items: Array<OrderItem>,
): void => {
  for (const item of items) {
    const itemParts = [
      `*${item.count} - ${item.product.name}* ${
        item.product.price ? `- ${formatCurrency(item.product.price)}` : ''
      }`,
      ...item.options.map(
        option =>
          `- ${option.count} - ${option.name}${
            option.price ? ` - ${formatCurrency(option.price)}` : ''
          }`,
      ),
    ];

    parts.push(itemParts.filter(Boolean).join('\n'));

    if (item.observation) {
      parts.push(`*Observação:*
${item.observation}`);
    }
  }
};

function appendFulfillmentDetails(
  parts: Array<string>,
  input: WhatsAppOrderInput,
): void {
  parts.push('', '*Opção de Entrega*');

  if (input.fulfillment === 'Entrega (com taxa de entrega)') {
    parts.push('Entrega (com taxa de entrega)');
    appendAddressDetails(parts, input);
    parts.push('Taxa de entrega: A calcular');
  } else {
    parts.push('Retirada no local');
  }
}

const appendAddressDetails = (
  parts: Array<string>,
  input: WhatsAppOrderInput,
): void => {
  if (input.address && input.addressNumber) {
    const { address, addressNumber } = input;
    parts.push(
      `Endereço: ${address.street}, ${addressNumber}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`,
    );

    if (input.addressComplement) {
      parts.push(`Complemento: ${input.addressComplement}`);
    }

    if (input.addressReference) {
      parts.push(`Ponto de referência: ${input.addressReference}`);
    }
  } else {
    parts.push('Endereço: (não informado por completo)');

    if (!input.address) {
      parts.push('- Faltando CEP');
    }

    if (!input.addressNumber) {
      parts.push('- Faltando número');
    }
  }
};

const appendPaymentDetails = (
  parts: Array<string>,
  input: WhatsAppOrderInput,
): void => {
  parts.push('', `*Forma de Pagamento:* ${input.paymentMethod}`);

  if (isCashPayment(input.paymentMethod)) {
    parts.push(
      `Valor pago em dinheiro: ${formatCurrency(parseCurrency(input.cashValue))}`,
      `Troco: ${formatCurrency(calculateOrderChange(input.cashValue, input.order.total))}`,
    );
  }
};

export function createWhatsAppMessage(input: WhatsAppOrderInput): string {
  const parts: Array<string> = [
    'Olá, Cantinho do Açaí!',
    'Gostaria de fazer um pedido:',
    '',
  ];

  appendOrderItems(parts, input.order.items);
  appendFulfillmentDetails(parts, input);
  parts.push('', `*Total:* ${formatCurrency(input.order.total)}`);

  if (input.includeCutlery) {
    parts.push('', 'Incluir talheres, por favor.');
  }

  appendPaymentDetails(parts, input);
  parts.push(
    '',
    `Nome: ${input.clientName}`,
    '',
    '👆 Por favor, envie-nos esta mensagem agora. Assim que recebermos, estaremos atendendo você.',
  );

  return parts.join('\n');
}

export function createWhatsAppLink(
  input: WhatsAppOrderInput,
  phone = '5554984312998',
): string {
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    createWhatsAppMessage(input),
  )}`;
}
