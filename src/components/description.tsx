import type React from 'react';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

export interface DescriptionProps {
  children: ReactNode;
}

export function Description(props: DescriptionProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const descriptionId = useId();
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (paragraph === null) {
      return;
    }
    if (isExpanded) {
      return;
    }

    const updateOverflow = (): void => {
      const nextHasOverflow = paragraph.scrollHeight > paragraph.clientHeight;
      setHasOverflow(current =>
        current === nextHasOverflow ? current : nextHasOverflow,
      );
    };

    updateOverflow();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(paragraph);

    return () => resizeObserver.disconnect();
  }, [isExpanded]);

  const handleToggle = useCallback((): void => {
    setIsExpanded(isExpanded => !isExpanded);
  }, []);

  return (
    <div>
      <p
        id={descriptionId}
        ref={paragraphRef}
        className={`${isExpanded ? 'line-clamp-none' : 'line-clamp-5'} text-left text-pretty whitespace-pre-line`}>
        {props.children}
      </p>
      {!!hasOverflow && (
        <button
          type="button"
          className="mt-1 block w-full rounded text-center text-sm font-medium text-purple-600 underline decoration-purple-300 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
          aria-controls={descriptionId}
          aria-expanded={isExpanded}
          onClick={handleToggle}>
          {isExpanded ? 'mostrar menos' : 'mostrar mais'}
        </button>
      )}
    </div>
  );
}
