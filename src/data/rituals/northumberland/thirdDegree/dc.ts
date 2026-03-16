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
    id: '3-ceremony-conclusion',
    degree: Degree.THIRD,
    working: Working.NORTHUMBERLAND,
    office: Office.DC,
    title: 'Conclusion of the Ceremony',
    content: [
      'DC. Brother -----, this concludes the ceremony of your being raised to the sublime degree of a Master Mason...',
      'DC. Nothing now remains but for me to inform you that on entering or leaving a Lodge in this degree you will salute the WM...'
    ]
  }
];
