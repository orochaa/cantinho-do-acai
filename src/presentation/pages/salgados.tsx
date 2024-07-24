import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { salgadosCategory } from '../data'
import { useComplements, useProduct } from '../hooks'

export function SalgadosPage(): React.JSX.Element {
  const salgado = useProduct(salgadosCategory)

  const { addCartEvent } = useCart()

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
        validate={() => {
          if (complements.countTotal === 0) {
            return 'Favor escolher salgados'
          }

          if (sauces.countTotal === 0) {
            return 'Favor escolher molho'
          }
        }}
        order={quantity =>
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
