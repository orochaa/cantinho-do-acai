import {
  Banner,
  Description,
  OrderButton,
  OrderComplements,
} from '../components'
import { useCart } from '../context'
import { felicidadeCategory, formatCurrency } from '../data'
import { useComplements, useProduct, useTotal } from '../hooks'

export function FelicidadePage(): React.JSX.Element {
  const copo = useProduct(felicidadeCategory)

  const { addCartEvent } = useCart()

  const [size, addSizeEvent] = useComplements(
    felicidadeCategory.size.map(item =>
      item.price ? item : { ...item, count: 1 }
    ),
    1
  )

  const total = useTotal(copo.price, ...size.complements)

  return (
    <div>
      <Banner img={copo.img} name={copo.name} imgClassName="object-top" />
      <div className="mx-auto w-11/12 max-w-4xl">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{copo.description}</Description>
            {!!copo.quantity && <p>Contém aproximadamente {copo.quantity}g</p>}
            <span>
              {copo.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${copo.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(copo.price)}
            </span>
          </div>
        </div>

        <OrderComplements
          addComplementEvent={addSizeEvent}
          ctx={size}
          title="Tamanho:"
        />
        <OrderButton
          product={copo}
          totalPrice={total}
          multiple
          order={quantity =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: copo,
                complements: size.complements,
                quantity,
              },
            })
          }
        />
      </div>
      <span className="block h-20" />
    </div>
  )
}
