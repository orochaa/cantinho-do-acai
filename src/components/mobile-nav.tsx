import { categoriesList } from '@/lib/data/categories'
import { navigateToElement } from '@/lib/navigation'

interface MobileNavProps {
  activeId: string | null
}

export function MobileNav(props: MobileNavProps): React.JSX.Element {
  const { activeId } = props

  return (
    <nav className="sticky top-2 z-50 my-4 w-full">
      <div className="relative">
        <select
          value={activeId ?? ''}
          onChange={e => navigateToElement(e.target.value)}
          className="peer w-full appearance-none rounded-md border-2 border-zinc-500 bg-zinc-800 p-3 font-semibold text-white scheme-dark transition-colors focus:border-amber-500 focus:outline-none"
        >
          <option value="" disabled>
            Navegue pelas categorias
          </option>
          {categoriesList.map(category => (
            <option key={category.slang} value={category.slang}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/70 transition-colors peer-focus:text-white">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </nav>
  )
}
