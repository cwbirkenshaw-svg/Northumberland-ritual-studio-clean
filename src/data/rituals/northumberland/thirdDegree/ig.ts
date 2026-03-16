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

export const IG_RITUALS: RitualSection[] = [
  {
    id: '3-ig-at-door',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.IG,
    title: 'IG: 3rd Degree at the Door',
    content: [
      "IG. (To WM) Worshipful Master, there is a report.",
      "IG. (To WM) It is Bro. ------, who has been regularly initiated into Freemasonry, passed to the Second Degree, and now seeks to be raised to the Third Degree.",
      "IG. (To Candidate) On what do you seek to be admitted to the Lodge?",
      "IG. (To WM) On the points of a Square and Compasses presented to his naked left and right breasts."
    ]
  },
  {
    id: '3-closing-direct-ig',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.IG,
    title: 'Closing from the 3rd Degree to the 1st Degree: Direct',
    content: [
      'IG. Bro. JW, the Lodge proves close tyled.'
    ]
  }
];
