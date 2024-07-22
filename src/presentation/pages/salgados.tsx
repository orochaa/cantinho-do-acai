import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { ShoppingCart } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ComplementList } from '../components'
import { useAlert, useCart } from '../context'
import { salgadosCategory, slang } from '../data'
import { useComplements } from '../hooks'

export function SalgadosPage(): React.JSX.Element {
  const { item } = useParams()

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()

  const salgado = useMemo(() => {
    const defaultValue = salgadosCategory.products[0]

    if (!item) {
      return defaultValue
    }

    const desiredProduct = salgadosCategory.products.find(
      product => slang(product.name) === slang(item)
    )

    return desiredProduct ?? defaultValue
  }, [item])

  const [complements, addComplementEvent] = useComplements(
    salgado.complements.map(name => ({ name })),
    salgado.complementsLimit
  )

  const [sauces, addSauceEvent] = useComplements(
    salgado.sauces.map(name => ({ name })),
    salgado.saucesLimit
  )

  return (
    <>
      <div className="flex flex-col gap-8">
        <ComplementList
          addComplementEvent={addComplementEvent}
          ctx={complements}
          title="Salgados"
        />
        <ComplementList
          addComplementEvent={addSauceEvent}
          ctx={sauces}
          title="Molhos"
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
              let totalItems = 0

              for (const complement of complements.complements) {
                totalItems += complement.count
              }

              if (totalItems === salgado.complementsLimit) {
                addCartEvent({
                  type: 'ADD',
                  item: {
                    product: salgado,
                    complements: complements.complements
                      .filter(i => i.count > 0)
                      .map(i => ({
                        count: i.count,
                        name: i.name,
                      })),
                  },
                  initialPrice: salgado.price,
                })
                popMessage(`${salgado.name} adicionado ao carrinho`)
              } else {
                popMessage('Favor escolher todos salgados')
              }
            }}
          >
            Adicionar R${formatCurrency(salgado.price)}
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
