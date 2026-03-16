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
    id: '1-chaplain-prayer',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.CHAPLAIN,
    title: 'Chaplain: Prayer',
    content: [
      'Chaplain: Vouchsafe Thine aid, Almighty Father and Supreme Ruler of the Universe, to our present convention, and grant that this Candidate for F may so dedicate and devote his life to Thy service, as to become a true and faithful Brother among us. Endue him with a competency of Thy Divine wisdom so that, assisted by the secrets of our Masonic Art, he may be the better enabled to unfold the beauties of true godliness, to the honour and glory of Thy Holy Name.'
    ]
  }
];
