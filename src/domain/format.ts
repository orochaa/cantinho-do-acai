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

export function parseCurrency(value: string): number {
  return Number.parseFloat(
    value.replace(',', '.').replaceAll(/[^\d.-]/g, '') || '0',
  );
}
