import type { ResolvedHighlight } from '@/domain/highlights';
import { cn } from '@/lib/format';
import type { ClassValue } from 'clsx';

const getLabel = (resolved: ResolvedHighlight): string => {
  if (resolved.highlight.type === 'scheduled-promo') {
    return 'Promoção';
  }
  if (resolved.highlight.type === 'weekly-promo') {
    return 'Promoção do dia';
  }
  if (resolved.highlight.type === 'product-release') {
    return 'Lançamento';
  }
  return resolved.phase === 'promo' ? 'Promoção de lançamento' : 'Lançamento';
};

export function HighlightPill(props: {
  resolved: ResolvedHighlight | null | undefined;
  className?: ClassValue;
}): React.JSX.Element | null {
  if (!props.resolved) {
    return null;
  }

  const isPromo =
    props.resolved.highlight.type === 'scheduled-promo' ||
    props.resolved.highlight.type === 'weekly-promo' ||
    (props.resolved.highlight.type === 'release-promo' &&
      props.resolved.phase === 'promo');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-1 text-[0.7rem] font-semibold shadow-sm transition-colors',
        isPromo
          ? 'border-amber-400/80 bg-amber-50/90 text-amber-900 shadow-amber-950/10 ring-1 ring-amber-200/60'
          : 'border-purple-200 bg-purple-50/80 text-purple-900 shadow-purple-950/5',
        props.className,
      )}>
      {getLabel(props.resolved)}
    </span>
  );
}
