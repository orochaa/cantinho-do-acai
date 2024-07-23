import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { salgadosCategory, slang } from '../data'
import { useComplements } from '../hooks'

export function SalgadosPage(): React.JSX.Element {
  const { item } = useParams()

  const { addCartEvent } = useCart()

  const salgado = useMemo(() => {
    const defaultValue = salgadosCategory.products[0]

    if (!item) {
      return defaultValue
    }

    const desiredProduct = salgadosCategory.products.find(
      product => slang(product.name) === slang(item)
    )

    return desiredProduct ?? defaultValue
  }, [item])

  const [complements, addComplementEvent] = useComplements(
    salgado.complements.map(name => ({ name })),
    salgado.complementsLimit
  )

  const [sauces, addSauceEvent] = useComplements(
    salgado.sauces.map(name => ({ name })),
    salgado.saucesLimit
  )

  return (
    <>
      <div className="flex flex-col gap-8">
        <OrderComplements
          addComplementEvent={addComplementEvent}
          ctx={complements}
          title="Salgados:"
        />
        <OrderComplements
          addComplementEvent={addSauceEvent}
          ctx={sauces}
          title="Molhos:"
        />
      </div>
      <OrderButton
        product={salgado}
        totalPrice={salgado.price}
        multiple
        onOrder={quantity =>
          addCartEvent({
            type: 'ADD',
            item: {
              product: salgado,
              complements: [
                ...complements.complements.filter(item => item.count > 0),
                ...sauces.complements.filter(sauce => sauce.count > 0),
              ],
              quantity,
            },
          })
        }
      />
    </>
  )
}
