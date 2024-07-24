import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { acaiCategory } from '../data'
import { useComplements, useProduct, useTotal } from '../hooks'

export function AcaiPage(): React.JSX.Element {
  const acai = useProduct(acaiCategory)

  const { addCartEvent } = useCart()

  const [type, addTypeEvent] = useComplements(
    acai.type.map((name, i) => ({ name, count: i === 0 ? 1 : 0 })),
    1
  )

  const [complements, addComplementEvent] = useComplements(
    acai.complements.map(name => ({ name })),
    acai.complementsLimit
  )

  const [extras, addExtraEvent] = useComplements(
    Object.entries(acai.extras).map(([name, price]) => ({ name, price })),
    acai.extrasLimit
  )

  const total = useTotal(acai.price, ...extras.complements)

  return (
    <>
      <div className="flex flex-col gap-8">
        <OrderComplements
          addComplementEvent={addTypeEvent}
          ctx={type}
          title="Tipo de Açaí:"
        />
        <OrderComplements
          addComplementEvent={addComplementEvent}
          ctx={complements}
          title="Acompanhamentos:"
        />
        <OrderComplements
          addComplementEvent={addExtraEvent}
          ctx={extras}
          title="Adicionais:"
        />
      </div>
      <OrderButton
        product={acai}
        totalPrice={total}
        multiple
        order={quantity =>
          addCartEvent({
            type: 'ADD',
            item: {
              product: acai,
              complements: [type, complements, extras]
                .flatMap(i => i.complements)
                .filter(i => i.count > 0)
                .map(i => ({
                  count: i.count,
                  name: i.name,
                  price: i.price,
                })),
              quantity,
            },
          })
        }
      />
    </>
  )
}
