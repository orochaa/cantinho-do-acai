import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { ShoppingCart } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ComplementList } from '../components'
import { useAlert, useCart } from '../context'
import { paletaCategory } from '../data'
import { useComplements } from '../hooks'

export function PaletaPage(): React.JSX.Element {
  const paleta = paletaCategory.products[0]

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()

  const [flavors, addFlavorEvent] = useComplements(paletaCategory.flavors, 20)

  const total = useMemo(() => {
    let result = 0

    for (const flavor of flavors.complements) {
      if (flavor.price !== undefined) {
        result += flavor.count * flavor.price
      }
    }

    return result
  }, [flavors])

  return (
    <>
      <div className="flex flex-col gap-8">
        <ComplementList
          addComplementEvent={addFlavorEvent}
          ctx={flavors}
          title="Sabores"
        />
      </div>
      <div className="mx-auto mt-8 grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2 text-center">
          <Link
            to="/"
            className="rounded border border-white bg-zinc-200 p-2 hover:border-zinc-400 hover:bg-zinc-300/90"
          >
            Voltar
          </Link>
          <button
            type="button"
            className="rounded border border-red-300 bg-red-500 p-2 text-white hover:border-red-400 hover:bg-red-500/90"
            onClick={() => {
              const complements = flavors.complements
                .filter(i => i.count > 0)
                .map(i => ({
                  count: i.count,
                  name: i.name,
                  price: i.price,
                }))

              if (complements.length > 0) {
                addCartEvent({
                  type: 'ADD',
                  item: {
                    product: paleta,
                    complements,
                  },
                  initialPrice: 0,
                })
                popMessage(`${paleta.name} adicionada ao carrinho`)
              } else {
                popMessage('Favor escolher uma ou mais Paletas')
              }
            }}
          >
            Adicionar R${formatCurrency(total)}
          </button>
        </div>
        <Link
          to="/cart"
          className="flex items-center justify-center gap-2 rounded border-2 border-red-600 bg-zinc-50 p-2 font-semibold"
        >
          <ShoppingCart size={22} className="text-red-600" /> Ver carrinho
        </Link>
      </div>
    </>
  )
}
