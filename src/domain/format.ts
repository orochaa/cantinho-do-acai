export function slang(data: string): string {
  return encodeURI(
    data
      .trim()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036F]/g, '')
      .toLowerCase()
      .replaceAll(/\s+/g, '-'),
  );
}

export function formatCurrency(value: string | number): string {
  return Number(value).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function singularOrPlural(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function parseCurrency(value: string): number {
  return Number.parseFloat(
    value.replace(',', '.').replaceAll(/[^\d.-]/g, '') || '0',
  );
}
