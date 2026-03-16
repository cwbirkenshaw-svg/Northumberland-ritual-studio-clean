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
    id: '1-sw-presentation-wm',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'SW: Presentation to the WM',
    content: [
      'SW. WM, I present to you Mr. ----, a Candidate properly prepared to be made a Mason.',
      'SW. Bro. JD, It is the WM\'s command that you instruct the Candidate to advance to the Pedestal in due form.'
    ]
  },
  {
    id: '1-sw-examination',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'SW: Examination',
    content: [
      'SW. I would thank Bro ----- to advance to me as an Entered Apprentice Freemason.',
      'SW. Giving me the sign , grip or token and Word of that degree.',
      'SW. Pass -------'
    ]
  },
  {
    id: '1-sw-presentation-wm-2',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'SW: Presentation to the WM (Post-Examination)',
    content: [
      'SW. * WM, I present to you Bro ------., on his initiation, for some mark of your favour.'
    ]
  },
  {
    id: '1-sw-north-east-corner',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.SW,
    title: 'SW: North East Corner Directive',
    content: [
      'SW. Bro JD. It is the WM\'s command that you place our newly initiated Brother in the N. E. part of the Lodge.'
    ]
  }
];
