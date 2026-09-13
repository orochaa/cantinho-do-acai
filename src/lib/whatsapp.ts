import { companyInfo } from '@/domain/company';
import { formatCurrency, parseCurrency } from '@/domain/format';
import type {
  DeliveryAddress,
  FulfillmentMethod,
  Order,
  OrderItem,
  PaymentMethod,
} from '@/domain/order';
import { calculateOrderChange } from '@/domain/order';

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
      parts.push(`*Observação:*\n${item.observation}`);
    }
  }
};

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

const appendFulfillmentDetails = (
  parts: Array<string>,
  input: WhatsAppOrderInput,
): void => {
  parts.push('', '*Opção de Entrega*');

  if (input.fulfillment === 'Entrega (com taxa de entrega)') {
    parts.push('Entrega (com taxa de entrega)');
    appendAddressDetails(parts, input);
    parts.push('Taxa de entrega: A calcular');
  } else {
    parts.push('Retirada no local');
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

const createOrderCheckoutWhatsAppMessage = (
  input: WhatsAppOrderInput,
): string => {
  const parts: Array<string> = [
    `Olá, ${companyInfo.name}!`,
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
};

export const createWhatsAppLink = (
  message: string,
  phone = companyInfo.whatsappPhone,
): string =>
  `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

export const createOrderCheckoutWhatsAppLink = (
  input: WhatsAppOrderInput,
  phone = companyInfo.whatsappPhone,
): string =>
  createWhatsAppLink(createOrderCheckoutWhatsAppMessage(input), phone);
