export type Weekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface ScheduledPromo {
  type: 'scheduled-promo';
  start: Date;
  end: Date;
  price: number;
}

export interface ProductRelease {
  type: 'product-release';
  start: Date;
  end?: Date;
}

export interface ReleasePromo {
  type: 'release-promo';
  start: Date;
  end: Date;
  price: number;
  releaseEnd?: Date;
}

export interface WeeklyPromo {
  type: 'weekly-promo';
  weekday: Weekday;
  price: number;
}

export type Highlight =
  | ScheduledPromo
  | ProductRelease
  | ReleasePromo
  | WeeklyPromo;

export type HighlightPhase = 'promo' | 'release';

export interface ResolvedHighlight {
  highlight: Highlight;
  phase?: HighlightPhase;
}

const UTC_MINUS_THREE_HOURS = 3 * 60 * 60 * 1000;
const RELEASE_DURATION_DAYS = 30;
const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAY_INDEX: Record<Weekday, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export function localDate(value: string): Date {
  const match = CALENDAR_DATE_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
  const [, year, month, day] = match;
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function calendarDate(year: number, month: number, day: number): Date {
  return localDate(
    `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
  );
}

export function toLocalCalendarDate(value: Date): Date {
  const shifted = new Date(value.getTime() + UTC_MINUS_THREE_HOURS);
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      shifted.getUTCDate(),
    ),
  );
}

export function getLocalWeekday(value: Date): Weekday {
  const day = toLocalCalendarDate(value).getUTCDay();
  return (Object.keys(WEEKDAY_INDEX) as Array<Weekday>).find(
    weekday => WEEKDAY_INDEX[weekday] === day,
  ) as Weekday;
}

const addDays = (value: Date, days: number): Date =>
  new Date(value.getTime() + days * 24 * 60 * 60 * 1000);

const isOnOrAfter = (value: Date, start: Date): boolean => value >= start;
const isBefore = (value: Date, end: Date): boolean => value < end;

const getReleaseEnd = (highlight: ProductRelease | ReleasePromo): Date =>
  highlight.type === 'product-release'
    ? (highlight.end ?? addDays(highlight.start, RELEASE_DURATION_DAYS))
    : (highlight.releaseEnd ?? addDays(highlight.start, RELEASE_DURATION_DAYS));

const validatePromoPrice = (product: Product, price: number): void => {
  if (!(Number.isFinite(price) && price > 0 && price < product.price)) {
    throw new Error(
      `Promo price for ${product.name} must be positive and below the current product price.`,
    );
  }
};

export function resolveHighlight(
  product: Product,
  highlight: Highlight,
  now: Date,
): ResolvedHighlight | null {
  const date = toLocalCalendarDate(now);
  if (highlight.type === 'scheduled-promo') {
    validatePromoPrice(product, highlight.price);
    return isOnOrAfter(date, highlight.start) && isBefore(date, highlight.end)
      ? { highlight, phase: 'promo' }
      : null;
  }

  if (highlight.type === 'product-release') {
    const end = getReleaseEnd(highlight);
    return isOnOrAfter(date, highlight.start) && isBefore(date, end)
      ? { highlight, phase: 'release' }
      : null;
  }

  if (highlight.type === 'weekly-promo') {
    validatePromoPrice(product, highlight.price);
    return getLocalWeekday(now) === highlight.weekday
      ? { highlight, phase: 'promo' }
      : null;
  }

  validatePromoPrice(product, highlight.price);
  const releaseEnd = getReleaseEnd(highlight);
  const activeEnd = releaseEnd > highlight.end ? releaseEnd : highlight.end;
  if (!(isOnOrAfter(date, highlight.start) && isBefore(date, activeEnd))) {
    return null;
  }
  return {
    highlight,
    phase: isBefore(date, highlight.end) ? 'promo' : 'release',
  };
}

export function getActiveHighlight(
  product: Product,
  now: Date = new Date(),
): ResolvedHighlight | null {
  for (const highlight of product.highlights ?? []) {
    const resolved = resolveHighlight(product, highlight, now);
    if (resolved) {
      return resolved;
    }
  }
  return null;
}

export function resolveProduct<TProduct extends Product>(
  product: TProduct,
  now: Date = new Date(),
): TProduct {
  const resolved = getActiveHighlight(product, now);
  if (
    resolved?.highlight.type === 'scheduled-promo' ||
    resolved?.highlight.type === 'weekly-promo' ||
    (resolved?.highlight.type === 'release-promo' && resolved.phase === 'promo')
  ) {
    return { ...product, price: resolved.highlight.price };
  }
  return product;
}

export function getActiveHighlights(
  products: ReadonlyArray<Product>,
  now: Date = new Date(),
): Array<{ product: Product; resolved: ResolvedHighlight }> {
  return products.flatMap(product => {
    if (product.disabled) {
      return [];
    }
    const resolved = getActiveHighlight(product, now);
    return resolved
      ? [{ product: resolveProduct(product, now), resolved }]
      : [];
  });
}
