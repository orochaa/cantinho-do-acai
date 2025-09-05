import { categoriesList } from '@/lib/data/categories'
import { navigateToElement } from '@/lib/navigation'

interface DesktopNavProps {
  activeId: string | null
}

export function DesktopNav(props: DesktopNavProps): React.JSX.Element {
  const { activeId } = props

  return (
    <div className="sticky top-8 left-0">
      <nav className="absolute top-0 -left-48">
        <h2 className="mx-1 mb-2 text-lg font-medium text-white">Categorias</h2>
        <ul className="flex w-40 flex-col space-y-2">
          {categoriesList.map(category => (
            <li key={category.slang}>
              <button
                type="button"
                className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
                  activeId === category.slang
                    ? 'bg-amber-500 text-white'
                    : 'text-white/70 hover:bg-zinc-700/50 hover:text-white'
                }`}
                onClick={() => navigateToElement(category.slang)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
