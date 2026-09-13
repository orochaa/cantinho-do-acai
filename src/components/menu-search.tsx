import { formatCurrency } from '@/domain/format';
import { visibleMenu } from '@/domain/menu';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { DialogHeader } from './dialog-header';
import { ResponsiveDialog } from './responsive-dialog';

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
  const resultsViewportRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();
  const drawerCloseRef = useRef<(() => void) | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia('(min-width: 700px)');
    const update = (): void => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!props.isOpen) {
      wasOpenRef.current = false;
      setQuery('');
      setActiveResultIndex(-1);
      return;
    }
    if (!wasOpenRef.current || isDesktop) {
      wasOpenRef.current = true;
      inputRef.current?.focus();
    }
  }, [isDesktop, props.isOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!props.isOpen) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (resultsViewportRef.current) {
        resultsViewportRef.current.scrollTop =
          resultsViewportRef.current.scrollHeight;
      }
    });
  }, [props.isOpen, query]);

  if (!props.isOpen) {
    return null;
  }

  const normalizedQuery = normalize(query.trim());
  const results = visibleMenu.flatMap(entry =>
    entry.products
      .map(product => {
        const categoryName = normalize(entry.name);
        const productName = normalize(product.name);
        const productMatch = productName.includes(normalizedQuery);
        const categoryMatch = categoryName.includes(normalizedQuery);
        if (!(productMatch || categoryMatch)) {
          return null;
        }
        const score =
          productName === normalizedQuery
            ? 300
            : productName.startsWith(normalizedQuery)
              ? 200
              : productMatch
                ? 100
                : 10;
        return { entry, product, score };
      })
      .filter(
        (result): result is NonNullable<typeof result> => result !== null,
      ),
  );
  const rankedResults = results.toSorted((a, b) => b.score - a.score);
  const displayResults = rankedResults.toReversed();
  const selectedResultIndex =
    activeResultIndex >= 0
      ? activeResultIndex
      : isDesktop && normalizedQuery.length > 0 && displayResults.length > 0
        ? displayResults.length - 1
        : -1;

  const selectResult = (path: string): void => {
    drawerCloseRef.current?.();
    navigate(path);
  };

  const moveResultFocus = (index: number): void => {
    if (displayResults.length === 0) {
      return;
    }
    const nextIndex = (index + displayResults.length) % displayResults.length;
    setActiveResultIndex(nextIndex);
    window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(
        `[data-search-result-index="${nextIndex}"]`,
      );
      target?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const content = (
    <>
      <DialogHeader
        title="Buscar no cardápio"
        titleId="menu-search-title"
        closeLabel="Fechar busca"
        onClose={() =>
          isDesktop ? props.onClose() : drawerCloseRef.current?.()
        }
      />
      <div
        ref={resultsViewportRef}
        className="min-h-0 flex flex-1 flex-col overflow-y-auto">
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
                  onClick={() => {
                    setQuery(search);
                  }}>
                  {search}
                </button>
              ))}
            </div>
          </div>
        ) : displayResults.length === 0 ? (
          <p className="py-8 text-center text-zinc-600">
            Nenhum produto encontrado.
          </p>
        ) : (
          <ul
            className="mt-auto flex flex-col gap-3"
            aria-label="Resultados da busca">
            {displayResults.map(({ entry, product }, index) => (
              <li key={`${entry.route}-${product.slang}`}>
                <Link
                  aria-current={
                    selectedResultIndex === index ? 'true' : undefined
                  }
                  data-search-result-index={index}
                  className={`flex min-h-20 items-center gap-3 rounded-xl border p-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 motion-reduce:transition-none ${selectedResultIndex === index ? 'border-purple-700 bg-purple-50 ring-2 ring-purple-200' : 'border-zinc-200'}`}
                  to={`/${entry.route}/${product.slang}`}
                  onClick={event => {
                    event.preventDefault();
                    selectResult(`/${entry.route}/${product.slang}`);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      moveResultFocus(index + 1);
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      moveResultFocus(index - 1);
                    }
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
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              moveResultFocus(
                activeResultIndex < 0 ? 0 : activeResultIndex + 1,
              );
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              moveResultFocus(
                activeResultIndex < 0
                  ? displayResults.length - 1
                  : activeResultIndex - 1,
              );
            } else if (event.key === 'Enter' && selectedResultIndex >= 0) {
              event.preventDefault();
              const result = displayResults[selectedResultIndex];
              if (result) {
                selectResult(`/${result.entry.route}/${result.product.slang}`);
              }
            }
          }}
          onChange={event => {
            setActiveResultIndex(-1);
            setQuery(event.target.value);
          }}
        />
      </label>
    </>
  );

  return (
    <ResponsiveDialog
      closeRef={drawerCloseRef}
      labelledBy="menu-search-title"
      open={props.isOpen}
      onClose={props.onClose}
      onOpened={() => inputRef.current?.focus()}>
      {content}
    </ResponsiveDialog>
  );
}
