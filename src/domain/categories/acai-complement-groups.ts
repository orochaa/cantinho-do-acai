import type { AcaiComplement } from '@/domain/categories/acai-complements';
import { groupOptionBy } from '@/domain/group-options';

const getAcaiComplementGroup = (name: AcaiComplement): string =>
  name === 'Banana' || name === 'Morango' || name === 'Manga'
    ? 'Frutas'
    : 'Doces';

export const groupAcaiComplements = <TOption extends { name: AcaiComplement }>(
  complements: ReadonlyArray<TOption>,
) => groupOptionBy(complements, option => getAcaiComplementGroup(option.name));
