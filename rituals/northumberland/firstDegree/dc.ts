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

export const DC_RITUALS: RitualSection[] = [
  {
    id: '1-dc-be-seated',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.DC,
    title: 'DC: Be Seated',
    content: [
      'DC. Be seated Brethren.'
    ]
  },
  {
    id: '1-dc-departure',
    degree: Degree.FIRST,
    working: Working.NORTHUMBERLAND,
    office: Office.DC,
    title: 'DC: Departure of Candidate',
    content: [
      'DC. Bro--------., This completes the ceremony of your initiation. A period of twenty-eight days must elapse before you can be admitted to a superior degree. In the meantime you must learn the answers to certain questions in which you will be instructed by your proposer or seconder.',
      'Also the Lodge Mentor W/Bro [name] , will assist you if you have any questions or Queries.',
      'With regard to Freemasonry which cannot be answered by them.',
      'Nothing now remains but for me to inform you that on entering or leaving a Lodge open in this degree you will salute the',
      'Worshipful Master in the chair with the whole of the sign you have just been shown. Follow me.',
      'You will now salute, retire in order to restore yourself to your personal comforts and we will see you later in the evening.'
    ]
  }
];
