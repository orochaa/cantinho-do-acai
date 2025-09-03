import { Banner } from '@/components/banner'
import { MultipleOptionsSelector } from '@/components/multiple-options-selector'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { useCart } from '@/context/cart-provider'
import { useMultipleOptions } from '@/hooks/use-multiple-options'
import { useProduct } from '@/hooks/use-product'
import { useTotal } from '@/hooks/use-total'
import { geladinhoCategory } from '@/lib/data/geladinho'

export function GeladinhoPage(): React.JSX.Element {
  const geladinho = useProduct(geladinhoCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useMultipleOptions(
    geladinhoCategory.flavors,
    20
  )

  const total = useTotal(0, flavors.options)

  return (
    <div>
      <Seo
        title={`Geladinho - ${geladinho.name} - Cantinho do Açaí`}
        description={geladinho.description}
        imgUrl={`https://cantinhodoacai.vercel.app${geladinho.img}`}
      />
      <Banner
        img={geladinho.img}
        name={geladinho.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{geladinho.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {geladinho.description}
            </p>
            {!!geladinho.quantity && (
              <p>Contém aproximadamente {geladinho.quantity}g</p>
            )}
            <span>
              {geladinho.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${geladinho.people} pessoas`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <MultipleOptionsSelector
            dispatchEvent={addFlavorEvent}
            ctx={flavors}
            title="Sabores:"
          />
        </div>
        <OrderButton
          product={geladinho}
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
                product: { ...geladinho, price: 0 },
                options: flavors.options,
                count,
              },
            })
          }
        />
      </div>
      <span className="block h-20" />
    </div>
  )
}
