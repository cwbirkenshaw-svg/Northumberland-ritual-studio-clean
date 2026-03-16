/**
 * MASTER RITUAL FILE
 *
 * This file contains the authoritative ritual wording for this working.
 *
 * DO NOT MODIFY for learning tools, prompts, summaries, accessibility modes,
 * memory aids, practice copies, or alternative display versions.
 *
 * Any derived or learning version must be stored separately under:
 * src/learning/
 */
import { Degree, Office, RitualSection, Working } from '@/types';

export const CHAPLAIN_RITUALS: RitualSection[] = [
  {
    id: '3-prayer',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.CHAPLAIN,
    title: 'Prayer',
    content: [
      'Chaplain: Almighty and Eternal God, Architect and Ruler of the Universe...'
    ]
  }
];
