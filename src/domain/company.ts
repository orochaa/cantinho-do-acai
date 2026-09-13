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
  readonly instagramUrl: string;
  readonly googleMapsUrl: string;
  readonly whatsappPhone: string;
  readonly address: CompanyAddress;
  readonly coordinates: CompanyCoordinates;
}

export const companyInfo: CompanyInfo = {
  name: 'Cantinho do Açaí',
  instagramUrl:
    'https://www.instagram.com/cantinho_do_acaiiii?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==',
  googleMapsUrl: 'https://maps.app.goo.gl/53GFMESGFz57tt9w9',
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
