import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCepAddress } from './brasil-api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe(getCepAddress.name, () => {
  it('should return a valid CEP address from the transport', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            cep: '95000000',
            state: 'RS',
            city: 'Caxias do Sul',
            neighborhood: 'Centro',
            street: 'Rua Olinda',
            service: 'correios',
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(getCepAddress('95000000')).resolves.toEqual({
      cep: '95000000',
      state: 'RS',
      city: 'Caxias do Sul',
      neighborhood: 'Centro',
      street: 'Rua Olinda',
      service: 'correios',
    });
  });

  it('should reject a failed transport response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    await expect(getCepAddress('95000000')).rejects.toThrow('CEP not found');
  });

  it('should reject a malformed transport response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ cep: '95000000', city: 'Caxias do Sul' }),
          {
            status: 200,
          },
        ),
      ),
    );

    await expect(getCepAddress('95000000')).rejects.toThrow(
      'Invalid CEP response',
    );
  });
});
