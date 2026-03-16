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

export const SD_RITUALS: RitualSection[] = [
  {
    id: '3-sd-perambulation',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.SD,
    title: 'SD: Perambulation and Leading',
    content: [
      "ACTION: Take the Candidate by the right hand and lead him to the JW.",
      "SD. (To JW) Bro Junior Warden, I present to you Bro ------...",
      "...a Candidate properly prepared to be raised to the Third Degree.",
      "ACTION: Lead him to the SW.",
      "SD. (To SW) Bro Senior Warden, I present to you Bro ------...",
      "...a Candidate properly prepared to be raised to the Third Degree."
    ]
  },
  {
    id: '3-sd-advance-steps',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.SD,
    title: 'SD: Advancing to the Pedestal',
    content: [
      "SD. (To Candidate) The method of advancing to the Pedestal in this Degree...",
      "...is by seven steps, the first three as if over a grave, the remaining four as in the former degrees.",
      "SD. Commencing with the left foot.",
      "ACTION: Demonstrate the steps.",
      "SD. (Prompting) Left foot forward, right heel to left hollow...",
      "SD. Right foot forward, left heel to right hollow...",
      "SD. Proceed until you reach the Pedestal."
    ]
  }
];
