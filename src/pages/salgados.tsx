import { Banner } from '@/components/banner'
import { MultipleOptionsSelector } from '@/components/multiple-options-selector'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { SingleOptionSelector } from '@/components/single-option-selector'
import { useCart } from '@/context/cart-provider'
import { useMultipleOptions } from '@/hooks/use-multiple-options'
import { useProduct } from '@/hooks/use-product'
import { useSingleOption } from '@/hooks/use-single-option'
import { salgadosCategory } from '@/lib/data/salgados'
import { formatCurrency } from '@/lib/format'

export function SalgadosPage(): React.JSX.Element {
  const salgado = useProduct(salgadosCategory)

  const { addCartEvent } = useCart()

  const [complements, addComplementEvent] = useMultipleOptions(
    salgado.complements.map(name => ({ name })),
    salgado.complementsLimit
  )

  const [sauces, addSauceEvent] = useSingleOption(
    salgado.sauces.map(name => ({ name }))
  )

  return (
    <div>
      <Seo
        title={`Salgados - ${salgado.name} - Cantinho do Açaí`}
        description={salgado.description}
        imgUrl={`https://cantinhodoacai.vercel.app${salgado.img}`}
      />
      <Banner img={salgado.img} name={salgado.name} />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{salgado.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
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
          <MultipleOptionsSelector
            dispatchEvent={addComplementEvent}
            ctx={complements}
            title="Salgados:"
          />
          <SingleOptionSelector
            onSelectionChange={addSauceEvent}
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

            if (!sauces.isSelected) {
              return 'Favor escolher molho'
            }
          }}
          order={count =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: salgado,
                options: [complements, sauces].flatMap(item => item.options),
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
