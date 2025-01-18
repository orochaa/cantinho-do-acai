import { Banner, OrderButton, OrderComplements } from '../components'
import { useCart } from '../context'
import { acaiCategory, formatCurrency } from '../data'
import { useComplements, useProduct, useTotal } from '../hooks'

export function AcaiPage(): React.JSX.Element {
  const acai = useProduct(acaiCategory)

  const { addCartEvent } = useCart()

  const [type, addTypeEvent] = useComplements(
    acai.type.map((name, i) => ({ name, count: i === 0 ? 1 : 0 })),
    1
  )

  const [complements, addComplementEvent] = useComplements(
    acai.complements.map(name => ({ name })),
    acai.complementsLimit
  )

  const [extras, addExtraEvent] = useComplements(
    Object.entries(acai.extras).map(([name, price]) => ({ name, price })),
    acai.extrasLimit
  )

  const total = useTotal(acai.price, ...extras.complements)

  return (
    <div>
      <Banner img={acai.img} name={acai.name} />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{acai.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="whitespace-pre-line text-pretty">
              {acai.description}
            </p>
            {!!acai.quantity && <p>Contém aproximadamente {acai.quantity}g</p>}
            <span>
              {acai.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${acai.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(acai.price)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <OrderComplements
            addComplementEvent={addTypeEvent}
            ctx={type}
            title="Tipo de Açaí:"
          />
          <OrderComplements
            addComplementEvent={addComplementEvent}
            ctx={complements}
            title="Acompanhamentos:"
          />
          <OrderComplements
            addComplementEvent={addExtraEvent}
            ctx={extras}
            title="Adicionais:"
          />
        </div>
        <OrderButton
          product={acai}
          totalPrice={total}
          multiple
          order={count =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: acai,
                complements: [type, complements, extras].flatMap(
                  i => i.complements
                ),
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
