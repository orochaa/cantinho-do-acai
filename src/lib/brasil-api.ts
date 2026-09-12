export interface CepAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export async function getCepAddress(cep: string): Promise<CepAddress> {
  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

  if (!res.ok) {
    console.error(`Error fetching CEP ${cep}: ${res.status} ${res.statusText}`);

    throw new Error('CEP not found');
  }

  const data: unknown = await res.json();

  if (!isCepAddress(data)) {
    throw new Error('Invalid CEP response');
  }

  return data;
}

function isCepAddress(value: unknown): value is CepAddress {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const address = value as Record<string, unknown>;

  return ['cep', 'state', 'city', 'neighborhood', 'street', 'service'].every(
    key => typeof address[key] === 'string',
  );
}
