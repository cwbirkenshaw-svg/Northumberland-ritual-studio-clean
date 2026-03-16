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

export const SD_RITUALS: RitualSection[] = [
  {
    id: '2-sd-perambulation',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.SD,
    title: 'SD: Perambulation and Leading',
    content: [
      "ACTION: Take the Candidate by the right hand and lead him to the JW.",
      "SD. (To JW) Bro Junior Warden, I present to you Bro ------...",
      "...a Candidate properly prepared to be passed to the Second Degree.",
      "ACTION: Lead him to the SW.",
      "SD. (To SW) Bro Senior Warden, I present to you Bro ------...",
      "...a Candidate properly prepared to be passed to the Second Degree.",
      "ACTION: Lead him to the Pedestal.",
      "SD. (To WM) Worshipful Master, I present to you Bro ------...",
      "...a Candidate properly prepared to be passed to the Second Degree."
    ]
  },
  {
    id: '2-sd-advance-steps',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.SD,
    title: 'SD: Advancing to the Pedestal',
    content: [
      "SD. (To Candidate) The method of advancing to the Pedestal in this Degree...",
      "...is by five steps, as if ascending a winding staircase.",
      "SD. Commencing with the left foot.",
      "ACTION: Demonstrate the steps.",
      "SD. (Prompting) Left foot forward, right heel to left hollow...",
      "SD. Right foot forward, left heel to right hollow...",
      "SD. Proceed until you reach the Pedestal."
    ]
  }
];
