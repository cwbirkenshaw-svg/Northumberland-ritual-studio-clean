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

export const SW_RITUALS: RitualSection[] = [
  {
    id: '3-sw-presentation',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'Presentation to the Worshipful Master',
    content: [
      "SW. WM, I present to you Brother --------, (full name) A Candidate properly prepared to be raised to the sublime degree of a Master Mason."
    ]
  },
  {
    id: '3-closing-direct-sw',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'Closing from the 3rd Degree to the 1st Degree: Direct',
    content: [
      'SW. To see that the Brethren appear to order as Master Masons.'
    ]
  }
];
