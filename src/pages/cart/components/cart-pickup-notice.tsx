import { companyInfo } from '@/domain/company';

export function CartPickupNotice(): React.JSX.Element {
  const { address } = companyInfo;

  return (
    <div className="rounded-sm bg-yellow-100 p-4 text-pretty text-yellow-800">
      <p className="font-semibold">Atenção:</p>
      <p>Retirar pedido no local, no endereço abaixo:</p>
      <p>
        Endereço: {address.street}, {address.number} - {address.neighborhood},{' '}
        {address.city} - {address.state}
      </p>
    </div>
  );
}
