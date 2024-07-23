import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { felicidadeCategory, slang } from '../data'
import { useComplements } from '../hooks'

export function FelicidadePage(): React.JSX.Element {
  const { item } = useParams()

  const { addCartEvent } = useCart()

  const copo = useMemo(() => {
    const defaultValue = felicidadeCategory.products[0]

    if (!item) {
      return defaultValue
    }

    const desiredProduct = felicidadeCategory.products.find(
      product => slang(product.name) === slang(item)
    )

    return desiredProduct ?? defaultValue
  }, [item])

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
