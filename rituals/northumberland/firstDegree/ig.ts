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

export const IG_RITUALS: RitualSection[] = [
  {
    id: '1-ig-reports-door',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.IG,
    title: 'IG: Reports at the Door',
    content: [
      'IG. Bro. Junior Warden, there is a Report.',
      'IG. Bro. Junior Warden, the Candidate.',
      'IG. Bro. Tyler, whom have you there?',
      'IG. How does he hope to obtain those privileges?',
      'IG. Wait while I report to the Worshipful Master.',
      'TIG. Bro Junior Warden, the Inner Guard seeks re-admission,'
    ]
  },
  {
    id: '1-ig-report-wm',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.IG,
    title: 'IG: Report to the WM',
    content: [
      'IG. Worshipful Master, at the door of the Lodge stands Mr. -----, (full name) a poor Candidate in a state of darkness who has been well and worthily recommended, regularly proposed, balloted for, and approved in open Lodge, and now comes of his own free will and accord, properly prepared, humbly soliciting to be admitted to the mysteries and privileges of ancient Freemasonry.',
      'IG. By the help of God. Being free and of good report.',
      'IG. I do, Worshipful Master.'
    ]
  },
  {
    id: '1-ig-admission',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.IG,
    title: 'IG: Admission of the Candidate',
    content: [
      'IG. Do you feel anything?',
      'IG. Mr .------, (full name). In the name of the Great Architect of the Universe enter this Freemason’s Lodge on the point of a sharp instrument'
    ]
  }
];
