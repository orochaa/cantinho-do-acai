import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { felicidadeCategory } from '../data'
import { useComplements, useProduct } from '../hooks'

export function FelicidadePage(): React.JSX.Element {
  const copo = useProduct(felicidadeCategory)

  const { addCartEvent } = useCart()

  const [size, addSizeEvent] = useComplements(
    felicidadeCategory.size.map(item =>
      item.price ? item : { ...item, count: 1 }
    ),
    1
  )

  return (
    <>
      <div className="flex flex-col gap-8">
        <OrderComplements
          addComplementEvent={addSizeEvent}
          ctx={size}
          title="Tamanho:"
        />
      </div>
      <OrderButton
        product={copo}
        totalPrice={
          copo.price + (size.complements.find(c => c.count > 0)?.price ?? 0)
        }
        multiple
        order={quantity =>
          addCartEvent({
            type: 'ADD',
            item: {
              product: copo,
              complements: size.complements.filter(item => item.count > 0),
              quantity,
            },
          })
        }
      />
    </>
  )
}
