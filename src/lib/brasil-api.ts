interface CepAddress {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export async function getCepAddress(cep: string): Promise<CepAddress> {
  return fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`)
    .then(async res => res.json())
    .then(data => {
      if (data && typeof data === 'object' && 'errors' in data) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw data
      }

      return data as CepAddress
    })
}
