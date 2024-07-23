import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import type { Acai } from '../data'
import { acaiCategory, slang } from '../data'
import { useComplements } from '../hooks'

export function AcaiPage(): React.JSX.Element {
  const { item } = useParams()

  const { addCartEvent } = useCart()

  const acai = useMemo<Acai>(() => {
    const defaultValue = acaiCategory.products[0]

    if (!item) {
      return defaultValue
    }

    const desiredProduct = acaiCategory.products.find(
      product => slang(product.name) === slang(item)
    )

    return desiredProduct ?? defaultValue
  }, [item])

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

  const total = useMemo<number>(() => {
    let result = acai.price

    for (const extra of extras.complements) {
      if (extra.price !== undefined) {
        result += extra.count * extra.price
      }
    }

    return result
  }, [acai, extras])

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
        onOrder={quantity =>
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
