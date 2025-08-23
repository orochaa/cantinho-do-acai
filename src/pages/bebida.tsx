import { Banner } from '@/components/banner'
import { OrderButton } from '@/components/order-button'
import { OrderComplements } from '@/components/order-complements'
import { Seo } from '@/components/seo'
import { useCart } from '@/context/cart-provider'
import { useComplements } from '@/hooks/use-complements'
import { useProduct } from '@/hooks/use-product'
import { useTotal } from '@/hooks/use-total'
import { bebidaCategory } from '@/lib/data/bebida'

export function BebidaPage(): React.JSX.Element {
  const bebida = useProduct(bebidaCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useComplements(bebidaCategory.flavors, 20)

  const total = useTotal(0, ...flavors.complements)

  return (
    <div>
      <Seo
        title={`Bebida - ${bebida.name} - Cantinho do Açaí`}
        description={bebida.description}
        imgUrl={`https://cantinhodoacai.vercel.app${bebida.img}`}
      />
      <Banner
        img={bebida.img}
        name={bebida.name}
        imgClassName="object-center"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{bebida.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {bebida.description}
            </p>
            <span>
              {bebida.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${bebida.people} pessoas`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <OrderComplements
            addComplementEvent={addFlavorEvent}
            ctx={flavors}
            title="Sabores:"
          />
        </div>
        <OrderButton
          product={bebida}
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
                product: { ...bebida, price: 0 },
                complements: flavors.complements,
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
