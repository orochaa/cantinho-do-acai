export interface CompanyCoordinates {
  readonly lat: number;
  readonly lon: number;
}

export interface CompanyInfo {
  readonly name: string;
  readonly whatsappPhone: string;
  readonly coordinates: CompanyCoordinates;
}

export const companyInfo: CompanyInfo = {
  name: 'Cantinho do Açaí',
  whatsappPhone: '5554984312998',
  coordinates: {
    lat: -29.190_012_3,
    lon: -51.213_029_1,
  },
};
