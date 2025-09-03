import { Banner } from '@/components/banner'
import { Container } from '@/components/container'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { SingleOptionSelector } from '@/components/single-option-selector'
import { useCart } from '@/context/cart-provider'
import { useProduct } from '@/hooks/use-product'
import { useSingleOption } from '@/hooks/use-single-option'
import { premiumCategory } from '@/lib/data/premium'
import { formatCurrency } from '@/lib/format'
import { useState } from 'react'

export function PremiumPage(): React.JSX.Element {
  const copo = useProduct(premiumCategory)

  const [observation, setObservation] = useState<string>('')

  const { addCartEvent } = useCart()

  const [complements, selectComplement] = useSingleOption(
    (copo.complements ?? []).map(c => ({ name: c }))
  )

  return (
    <div>
      <Seo
        title={`Açaí Premium ${copo.name} - Cantinho do Açaí`}
        description={copo.description}
        imgUrl={`https://cantinhodoacai.vercel.app${copo.img}`}
      />
      <Banner img={copo.img} name={copo.name} imgClassName="object-top" />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
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

        <div className="flex flex-col gap-8">
          {!!copo.complements && (
            <SingleOptionSelector
              title="Fini"
              ctx={complements}
              onSelectionChange={selectComplement}
            />
          )}

          <Container>
            <label
              htmlFor="observation"
              className="m-1 text-xl font-bold text-white"
            >
              Observação
            </label>
            <textarea
              id="observation"
              rows={4}
              className="font-lato rounded-sm bg-white p-2 outline-hidden"
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Ex: Favor retirar..."
            />
          </Container>
        </div>

        <OrderButton
          product={copo}
          totalPrice={copo.price}
          multiple
          validate={() => {
            if (copo.complements?.length && !complements.isSelected) {
              return 'Escolha seu Fini'
            }
          }}
          order={count =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: copo,
                options: complements.options,
                count,
                observation,
              },
            })
          }
        />
      </div>
      <span className="block h-20" />
    </div>
  )
}
