import { Banner, OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { formatCurrency, premiumCategory } from '../data'
import { useComplements, useProduct } from '../hooks'

export function PremiumPage(): React.JSX.Element {
  const copo = useProduct(premiumCategory)

  const { addCartEvent } = useCart()

  const [complement, addComplementEvent] = useComplements(
    (copo.complements ?? []).map(c => ({ name: c })),
    1
  )

  return (
    <div>
      <Banner img={copo.img} name={copo.name} imgClassName="object-top" />
      <div className="mx-auto w-11/12 max-w-4xl">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="whitespace-pre-line text-pretty">
              {copo.description}
            </p>
            {!!copo.quantity && <p>Contém aproximadamente {copo.quantity}g</p>}
            <span>
              {copo.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${copo.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(copo.price)}
            </span>
          </div>
        </div>

        {!!copo.complements && (
          <OrderComplements
            title="Fini"
            ctx={complement}
            addComplementEvent={addComplementEvent}
          />
        )}

        <OrderButton
          product={copo}
          totalPrice={copo.price}
          multiple
          validate={() => {
            if (copo.complements?.length && complement.countTotal === 0) {
              return 'Escolha seu Fini'
            }
          }}
          order={quantity =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: copo,
                complements: complement.complements,
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
