import { Banner } from '@/components/banner'
import { Description } from '@/components/description'
import { OrderButton } from '@/components/order-button'
import { Seo } from '@/components/seo'
import { SingleOptionSelector } from '@/components/single-option-selector'
import { useCart } from '@/context/cart-provider'
import { useProduct } from '@/hooks/use-product'
import { useSingleOption } from '@/hooks/use-single-option'
import { useTotal } from '@/hooks/use-total'
import { felicidadeCategory } from '@/lib/data/felicidade'
import { formatCurrency } from '@/lib/format'

export function FelicidadePage(): React.JSX.Element {
  const copo = useProduct(felicidadeCategory)

  const { addCartEvent } = useCart()

  const [size, selectSizeOption] = useSingleOption(
    felicidadeCategory.size.map((item, i) => ({ ...item, isSelected: i === 0 }))
  )

  const total = useTotal(copo.price, size.options)

  return (
    <div>
      <Seo
        title={`Copo da Felicidade ${copo.name} - Cantinho do Açaí`}
        description={copo.description}
        imgUrl={`https://cantinhodoacai.vercel.app${copo.img}`}
      />
      <Banner img={copo.img} name={copo.name} imgClassName="object-top" />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{copo.description}</Description>
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

        <SingleOptionSelector
          onSelectionChange={selectSizeOption}
          ctx={size}
          title="Tamanho:"
        />
        <OrderButton
          product={copo}
          totalPrice={total}
          multiple
          order={count =>
            addCartEvent({
              type: 'ADD',
              item: {
                product: copo,
                options: size.options,
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
