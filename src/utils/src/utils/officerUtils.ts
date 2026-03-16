import { Office } from '../types';

export const normalizeOfficer = (value: string): string => {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
};

export const normalizeWorking = (
  value: string
): { key: string; title: string } => {
  const title = String(value || '').trim();
  const key = title.toUpperCase().replace(/\s+/g, '_');
  return { key, title };
};

export const buildWorkingsIndex = (
  selectedDegree: string,
  selectedOffice: Office | string,
  rituals: any[]
) => {
  return (rituals || [])
    .filter((ritual) => ritual?.degree === selectedDegree)
    .filter((ritual) => {
      if (selectedOffice === 'ALL') return true;
      return ritual?.office === selectedOffice;
    })
    .map((ritual, index) => ({
      id: ritual?.id || `ritual-${index}`,
      title: ritual?.title || 'Untitled',
      count: Array.isArray(ritual?.steps)
        ? ritual.steps.length
        : Array.isArray(ritual?.content)
        ? ritual.content.length
        : 0,
      section: ritual,
    }));
};
