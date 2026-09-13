import { parseCurrency, slang } from '@/domain/format';

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
