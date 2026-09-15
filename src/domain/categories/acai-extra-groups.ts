import type { AcaiExtra } from '@/domain/categories/acai-extra';
import { groupOptionBy } from '@/domain/group-options';

const getAcaiExtraGroup = (name: AcaiExtra): string => {
  if (name.startsWith('Creme')) {
    return 'Cremes';
  }
  if (name.startsWith('Calda')) {
    return 'Caldas';
  }
  if (name === 'Kiwi') {
    return 'Frutas';
  }
  return 'Doces';
};

export const groupAcaiExtras = <TOption extends { name: AcaiExtra }>(
  extras: ReadonlyArray<TOption>,
) => groupOptionBy(extras, option => getAcaiExtraGroup(option.name));
