import { RitualSection } from '@/types';
import { NORTHUMBERLAND_RITUALS } from './northumberland';
import { EMULATION_RITUALS } from './emulation';

export const SAMPLE_RITUALS: RitualSection[] = [
  ...NORTHUMBERLAND_RITUALS,
  ...EMULATION_RITUALS,
];
