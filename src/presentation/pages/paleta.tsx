import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { paletaCategory } from '../data'
import { useComplements, useProduct, useTotal } from '../hooks'

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useComplements(paletaCategory.flavors, 20)

  const total = useTotal(0, ...flavors.complements)

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
        order={count =>
          addCartEvent({
            type: 'ADD',
            item: {
              product: { ...paleta, price: 0 },
              complements: flavors.complements,
              count,
            },
          })
        }
      />
    </>
  )
}
