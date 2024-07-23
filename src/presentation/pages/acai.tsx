import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ComplementList, OrderButton } from '../components'
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
        <ComplementList
          addComplementEvent={addComplementEvent}
          ctx={complements}
          title="Acompanhamentos"
        />
        <ComplementList
          addComplementEvent={addExtraEvent}
          ctx={extras}
          title="Adicionais"
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
              complements: [...complements.complements, ...extras.complements]
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
