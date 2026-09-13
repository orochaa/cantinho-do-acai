import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export interface CategoryCardProps {
  href: string;
  image: string;
  name: string;
  loading?: 'eager' | 'lazy';
}

export function CategoryCard(props: CategoryCardProps): React.JSX.Element {
  return (
    <Link
      aria-label={`Ver categoria ${props.name}`}
      className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-violet-400/70 bg-white/15 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 motion-reduce:transition-none"
      to={props.href}>
      <img
        alt={`Imagem da categoria ${props.name}`}
        className="size-full object-cover transition duration-500 group-hover:scale-110 motion-reduce:transition-none"
        loading={props.loading ?? 'lazy'}
        src={props.image}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent transition-opacity group-hover:opacity-85" />
      <span className="absolute inset-x-3 bottom-3 flex min-h-11 items-center justify-between gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 text-sm font-bold text-purple-950 shadow-sm backdrop-blur-sm transition-[background-color,transform] group-hover:bg-white group-hover:translate-y-0.5 sm:text-base motion-reduce:transition-none">
        <span className="truncate">{props.name}</span>
        <ChevronRight
          aria-hidden="true"
          className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
