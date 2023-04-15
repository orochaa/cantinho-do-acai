import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { ShoppingCart } from 'lucide-react'
import { useMemo, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { ItemList } from '../components/item-list'
import { useAlert, useCart } from '../context'
import { complementReducer, paleta } from '../data'

export function PaletaPage(): JSX.Element {
  const product = paleta.products[0]

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()

  const [flavors, addFlavorEvent] = useReducer<typeof complementReducer>(
    complementReducer,
    paleta.flavors.map(complement => ({
      name: complement,
      price: 10,
      count: 0,
      total: 0,
      max: 20
    }))
  )

  const total = useMemo(() => {
    let result = 0
    flavors.forEach(flavor => {
      result += flavor.count * (flavor.price as number)
    })
    return result
  }, [product, flavors])

  return (
    <>
      <div className="flex flex-col gap-8">
        <ItemList
          addComplementEvent={addFlavorEvent}
          complements={flavors}
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
            className="rounded border border-red-300 bg-red-500 p-2 text-white hover:border-red-400 hover:bg-red-500/90"
            onClick={() => {
              const complements = flavors
                .filter(i => i.count > 0)
                .map(i => ({
                  count: i.count,
                  name: i.name,
                  price: i.price
                }))
              if (complements.length > 0) {
                addCartEvent({
                  type: 'ADD',
                  item: {
                    product,
                    complements
                  },
                  initialPrice: 0
                })
                popMessage(`${product.name} adicionada ao carrinho`)
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
