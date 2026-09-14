import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...className: Array<ClassValue>): string {
  return twMerge(clsx(...className));
}
