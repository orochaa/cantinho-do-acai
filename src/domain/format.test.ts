import { parseCurrency, singularOrPlural, slang } from '@/domain/format';

describe(singularOrPlural.name, () => {
  it('should use the singular form for one', () => {
    expect(singularOrPlural(1, 'item', 'itens')).toBe('1 item');
  });

  it('should use the plural form for every other count', () => {
    expect(singularOrPlural(0, 'item', 'itens')).toBe('0 itens');
    expect(singularOrPlural(2, 'item', 'itens')).toBe('2 itens');
  });
});

describe('domain formatting helpers', () => {
  it('should create URL-safe slugs from accented names and whitespace', () => {
    expect(slang('  Açaí  Médio  ')).toBe('acai-medio');
  });

  it('should parse Brazilian currency and malformed values safely', () => {
    expect(parseCurrency('R$ 1.234,56')).toBe(1.234);
    expect(parseCurrency('')).toBe(0);
    expect(parseCurrency('not a price')).toBe(0);
  });
});
