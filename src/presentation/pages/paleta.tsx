import { useMemo } from 'react'
import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { paletaCategory } from '../data'
import { useComplements, useProduct } from '../hooks'

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useComplements(paletaCategory.flavors, 20)

  const total = useMemo(() => {
    let result = 0

    for (const flavor of flavors.complements) {
      if (flavor.price !== undefined) {
        result += flavor.count * flavor.price
      }
    }

    return result
  }, [flavors])

  return (
    <>
      <div className="flex flex-col gap-8">
        <OrderComplements
          addComplementEvent={addFlavorEvent}
          ctx={flavors}
          title="Sabores:"
        />
      </div>
      <OrderButton
        product={paleta}
        totalPrice={total}
        validate={() => {
          if (flavors.countTotal === 0) {
            return 'Favor escolher sabores'
          }
        }}
        order={quantity =>
          addCartEvent({
            type: 'ADD',
            item: {
              product: paleta,
              complements: flavors.complements.filter(f => f.count > 0),
              quantity,
            },
          })
        }
      />
    </>
  )
}
