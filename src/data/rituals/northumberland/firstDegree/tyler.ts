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
import { Degree, Office, RitualSection, Working } from '../../../../types';

export const TYLER_RITUALS: RitualSection[] = [
  {
    id: '1-tyler-dialogue',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.TYLER,
    title: 'Tyler: Candidate Dialogue',
    content: [
      'T. Mr. ------ (full name) , a poor Candidate in a state of darkness who has been well and worthily recommended, regularly proposed, balloted for, and approved in open Lodge, and now comes of his own free will and accord, properly prepared, humbly soliciting to be admitted to the mysteries and privileges of ancient Freemasonry.',
      'T. By the help of God, being free and of good report.'
    ]
  }
];
