import { formatCurrency } from '@/domain/format';
import { visibleMenu } from '@/domain/menu';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { DialogHeader } from './dialog-header';
import { Drawer } from './drawer';

interface MenuSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const commonSearches = ['Açaí', 'Copo', 'Pastel', 'Bebida'];

export function MenuSearch(props: MenuSearchProps): React.JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const drawerCloseRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (props.isOpen) {
      inputRef.current?.focus();
    }
  }, [props.isOpen]);

  if (!props.isOpen) {
    return null;
  }

  const normalizedQuery = normalize(query.trim());
  const results = visibleMenu.flatMap(entry => {
    const categoryMatches = normalize(entry.name).includes(normalizedQuery);
    return entry.products
      .filter(
        product =>
          categoryMatches || normalize(product.name).includes(normalizedQuery),
      )
      .map(product => ({ entry, product }));
  });

  const selectResult = (path: string): void => {
    drawerCloseRef.current?.();
    navigate(path);
  };

  return (
    <Drawer
      closeRef={drawerCloseRef}
      labelledBy="menu-search-title"
      open={props.isOpen}
      onClose={props.onClose}>
      <DialogHeader
        title="Buscar no cardápio"
        titleId="menu-search-title"
        closeLabel="Fechar busca"
        onClose={() => drawerCloseRef.current?.()}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {normalizedQuery.length === 0 ? (
          <div className="py-8">
            <p className="text-center text-zinc-600">
              Digite para buscar produtos ou escolha uma sugestão.
            </p>
            <p className="mt-6 text-sm font-semibold text-purple-950">
              Buscas comuns
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {commonSearches.map(search => (
                <button
                  className="min-h-11 rounded-full border border-purple-200 bg-purple-50 px-4 font-semibold text-purple-900 transition-colors hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                  key={search}
                  type="button"
                  onClick={() => setQuery(search)}>
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-zinc-600">
            Nenhum produto encontrado.
          </p>
        ) : (
          <ul
            className="flex flex-col-reverse gap-3"
            aria-label="Resultados da busca">
            {results.map(({ entry, product }) => (
              <li key={`${entry.route}-${product.slang}`}>
                <Link
                  className="flex min-h-20 items-center gap-3 rounded-xl border border-zinc-200 p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                  to={`/${entry.route}/${product.slang}`}
                  onClick={event => {
                    event.preventDefault();
                    selectResult(`/${entry.route}/${product.slang}`);
                  }}>
                  <img
                    alt=""
                    className="size-16 rounded-lg object-cover"
                    src={product.img}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-zinc-500">
                      {entry.name}
                    </span>
                    <span className="block truncate font-semibold text-purple-950">
                      {product.name}
                    </span>
                  </span>
                  <span className="font-semibold text-purple-950">
                    {formatCurrency(product.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <label
        className="mt-3 block text-sm font-semibold text-purple-950"
        htmlFor="menu-search-input">
        Buscar
        <input
          ref={inputRef}
          id="menu-search-input"
          className="mt-1 min-h-11 w-full rounded-xl border-2 border-zinc-300 px-3 text-base font-normal text-zinc-950 outline-none focus-visible:border-purple-700 focus-visible:ring-2 focus-visible:ring-purple-300"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </label>
    </Drawer>
  );
}
