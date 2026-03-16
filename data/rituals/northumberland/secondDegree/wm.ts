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

export const WM_RITUALS: RitualSection[] = [
  {
    id: '2-opening-wm-full',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.WM,
    title: 'WM: Opening in the 2nd Degree',
    content: [
      "WM. Brethren, assist me to open the Lodge in the Second Degree.",
      "WM. Bro Junior Warden, what is the first care of every Fellow Craft?",
      "WM. Bro Senior Warden, what is the second care?",
      "WM. Bro Junior Warden, whence come you?",
      "WM. Whither are you directing your course?",
      "WM. What are you in search of?",
      "WM. How do you hope to find it?",
      "WM. By what is it found?",
      "WM. Bro Senior Warden, where is your constant place in the Lodge?",
      "WM. In the name of the Grand Geometrician of the Universe, I declare the Lodge duly open on the Square for the instruction and improvement of Fellow Crafts."
    ]
  },
  {
    id: '2-calling-the-candidate',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.WM,
    title: 'WM: Calling the Candidate',
    content: [
      "WM. (Gives * which is repeated by the Ws.)",
      "WM. Is there any Brother present desirous of being passed to the Second or Fellowcraft Degree?",
      "If so I must ask him to stand.",
      "WM. Is there any other Brother present below the rank of a Fellowcraft Freemason?",
      "If so I must ask him to retire."
    ]
  },
  {
    id: '2-questions-to-candidate',
    degree: Degree.SECOND,
    working: Working.NORTHUMBERLAND,
    office: Office.WM,
    title: 'WM: Questions to the Candidate',
    content: [
      "WM. Bro. ------, as you are a Candidate to be passed to the Second Degree...",
      "...I shall now proceed to put to you certain questions.",
      "WM. How were you initiated into Freemasonry?",
      "WM. What are the secrets of an Entered Apprentice?",
      "WM. What is the Word?",
      "WM. On what were you admitted to the Lodge?",
      "WM. These are the answers I expected. I shall now give you the Word of this Degree."
    ]
  }
];
