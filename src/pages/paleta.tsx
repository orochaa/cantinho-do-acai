import { MultipleOptionsSelector } from '@/components/multiple-options-selector'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { useCart } from '@/context/cart-provider'
import { useMultipleOptions } from '@/hooks/use-multiple-options'
import { useProduct } from '@/hooks/use-product'
import { useTotal } from '@/hooks/use-total'
import { paletaCategory } from '@/lib/data/paleta'

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useMultipleOptions(
    paletaCategory.flavors,
    20
  )

  const total = useTotal(0, flavors.options)

  return (
    <>
      <Seo
        title={`Paletas - ${paleta.name} - Cantinho do Açaí`}
        description={paleta.description}
        imgUrl={`https://cantinhodoacai.vercel.app${paleta.img}`}
      />
      <div className="flex flex-col gap-8">
        <MultipleOptionsSelector
          dispatchEvent={addFlavorEvent}
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
              options: flavors.options,
              count,
            },
          })
        }
      />
    </>
  )
}
