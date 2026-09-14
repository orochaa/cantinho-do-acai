import { companyInfo } from '@/domain/company';

export function CartPickupNotice(): React.JSX.Element {
  const { address } = companyInfo;

  return (
    <div className="border-l-4 border-purple-200 py-1 pl-3 text-pretty text-zinc-700">
      <p className="font-semibold text-zinc-900">Retirada no local</p>
      <p>Retirar pedido no local, no endereço abaixo:</p>
      <p>
        Endereço: {address.street}, {address.number} - {address.neighborhood},{' '}
        {address.city} - {address.state}
      </p>
    </div>
  );
}
