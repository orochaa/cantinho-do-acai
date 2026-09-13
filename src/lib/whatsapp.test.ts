import { createOrder, createOrderItem } from '@/domain/order';
import { createOrderCheckoutWhatsAppLink } from '@/lib/whatsapp';
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

const order = createOrder([
  createOrderItem({
    count: 2,
    observation: 'Sem gelo\nEntregar no balcão',
    options: [
      { name: 'Banana', count: 1 },
      { name: 'Leite ninho', count: 2, price: 2 },
    ],
    product,
  }),
]);

const getMessage = (link: string): string =>
  new URL(link).searchParams.get('text') ?? '';

describe('WhatsApp', () => {
  describe(createOrderCheckoutWhatsAppLink.name, () => {
    it('should create a complete Retirada message without delivery or cash details', () => {
      const message = getMessage(
        createOrderCheckoutWhatsAppLink({
          order,
          clientName: 'Maria & João',
          fulfillment: 'Retirada no local',
          address: null,
          addressNumber: '',
          addressComplement: '',
          addressReference: '',
          paymentMethod: 'PIX',
          cashValue: '',
          includeCutlery: true,
        }),
      );

      expect(message).toContain('*2 - Test product* - R$\u00a010,00');
      expect(message).toContain('- 2 - Leite ninho - R$\u00a02,00');
      expect(message).toContain('*Observação:*\nSem gelo\nEntregar no balcão');
      expect(message).toContain('Retirada no local');
      expect(message).toContain('Incluir talheres, por favor.');
      expect(message).toContain('*Forma de Pagamento:* PIX');
      expect(message).toContain('*Total:* R$\u00a028,00');
      expect(message).toContain('Nome: Maria & João');
      expect(message).not.toContain('Endereço:');
      expect(message).not.toContain('Troco:');
    });

    it('should create an Entrega message with address and cash details', () => {
      const message = getMessage(
        createOrderCheckoutWhatsAppLink({
          order,
          clientName: 'Maria',
          fulfillment: 'Entrega (com taxa de entrega)',
          address: {
            cep: '95000-000',
            state: 'RS',
            city: 'Caxias do Sul',
            neighborhood: 'Centro',
            street: 'Rua Teste',
          },
          addressNumber: '249',
          addressComplement: 'Apartamento 2',
          addressReference: 'Próximo à praça',
          paymentMethod: 'Dinheiro',
          cashValue: 'R$ 50,00',
          includeCutlery: false,
        }),
      );

      expect(message).toContain('Entrega (com taxa de entrega)');
      expect(message).toContain(
        'Endereço: Rua Teste, 249, Centro, Caxias do Sul - RS, 95000-000',
      );
      expect(message).toContain('Complemento: Apartamento 2');
      expect(message).toContain('Ponto de referência: Próximo à praça');
      expect(message).toContain('Taxa de entrega: A calcular');
      expect(message).toContain('*Forma de Pagamento:* Dinheiro');
      expect(message).toContain('Valor pago em dinheiro: R$\u00a050,00');
      expect(message).toContain('Troco: R$\u00a022,00');
      expect(message).not.toContain('Incluir talheres');
    });

    it('should encode the complete message in the WhatsApp link', () => {
      const link = createOrderCheckoutWhatsAppLink({
        order,
        clientName: 'Maria & João',
        fulfillment: 'Retirada no local',
        address: null,
        addressNumber: '',
        addressComplement: '',
        addressReference: '',
        paymentMethod: 'PIX',
        cashValue: '',
        includeCutlery: false,
      });
      const encodedMessage = new URL(link).searchParams.get('text');

      expect(encodedMessage).toContain('Maria & João');
      expect(link).toContain('text=');
      expect(link).not.toContain('Maria & João');
    });
  });
});
