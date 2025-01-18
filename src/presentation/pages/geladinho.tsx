import { Banner, OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { geladinhoCategory } from '../data'
import { useComplements, useProduct, useTotal } from '../hooks'

export function GeladinhoPage(): React.JSX.Element {
  const geladinho = useProduct(geladinhoCategory)

  const { addCartEvent } = useCart()

  const [flavors, addFlavorEvent] = useComplements(
    geladinhoCategory.flavors,
    20
  )

  const total = useTotal(0, ...flavors.complements)

  return (
    <div>
      <Banner
        img={geladinho.img}
        name={geladinho.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12 max-w-4xl">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{geladinho.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="whitespace-pre-line text-pretty">
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
          <OrderComplements
            addComplementEvent={addFlavorEvent}
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
          order={quantity =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: { ...geladinho, price: 0 },
                complements: flavors.complements,
                quantity,
              },
            })
          }
        />
      </div>
      <span className="block h-20" />
    </div>
  )
}
