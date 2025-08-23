interface CepAddress {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export async function getCepAddress(cep: string): Promise<CepAddress> {
  return fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`).then(res => {
    if (!res.ok) {
      console.error(
        `Error fetching CEP ${cep}: ${res.status} ${res.statusText}`
      )

      throw new Error('CEP not found')
    }

    return res.json() as unknown as CepAddress
  })
}
