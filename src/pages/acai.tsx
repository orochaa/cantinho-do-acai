import { Banner } from '@/components/banner'
import { MultipleOptionsSelector } from '@/components/multiple-options-selector'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { SingleOptionSelector } from '@/components/single-option-selector'
import { useCart } from '@/context/cart-provider'
import { useMultipleOptions } from '@/hooks/use-multiple-options'
import { useProduct } from '@/hooks/use-product'
import { useSingleOption } from '@/hooks/use-single-option'
import { useTotal } from '@/hooks/use-total'
import { acaiCategory } from '@/lib/data/acai'
import { formatCurrency } from '@/lib/format'

export function AcaiPage(): React.JSX.Element {
  const acai = useProduct(acaiCategory)

  const { addCartEvent } = useCart()

  const [acaiTypes, selectAcaiType] = useSingleOption(
    acai.type.map((name, i) => ({ name, isSelected: i === 0 }))
  )

  const [complements, addComplementEvent] = useMultipleOptions(
    acai.complements.map(name => ({ name })),
    acai.complementsLimit
  )

  const [extras, addExtraEvent] = useMultipleOptions(
    Object.entries(acai.extras).map(([name, price]) => ({ name, price })),
    acai.extrasLimit
  )

  const total = useTotal(acai.price, extras.options)

  return (
    <div>
      <Seo
        title={`Açaí ${acai.name} - Cantinho do Açaí`}
        description={acai.description}
        imgUrl={`https://cantinhodoacai.vercel.app${acai.img}`}
      />
      <Banner img={acai.img} name={acai.name} />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{acai.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
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
          <SingleOptionSelector
            onSelectionChange={selectAcaiType}
            ctx={acaiTypes}
            title="Tipo de Açaí:"
          />
          <MultipleOptionsSelector
            dispatchEvent={addComplementEvent}
            ctx={complements}
            title="Acompanhamentos:"
          />
          <MultipleOptionsSelector
            dispatchEvent={addExtraEvent}
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
                options: [acaiTypes, complements, extras].flatMap(
                  item => item.options
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
