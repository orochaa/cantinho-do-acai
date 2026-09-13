export interface CompanyCoordinates {
  readonly lat: number;
  readonly lon: number;
}

export interface CompanyAddress {
  readonly street: string;
  readonly number: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly state: string;
}

export interface CompanyInfo {
  readonly name: string;
  readonly whatsappPhone: string;
  readonly address: CompanyAddress;
  readonly coordinates: CompanyCoordinates;
}

export const companyInfo: CompanyInfo = {
  name: 'Cantinho do Açaí',
  whatsappPhone: '5554984312998',
  address: {
    street: 'Rua Claudino Cirilo Zeni',
    number: '27',
    neighborhood: 'Charqueadas',
    city: 'Caxias do Sul',
    state: 'RS',
  },
  coordinates: {
    lat: -29.1894,
    lon: -51.213_72,
  },
};
