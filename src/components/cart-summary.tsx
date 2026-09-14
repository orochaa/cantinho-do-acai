import type { CartItem } from '@/domain/cart';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';

const visibleDuration = 3000;
const transitionDuration = 180;
const swipeCloseDistance = 80;

export function CartSummary(props: {
  cart: ReadonlyArray<CartItem>;
  request: number;
}): React.JSX.Element | null {
  const location = useLocation();
  const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('hidden');
  const [presentationKey, setPresentationKey] = useState(0);
  const currentY = useRef(
    typeof window === 'undefined' ? 0 : window.innerHeight,
  );
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const actionVersion = useRef(0);
  const fadeTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);
  const dismissTimer = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const itemCount = props.cart.reduce((sum, item) => sum + item.count, 0);
  const total = props.cart.reduce((sum, item) => sum + item.total, 0);

  useEffect(() => {
    if (props.request === 0) {
      return;
    }

    if (fadeTimer.current !== null) {
      window.clearTimeout(fadeTimer.current);
    }
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
    }
    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current);
    }
    const version = ++actionVersion.current;
    if (phaseRef.current !== 'hidden') {
      setPresentationKey(key => key + 1);
    }
    if (phaseRef.current !== 'visible') {
      setPhase('visible');
    }
    const nextFadeTimer = window.setTimeout(() => {
      if (version !== actionVersion.current) {
        return;
      }
      fadeTimer.current = null;
      setPhase('fading');
    }, visibleDuration);
    const nextHideTimer = window.setTimeout(() => {
      if (version !== actionVersion.current) {
        return;
      }
      hideTimer.current = null;
      setPhase('hidden');
    }, visibleDuration + transitionDuration);
    fadeTimer.current = nextFadeTimer;
    hideTimer.current = nextHideTimer;
    return () => {
      window.clearTimeout(nextFadeTimer);
      window.clearTimeout(nextHideTimer);
      if (dismissTimer.current !== null) {
        window.clearTimeout(dismissTimer.current);
      }
    };
  }, [props.request]);

  if (location.pathname === '/cart' || phase === 'hidden') {
    return null;
  }

  const dismiss = (): void => {
    actionVersion.current += 1;
    if (fadeTimer.current !== null) {
      window.clearTimeout(fadeTimer.current);
      fadeTimer.current = null;
    }
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (dismissTimer.current !== null) {
      window.clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    setPhase('hidden');
  };

  return (
    <motion.div
      key={presentationKey}
      animate={{
        y: phase === 'fading' ? '100%' : 0,
        opacity: phase === 'fading' ? 0 : 1,
      }}
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 mx-auto flex max-w-md items-center justify-between rounded-xl bg-white px-4 py-3 text-purple-950 shadow-xl md:hidden"
      drag="y"
      dragConstraints={{ bottom: window.innerHeight, top: 0 }}
      dragElastic={0.2}
      dragMomentum
      dragTransition={{
        modifyTarget: target => Math.min(Math.max(target, 0), 120),
        power: 0.2,
        timeConstant: 40,
      }}
      initial={{ y: Math.max(currentY.current, 0), opacity: 0 }}
      transition={{ duration: transitionDuration / 1000, ease: 'easeOut' }}
      onUpdate={latest => {
        if (typeof latest.y === 'number') {
          currentY.current = latest.y;
        }
      }}
      onDragEnd={(_, info) => {
        if (info.offset.y >= swipeCloseDistance) {
          dismiss();
        }
      }}
      onPointerDown={event => {
        pointerStartY.current = event.clientY;
      }}
      onPointerUp={event => {
        if (
          pointerStartY.current !== null &&
          event.clientY - pointerStartY.current >= swipeCloseDistance
        ) {
          dismiss();
        }
        pointerStartY.current = null;
      }}>
      <span className="text-sm font-semibold">
        {singularOrPlural(itemCount, 'item', 'itens')} · {formatCurrency(total)}
      </span>
      <Link
        className="min-h-11 rounded-lg bg-purple-700 px-4 py-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
        to="/cart">
        Ver carrinho
      </Link>
    </motion.div>
  );
}
