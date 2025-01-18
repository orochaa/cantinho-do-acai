import { Banner, OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { formatCurrency, salgadosCategory } from '../data'
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
    <div>
      <Banner img={salgado.img} name={salgado.name} />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{salgado.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="whitespace-pre-line text-pretty">
              {salgado.description}
            </p>
            {!!salgado.quantity && (
              <p>Contém aproximadamente {salgado.quantity}g</p>
            )}
            <span>
              {salgado.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${salgado.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(salgado.price)}
            </span>
          </div>
        </div>
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
          order={count =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: salgado,
                complements: [complements, sauces].flatMap(i => i.complements),
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
