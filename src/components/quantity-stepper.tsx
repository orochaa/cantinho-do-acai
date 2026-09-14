import { Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface QuantityStepperProps {
  className?: string;
  count: number;
  decreaseIcon?: ReactNode;
  decreaseLabel: string;
  decreaseTitle: string;
  increaseDisabled?: boolean;
  increaseLabel: string;
  increaseTitle: string;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
}

export function QuantityStepper(
  props: QuantityStepperProps,
): React.JSX.Element {
  const {
    className,
    count,
    decreaseDisabled,
    decreaseIcon,
    decreaseLabel,
    decreaseTitle,
    increaseDisabled,
    increaseLabel,
    increaseTitle,
    onDecrease,
    onIncrease,
  } = props;

  return (
    <div
      className={twMerge(
        'flex items-center rounded-xl border border-purple-200 bg-white p-0.5 shadow-sm',
        className,
      )}>
      <button
        type="button"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-purple-700 disabled:text-zinc-400"
        aria-label={decreaseLabel}
        title={decreaseTitle}
        disabled={decreaseDisabled}
        onClick={onDecrease}>
        {decreaseIcon ?? <Minus className="size-5" />}
      </button>
      <span
        aria-live="polite"
        className="min-w-8 px-2 text-center font-semibold text-purple-950">
        {count}
      </span>
      <button
        type="button"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-purple-700 disabled:text-zinc-400"
        aria-label={increaseLabel}
        title={increaseTitle}
        disabled={increaseDisabled}
        onClick={onIncrease}>
        <Plus className="size-5" />
      </button>
    </div>
  );
}
