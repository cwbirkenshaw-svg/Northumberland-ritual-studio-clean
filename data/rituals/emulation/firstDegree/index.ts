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
import { RitualSection } from '@/types';
import { WM_RITUALS } from './wm';
import { SW_RITUALS } from './sw';
import { JW_RITUALS } from './jw';
import { SD_RITUALS } from './sd';
import { JD_RITUALS } from './jd';
import { IG_RITUALS } from './ig';
import { TYLER_RITUALS } from './tyler';
import { CHAPLAIN_RITUALS } from './chaplain';
import { DC_RITUALS } from './dc';

export const FIRST_DEGREE_RITUALS: RitualSection[] = [
  ...WM_RITUALS,
  ...SW_RITUALS,
  ...JW_RITUALS,
  ...SD_RITUALS,
  ...JD_RITUALS,
  ...IG_RITUALS,
  ...TYLER_RITUALS,
  ...CHAPLAIN_RITUALS,
  ...DC_RITUALS,
];
