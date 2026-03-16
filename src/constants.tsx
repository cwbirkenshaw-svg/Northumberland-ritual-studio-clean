
import React from 'react';
import { Office, Degree, Working, VoiceOption } from '@/types';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Fenrir', label: 'The Commanding Officer', description: 'Deep, Powerful, Resonant' },
  { id: 'Charon', label: 'The Steady Officer', description: 'Serious, Firm, Resolute' },
  { id: 'Zephyr', label: 'The Eloquent Officer', description: 'Clear, Authoritative, Warm' },
];

/**
 * DEMO ACCESS CODES
 * In a production environment, these would be validated server-side.
 * Ritual words must NEVER be used as access credentials.
 */
export const APP_ACCESS_CODE = 'NORTH-PORTAL-2024';

export const UNLOCK_CODES = {
  EA: 'EA-ACCESS-DEMO',
  FC: 'FC-ACCESS-DEMO',
  MM: 'MM-ACCESS-DEMO',
  OFFICER: 'OFFICER-ACCESS-DEMO'
};

export const OFFICE_VOICE_MAP: Record<string, string> = {
  [Office.WM]: 'Zephyr',
  [Office.IPM]: 'Zephyr',
  [Office.SW]: 'Fenrir',
  [Office.JW]: 'Charon',
  [Office.SD]: 'Fenrir',
  [Office.JD]: 'Charon',
  [Office.IG]: 'Charon',
  [Office.TIG]: 'Charon',
  [Office.TYLER]: 'Fenrir',
  [Office.CHAPLAIN]: 'Zephyr',
  [Office.DC]: 'Fenrir',
  [Office.CANDIDATE]: 'Charon',
};

export const OFFICE_ICONS: Record<string, React.ReactNode> = {
  [Office.WM]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16" />
    </svg>
  ),
  [Office.SW]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20h18L12 4z M12 4v16" />
    </svg>
  ),
  [Office.JW]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18 M8 21h8 M12 18a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  ),
  [Office.SD]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4z M12 14v6 M9 17h6" />
    </svg>
  ),
  [Office.JD]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4z M12 14v6 M9 17h6" />
    </svg>
  ),
  [Office.IG]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5 M19 19L5 5" />
    </svg>
  ),
  [Office.TIG]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5 M19 19L5 5" />
    </svg>
  ),
  [Office.TYLER]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18 M9 6h6" />
    </svg>
  ),
  [Office.CHAPLAIN]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  [Office.DC]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21L17 3 M17 21L7 3" />
    </svg>
  ),
  [Office.IPM]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16 M12 4l-4 12h8z" />
    </svg>
  ),
  [Office.CANDIDATE]: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};


// Ritual data has been moved to src/rituals/index.ts
