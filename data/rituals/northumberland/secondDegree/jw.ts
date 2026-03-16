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

export const JW_RITUALS: RitualSection[] = [
  {
    id: '2-opening-first-care',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.JW,
    title: 'Opening – First Care of a Fellowcraft',
    content: [
      "JW. To see the L properly tyled WM",
      "JW. Bro. IG, (wait for the salute) See that the L is properly tyled"
    ]
  },
  {
    id: '2-opening-jw-confirmation',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.JW,
    title: 'Opening – JW Confirmation',
    content: [
      "JW. I am, Worshipful Master, try me."
    ]
  }
];
