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
import { FIRST_DEGREE_RITUALS } from './firstDegree';
import { SECOND_DEGREE_RITUALS } from './secondDegree';
import { THIRD_DEGREE_RITUALS } from './thirdDegree';

export const NORTHUMBERLAND_RITUALS: RitualSection[] = [
  ...FIRST_DEGREE_RITUALS,
  ...SECOND_DEGREE_RITUALS,
  ...THIRD_DEGREE_RITUALS,
];
